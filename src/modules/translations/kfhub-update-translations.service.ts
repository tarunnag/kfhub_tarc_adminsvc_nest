import { KfDbException, KfException } from '@kf-products-core/kfhub_svc_lib';
import { Injectable } from '@nestjs/common';
import { getConnection, getManager } from 'typeorm';
import { v4 } from 'uuid';
import { Common } from '../../common/common.interface';
import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';

export interface CompetencesTranslationTableView {
    CompetencyModelTemplateID: string;
    ModelType: string;
    ModelId: string;
    Version: string;
    LCID: string;
    ModelName: string;
    ModelDescription: string;
    LanguagesSupported: string[];
    FactorType: string;
    FactorId: string;
    FactorOriginalId: string;
    FactorName: string;
    FactorLabel: string;
    FactorDescription: string;
    FactorOrder: string;
    ClusterType: string;
    ClusterId: string;
    ClusterOriginalId: string;
    ClusterName: string;
    ClusterLabel: string;
    ClusterDescription: string;
    ClusterOrder: string;
    CompetencyType: string;
    CompetencyId: string;
    CompetencyOriginalId: string;
    CompetencyName: string;
    CompetencyDescription: string;
    CompetencyOrder: string;

    GlobalCode: string;
    KFLAModelFlatDataLoadID: number;
}

export interface TraitsDriverTableView {
    GlobalCode: string;
    LCID: string;
    TraitsDriversName: string;
    TraitsDriversDescription: string;
    TraitsDriversTranslationID: number;
}

@Injectable()
export class KfHubUpdateTranslationsService {
    async insertToCompetenciesStatusTable(userId: number): Promise<{ id: number; guid: string }> {
        try {
            const guid: string = await this.getCompetenciesStatusGUID();

            const [insertEscapedQuery, insertParameters] = getConnection().driver.escapeQueryWithParameters(
                `INSERT [CMM].[dbo].[KFLAModelFlatDataLoadStatus] ([KFLAModelFlatDataLoadGUID], [KFLAModelFlatDataLoadStatusID], [CreatedBy]) VALUES (:KFLAModelFlatDataLoadGUID, 0, :CreatedBy);`,
                {
                    KFLAModelFlatDataLoadGUID: guid,
                    CreatedBy: userId,
                },
                {},
            );

            await getManager().query(insertEscapedQuery, insertParameters);

            const [selectEscapedQuery, selectParameters] = getConnection().driver.escapeQueryWithParameters(
                `SELECT [KFLAModelFlatDataLoadID] FROM [CMM].[dbo].[KFLAModelFlatDataLoadStatus] WHERE [KFLAModelFlatDataLoadGUID] = :GUID`,
                { GUID: guid },
                {},
            );

            return { id: (await getManager().query(selectEscapedQuery, selectParameters))[0].KFLAModelFlatDataLoadID, guid };
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }

    async insertToCompetenciesStagingTable(translation: CompetencesTranslationTableView): Promise<void> {
        try {
            const [insertEscapedQuery, insertParameters] = getConnection().driver.escapeQueryWithParameters(
                `INSERT [CMM].[dbo].[KFLAModelFlatData] (
                [CompetencyModelTemplateID]
                ,[ModelType]
                ,[ModelId]
                ,[Version]
                ,[LCID]
                ,[ModelName]
                ,[ModelDescription]
                ,[LanguagesSupported]
                ,[FactorType]
                ,[FactorId]
                ,[FactorOriginalId]
                ,[FactorName]
                ,[FactorLabel]
                ,[FactorDescription]
                ,[FactorOrder]
                ,[ClusterType]
                ,[ClusterId]
                ,[ClusterOriginalId]
                ,[ClusterName]
                ,[ClusterLabel]
                ,[ClusterDescription]
                ,[ClusterOrder]
                ,[CompetencyType]
                ,[CompetencyId]
                ,[CompetencyOriginalId]
                ,[CompetencyName]
                ,[CompetencyDescription]
                ,[CompetencyOrder]
                ,[GlobalCode]
                ,[KFLAModelFlatDataLoadID]
            ) VALUES (
                :CompetencyModelTemplateID
                ,:ModelType
                ,:ModelId
                ,:Version
                ,:LCID
                ,:ModelName
                ,:ModelDescription
                ,:LanguagesSupported
                ,:FactorType
                ,:FactorId
                ,:FactorOriginalId
                ,:FactorName
                ,:FactorLabel
                ,:FactorDescription
                ,:FactorOrder
                ,:ClusterType
                ,:ClusterId
                ,:ClusterOriginalId
                ,:ClusterName
                ,:ClusterLabel
                ,:ClusterDescription
                ,:ClusterOrder
                ,:CompetencyType
                ,:CompetencyId
                ,:CompetencyOriginalId
                ,:CompetencyName
                ,:CompetencyDescription
                ,:CompetencyOrder
                ,:GlobalCode
                ,:KFLAModelFlatDataLoadID);`,
                {
                    ...translation,
                },
                {},
            );

            await getManager().query(insertEscapedQuery, insertParameters);
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }

    async insertToTraitsDriversStatusTable(userId: number): Promise<{ id: number; guid: string }> {
        try {
            const guid: string = await this.getTraitsDriversStatusGUID();

            const [insertEscapedQuery, insertParameters] = getConnection().driver.escapeQueryWithParameters(
                `INSERT [SuccessProfile].[dbo].[TraitsDriversTranslationStatus] ([TraitsDriversTranslationGUID], [TraitsDriversTranslationStatusID], [CreatedBy]) VALUES (:TraitsDriversTranslationGUID, 0, :CreatedBy);`,
                {
                    TraitsDriversTranslationGUID: guid,
                    CreatedBy: userId,
                },
                {},
            );

            await getManager().query(insertEscapedQuery, insertParameters);

            const [selectEscapedQuery, selectParameters] = getConnection().driver.escapeQueryWithParameters(
                `SELECT [TraitsDriversTranslationID] FROM [SuccessProfile].[dbo].[TraitsDriversTranslationStatus] WHERE [TraitsDriversTranslationGUID] = :GUID`,
                { GUID: guid },
                {},
            );

            return { id: (await getManager().query(selectEscapedQuery, selectParameters))[0].TraitsDriversTranslationID, guid };
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }

    async insertToTraitsDriversStagingTable(translation: TraitsDriverTableView): Promise<void> {
        try {
            const [insertEscapedQuery, insertParameters] = getConnection().driver.escapeQueryWithParameters(
                `INSERT [SuccessProfile].[dbo].[TraitsDriversTranslations] (
                    [GlobalCode]
                    ,[LCID]
                    ,[TraitsDriversName]
                    ,[TraitsDriversDescription]
                    ,[TraitsDriversTranslationID]
                ) VALUES (
                    :GlobalCode,
                    :LCID,
                    :TraitsDriversName,
                    :TraitsDriversDescription,
                    :TraitsDriversTranslationID
                )`,
                { ...translation },
                {},
            );

            await getManager().query(insertEscapedQuery, insertParameters);
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }

    async updateTranslations(GUID: string, category: Common.Query.Categories, LCID: string, CMSLCID: string): Promise<void> {
        try {
            const [escapedQuery, parameters] = getConnection().driver.escapeQueryWithParameters(
                `exec [SuccessProfile].[dbo].[LoadCMSTranslations] :SectionCode, :GUID, :LCID, :CMSLCID`,
                {
                    SectionCode: this.getCategory(category),
                    GUID,
                    LCID,
                    CMSLCID,
                },
                {},
            );

            await getManager().query(escapedQuery, parameters);
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }

    private async getCompetenciesStatusGUID(): Promise<string> {
        let existingGUIDs: string[] = [];
        try {
            const [escapedQuery, parameters] = getConnection().driver.escapeQueryWithParameters(
                `SELECT [KFLAModelFlatDataLoadGUID] FROM [CMM].[dbo].[KFLAModelFlatDataLoadStatus]`,
                {},
                {},
            );

            existingGUIDs = await getManager().query(escapedQuery, parameters);
        } catch ({ message }) {
            throw new KfDbException(message);
        }

        return this.generateGUID(existingGUIDs);
    }

    private async getTraitsDriversStatusGUID(): Promise<string> {
        let existingGUIDs: string[] = [];
        try {
            const [escapedQuery, parameters] = getConnection().driver.escapeQueryWithParameters(
                `SELECT [TraitsDriversTranslationGUID] FROM [SuccessProfile].[dbo].[TraitsDriversTranslationStatus]`,
                {},
                {},
            );

            existingGUIDs = await getManager().query(escapedQuery, parameters);
        } catch ({ message }) {
            throw new KfDbException(message);
        }

        return this.generateGUID(existingGUIDs);
    }

    private generateGUID(list: string[]) {
        const guid: string = v4();
        return list.indexOf(guid) >= 0 ? this.generateGUID(list) : guid;
    }

    private getCategory(category: Common.Query.Categories): string {
        switch (category) {
            case Common.Query.Categories.COMPETENCIES:
                return 'BEHAVIORAL_SKILLS';
            case Common.Query.Categories.TRAITS:
                return 'TRAITS';
            case Common.Query.Categories.DRIVERS:
                return 'DRIVERS';
            default:
                throw new KfException('Unsupported category', 500, ec.INTERNAL_SERVER_ERROR);
        }
    }
}
