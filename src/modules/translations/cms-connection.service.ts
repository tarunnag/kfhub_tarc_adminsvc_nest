import { KfConfigService, KfException, KfHttpsService } from '@kf-products-core/kfhub_svc_lib';
import { Injectable, Logger } from '@nestjs/common';
import Axios from 'axios';
import { KfExceptionCodes as ec } from '../../kfthm-exception-codes.enum';
import * as CmsConnectionInterface from './cms-connection.interface';
import { Common as c } from '../../common/common.interface';

@Injectable()
export class CmsConnectionService {
    private readonly host = c.Enum.TRANSLATIONS_URL;
    private readonly logger = new Logger('CmsConnectionService');

    constructor(private readonly configService: KfConfigService) {}

    async getCompetenciesTranslations(lang: string): Promise<CmsConnectionInterface.CMSCompetences> {
        try {
            this.logger.log('Try to get competencies translations');
            const headers = await this.getHeaders();
            const response = await this.getRequest(`${this.host}internal/caas/kfla/model/projects.internal.kfla.models.kfla?lang=${lang}`, headers);
            return response as CmsConnectionInterface.CMSCompetences;
        } catch (e) {
            this.logger.error(e, 'Error in getCompetenciesTranslations');
            throw new KfException(e.message, 500, ec.INTERNAL_SERVER_ERROR);
        }
    }

    async getTraitsDriversTranslations(lang: string): Promise<CmsConnectionInterface.CMSTraitsDrivers> {
        try {
            this.logger.log('Try to get traits and drivers translations');
            const headers = await this.getHeaders();
            const response = await this.getRequest(
                `${this.host}internal/caas/publications/contentDictionary/manifests/projects.internal.products.reports.traitsDrivers?lang=${lang}&tag=v1`,
                headers,
            );
            return response as CmsConnectionInterface.CMSTraitsDrivers;
        } catch (e) {
            this.logger.error(e, 'Error in getTraitsDriversTranslations');
            throw new KfException(e.message, 500, ec.INTERNAL_SERVER_ERROR);
        }
    }

    private async getToken(): Promise<string> {
        try {
            this.logger.log('Try to get token for cms translation access');
            const accessKeys = {
                accessKey: this.configService.get('AUTH_ACCESS_KEY'),
            };
            const headers = {
                'x-api-key': this.configService.get('TRANSLATION_CMS_API_KEY'),
            };
            const response = (await this.postRequest(`${this.host}authenticate`, accessKeys, headers)) as CmsConnectionInterface.GetTokenResponse;

            if (!response.success) {
                this.logger.error(`Get token failed ${response}`);
                throw new KfException('Get token failed', 500, ec.INTERNAL_SERVER_ERROR);
            }

            return response.token;
        } catch (e) {
            this.logger.error('Error in getToken', e);
            throw new KfException(e.message, 500, ec.INTERNAL_SERVER_ERROR);
        }
    }

    private async getHeaders(): Promise<{ Authorization: string; 'x-api-key': string }> {
        return {
            Authorization: await this.getToken(),
            'x-api-key': this.configService.get('TRANSLATION_CMS_API_KEY'),
        };
    }

    private async getRequest<T>(uri: string, headers: { Authorization: string; 'x-api-key': string }): Promise<T> {
        try {
            const axios = Axios.create({
                headers,
            });
            return (await axios.get(uri)).data;
        } catch (e) {
            throw new Error('Error in get request to: ' + uri + ' ' + e.message);
        }
    }

    private async postRequest<T>(
        uri: string,
        body: { accessKey: string },
        headers: {
            'x-api-key': string;
        },
    ): Promise<T> {
        try {
            const axios = Axios.create({ headers });
            return (await axios.post(uri, body)).data;
        } catch (e) {
            throw new Error('Error in post request to: ' + uri + ' ' + e.message);
        }
    }
}
