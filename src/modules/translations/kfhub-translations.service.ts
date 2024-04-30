import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Axios from 'axios';
import { Common } from '../../common/common.interface';
import { CmsConnectionService } from './cms-connection.service';
import { KfHubTranslationsRepository } from './kfhub-translations.repository';
import { TranslationDTO, TranslationsDTO } from './kfhub-translations.dto';
import * as CmsConnectionInterface from './cms-connection.interface';
import { KfTranslationsEntity } from './kfhub-translations.entity';
import { KfException, KfHttpsService } from '@kf-products-core/kfhub_svc_lib';
import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { CompetencesTranslationTableView, KfHubUpdateTranslationsService, TraitsDriverTableView } from './kfhub-update-translations.service';

@Injectable()
export class KfHubTranslationsService {
    private readonly logger = new Logger('KfHubTranslationsService');
    constructor(
        private readonly cmsConnection: CmsConnectionService,
        @InjectRepository(KfHubTranslationsRepository)
        private readonly repository: KfHubTranslationsRepository,
        private http: KfHttpsService,
        private updateTranslationsService: KfHubUpdateTranslationsService,
    ) {}

    async getTranslations(query: Common.Query.TranslationProps): Promise<TranslationsDTO[]> {
        const cmsTranslations: { [key: string]: TranslationDTO } = await this.getCMSTranslations(query.cmsLanguageId, query.categoryId);
        this.logger.log(cmsTranslations);
        const translationsEn = this.getTranslationsMap(await this.repository.getTranslations('en', query.categoryId));
        this.logger.log(translationsEn);
        const translationsLang = this.getTranslationsMap(await this.repository.getTranslations(query.languageId, query.categoryId));
        this.logger.log(translationsLang);
        return this.combineTranslations(translationsEn, cmsTranslations, translationsLang);
    }

    async updateTranslations(body: Common.Query.TranslationProps, authToken: string): Promise<boolean> {
        if (!authToken) {
            const msg = `Unexpected authToken value: ${authToken}`;
            this.logger.log(msg);
            throw new KfException(msg, 400, ec.INPUT_VALIDATION_FAILED);
        }

        let tokenMeta;
        try {
            tokenMeta = await this.getTokenMeta(authToken);
        } catch (err) {
            const msg = `Error when trying to get token meta: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.INTERNAL_SERVER_ERROR);
        }
        const userId: number = parseInt(tokenMeta.userid, 10);
        switch (body.categoryId) {
            case Common.Query.Categories.COMPETENCIES:
                await this.updateCompetencies(userId, body.categoryId, body.languageId, body.cmsLanguageId);
                break;
            case Common.Query.Categories.TRAITS:
                await this.updateTraits(userId, body.categoryId, body.languageId, body.cmsLanguageId);
                break;
            case Common.Query.Categories.DRIVERS:
                await this.updateDrivers(userId, body.categoryId, body.languageId, body.cmsLanguageId);
                break;
        }
        return true;
    }

    private getTranslationsMap(translations: KfTranslationsEntity[]): {
        [key: string]: TranslationDTO;
    } {
        return translations.reduce((acc, trans) => {
            acc[trans.GlobalCode.toLocaleLowerCase()] = {
                name: trans.JobSubcategoryName,
                description: trans.JobSubcategoryDescription,
            };
            return acc;
        }, {});
    }

    private async getCMSTranslations(lang: string, categoryId: Common.Query.Categories): Promise<{ [key: string]: TranslationDTO }> {
        let cmsTranslations = {};
        switch (categoryId) {
            case Common.Query.Categories.COMPETENCIES:
                cmsTranslations = this.getCompetenciesTranslationsFromResponse(await this.cmsConnection.getCompetenciesTranslations(lang));
                break;
            case Common.Query.Categories.TRAITS:
                cmsTranslations = this.getTraitsTranslationsFromResponse(await this.cmsConnection.getTraitsDriversTranslations(lang));
                break;
            case Common.Query.Categories.DRIVERS:
                cmsTranslations = this.getDriversTranslationsFromResponse(await this.cmsConnection.getTraitsDriversTranslations(lang));
                break;
        }
        return cmsTranslations;
    }

    private combineTranslations(
        english: {
            [key: string]: TranslationDTO;
        },
        cms: {
            [key: string]: TranslationDTO;
        },
        deployed: {
            [key: string]: TranslationDTO;
        },
    ): TranslationsDTO[] {
        return Object.keys(english).reduce((acc, globalCode) => {
            acc = [
                ...acc,
                {
                    english: english[globalCode],
                    cms: cms[globalCode],
                    deployed: deployed[globalCode],
                },
            ];

            return acc;
        }, []);
    }

    private getCompetenciesTranslationsFromResponse(response: CmsConnectionInterface.CMSCompetences): { [key: string]: TranslationDTO } {
        const result = response.factors.reduce((acc, factor) => {
            factor.clusters.forEach((cluster) => {
                cluster.competencies.forEach((competency) => {
                    acc[competency.globalCode.toLowerCase()] = {
                        name: competency.name,
                        description: competency.description,
                    };
                });
            });
            return acc;
        }, {});
        return result;
    }

    private getTraitsTranslationsFromResponse(response: CmsConnectionInterface.CMSTraitsDrivers): { [key: string]: TranslationDTO } {
        const definitions = response.sections.traits.components.traitsScores.content.definitions;
        const result = Object.keys(definitions).reduce((resultAcc, definitionKey) => {
            const definition = definitions[definitionKey];
            Object.keys(definition).forEach((code) => {
                const item = definition[code];
                resultAcc[item.globalCode.toLowerCase()] = {
                    name: item.title,
                    description: item.definition,
                };
            });
            return resultAcc;
        }, {});
        return result;
    }

    private getDriversTranslationsFromResponse(response: CmsConnectionInterface.CMSTraitsDrivers): { [key: string]: TranslationDTO } {
        const definitions = response.sections.drivers.components.driversScores.content.definitions;
        return Object.keys(definitions).reduce((acc, definitionKey) => {
            acc[definitionKey.toLowerCase()] = {
                name: definitions[definitionKey].name,
                description: definitions[definitionKey].definition,
            };
            return acc;
        }, {});
    }

    private async updateCompetencies(userId: number, categoryId: Common.Query.Categories, languageId: string, cmsLanguageId: string): Promise<void> {
        const { id, guid } = await this.updateTranslationsService.insertToCompetenciesStatusTable(userId);
        let translations = [];
        try {
            translations = this.prepareCompetencesToInsert(await this.cmsConnection.getCompetenciesTranslations(cmsLanguageId), cmsLanguageId, id);
        } catch (err) {
            const msg = `Error when trying to get token meta: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.INTERNAL_SERVER_ERROR);
        }

        translations.forEach(async (translation) => await this.updateTranslationsService.insertToCompetenciesStagingTable(translation));

        await this.updateTranslationsService.updateTranslations(guid, categoryId, languageId, cmsLanguageId);
    }

    private async updateTraits(userId: number, categoryId: Common.Query.Categories, languageId: string, cmsLanguageId: string): Promise<void> {
        const { id, guid } = await this.updateTranslationsService.insertToTraitsDriversStatusTable(userId);
        let translations = [];
        try {
            translations = this.prepareTraitsToInsert(await this.cmsConnection.getTraitsDriversTranslations(cmsLanguageId), cmsLanguageId, id);
        } catch (err) {
            const msg = `Error when trying to get token meta: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.INTERNAL_SERVER_ERROR);
        }

        translations.forEach(async (translation) => await this.updateTranslationsService.insertToTraitsDriversStagingTable(translation));

        await this.updateTranslationsService.updateTranslations(guid, categoryId, languageId, cmsLanguageId);
    }

    private async updateDrivers(userId: number, categoryId: Common.Query.Categories, languageId: string, cmsLanguageId: string): Promise<void> {
        const { id, guid } = await this.updateTranslationsService.insertToTraitsDriversStatusTable(userId);
        let translations = [];
        try {
            translations = this.prepareDriversToInsert(await this.cmsConnection.getTraitsDriversTranslations(cmsLanguageId), cmsLanguageId, id);
        } catch (err) {
            const msg = `Error when trying to get token meta: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.INTERNAL_SERVER_ERROR);
        }

        translations.forEach(async (translation) => await this.updateTranslationsService.insertToTraitsDriversStagingTable(translation));

        await this.updateTranslationsService.updateTranslations(guid, categoryId, languageId, cmsLanguageId);
    }

    private async getTokenMeta(authToken: string): Promise<any> {
        try {
            const headers = {
                'Content-Type': 'application/json',
                authToken,
            };
            const { URL_KFHUB_API_BASE, TOKEN_METADATA_PATH } = Common.Enum;
            const axios: any = Axios.create({
                headers,
            });
            const result = (await axios.get(URL_KFHUB_API_BASE + TOKEN_METADATA_PATH)).data;

            if (!result.userid) {
                throw new Error(`Unexpected response when getting token meta: ${JSON.stringify(result)}`);
            }

            return result;
        } catch (e) {
            throw new Error('Error in get request to: ' + Common.Enum.TOKEN_METADATA_PATH + ' ' + e.message);
        }
    }

    private prepareCompetencesToInsert(response: CmsConnectionInterface.CMSCompetences, LCID: string, id: number): CompetencesTranslationTableView[] {
        return response.factors.reduce((acc, factor, factorOrder) => {
            factor.clusters.forEach((cluster, clusterOrder) => {
                cluster.competencies.forEach((competency, competencyOrder) => {
                    acc.push({
                        CompetencyModelTemplateID: 1, // set to 1 per Veera's feedback
                        ModelType: response.type,
                        ModelId: response.id,
                        Version: null,
                        LCID,
                        ModelName: response.name,
                        ModelDescription: response.description,
                        LanguagesSupported: response.langs,
                        FactorType: factor.type,
                        FactorId: factor.id,
                        FactorOriginalId: null,
                        FactorName: factor.name,
                        FactorLabel: factor.label,
                        FactorDescription: factor.description,
                        FactorOrder: factorOrder + 1,
                        ClusterType: cluster.type,
                        ClusterId: cluster.id,
                        ClusterOriginalId: null,
                        ClusterName: cluster.name,
                        ClusterLabel: cluster.label,
                        ClusterDescription: cluster.description,
                        ClusterOrder: clusterOrder + 1,
                        CompetencyType: competency.type,
                        CompetencyId: competency.id,
                        CompetencyOriginalId: null,
                        CompetencyName: competency.name,
                        CompetencyDescription: competency.description,
                        CompetencyOrder: competencyOrder + 1,
                        GlobalCode: competency.globalCode,
                        KFLAModelFlatDataLoadID: id,
                    });
                });
            });
            return acc;
        }, []);
    }

    private prepareTraitsToInsert(response: CmsConnectionInterface.CMSTraitsDrivers, LCID: string, id: number): TraitsDriverTableView[] {
        const definitions = response.sections.traits.components.traitsScores.content.definitions;
        const result: TraitsDriverTableView[] = Object.keys(definitions).reduce((acc, definitionKey) => {
            const definition = definitions[definitionKey];
            Object.keys(definition).forEach((code) => {
                const item = definition[code];
                acc.push({
                    GlobalCode: item.globalCode,
                    LCID,
                    TraitsDriversName: item.title,
                    TraitsDriversDescription: item.definition,
                    TraitsDriversTranslationID: id,
                });
            });
            return acc;
        }, []);
        return result;
    }

    private prepareDriversToInsert(response: CmsConnectionInterface.CMSTraitsDrivers, LCID: string, id: number): TraitsDriverTableView[] {
        const definitions = response.sections.drivers.components.driversScores.content.definitions;
        return Object.keys(definitions).reduce((acc, globalCode) => {
            const item = definitions[globalCode];
            acc.push({
                GlobalCode: globalCode.toUpperCase(),
                LCID,
                TraitsDriversName: item.name,
                TraitsDriversDescription: item.definition,
                TraitsDriversTranslationID: id,
            });
            return acc;
        }, []);
    }
}
