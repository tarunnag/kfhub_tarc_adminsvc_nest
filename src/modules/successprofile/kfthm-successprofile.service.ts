import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import Axios from 'axios';
import { KfDbException, KfApiErrorHandler, KfConfigService } from '@kf-products-core/kfhub_svc_lib';

import { initcap, getDecodedStandardFiltersFromQuery, getStandardPagination } from '../../common/common.utils';
import { Common as c } from '../../common/common.interface';
import { KfExceptionCodes as ec } from '../../kfthm-exception-codes.enum';

import { ClientJobsInfo } from '../job/kfarch-job.interface';
import { SuccessProfilesQuery, DecodedSpQueryParams, SuccessProfiles, Metadata, SuccessProfilesIds } from './kfthm-successprofile.interface';
import { ReportType, RequestType, ProfileTypes, SortColumn, Filters, MetadataStrangeHardcodedValuesInResponse } from './kfthm-successprofile.enum';
import { SpMssqlService } from './kfthm-successprofile-mssql.service';

@Injectable()
export class KfThmSuccessprofileService {
    private logger: Logger = new Logger('KfThmSuccessprofileService');

    constructor(private spMssqlService: SpMssqlService, private configService: KfConfigService) {}

    @KfApiErrorHandler(ec.INTERNAL_SERVER_ERROR)
    async getSuccessProfilesData(query: SuccessProfilesQuery): Promise<SuccessProfiles | Metadata | SuccessProfilesIds | void> {
        try {
            const dq = this.decodeSuccessProfileQuery(query);
            switch (dq.requestType) {
                case RequestType.SUCCESS_PROFILE:
                    return await this.getSuccessProfiles(dq);

                case RequestType.SUCCESS_PROFILES_IDS:
                    return await this.getSuccessProfilesIds(dq);

                case RequestType.METADATA:
                    return await this.getMetadata(dq.clientId);
            }
        } catch (err) {
            const msg = `Error while fetching successprofiles: ${err.message}`;
            this.logger.error(msg);
            throw new KfDbException(err.message);
        }
    }

    private async getSuccessProfiles(dq: DecodedSpQueryParams): Promise<SuccessProfiles> {
        const spsDataRawPromise = this.spMssqlService.getThPortalProfiles(
            dq.clientId,
            dq.langauge,
            dq.pageIndex,
            dq.pageSize,
            dq.searchString,
            dq.sortBy,
            dq.sortColumn,
            dq.grade,
            dq.level,
            dq.function,
            dq.profileType,
        );

        const preferedLanguagePromise = this.spMssqlService.getClientPreferedLanguage(dq.clientId);

        const [spsDataRaw, preferedLanguage] = await Promise.all([spsDataRawPromise, preferedLanguagePromise]);

        const pagination = getStandardPagination(dq.pageIndex, dq.pageSize, +spsDataRaw[0]?.TotalRecords);

        return {
            result: spsDataRaw,
            paging: pagination,
            preferredLanguages: preferedLanguage,
        };
    }

    private async getSuccessProfilesIds(dq: DecodedSpQueryParams): Promise<SuccessProfilesIds> {
        const data = await this.spMssqlService.getThPortalProfiles(
            dq.clientId,
            dq.langauge,
            dq.pageIndex,
            dq.pageSize,
            dq.searchString,
            dq.sortBy,
            dq.sortColumn,
            dq.grade,
            dq.level,
            dq.function,
            dq.profileType,
        );

        const ids = {};
        data.forEach((row) => {
            const type = row.ProfileType;
            (ids[type] = ids[type] || []).push(row.JobID);
        });

        return {
            ids,
        };
    }

    private decodeSuccessProfileQuery(q: SuccessProfilesQuery): DecodedSpQueryParams {
        const filters = getDecodedStandardFiltersFromQuery(q);

        const clientId = q.requestClient ? +q.requestClient : +q.loggedInUserClientId;
        const sortColumn = SortColumn[q.sortColumn] || SortColumn.MODIFIED_ON;

        return {
            requestType: q.type,
            clientId,
            userId: +q.userId,
            locale: q.locale,
            grade: filters[Filters.GRADES] || '',
            level: filters[Filters.LEVELS] || '',
            langauge: filters[Filters.LANGUAGES] || q.locale,
            function: filters[Filters.FUNCTIONS] || '',
            profileType: filters[Filters.PROFILE_TYPES] || ProfileTypes.DEFAULT,
            pageIndex: +q.pageIndex || 1,
            pageSize: +q.pageSize || 20,
            searchString: q.searchString || '',
            sortBy: q.sortBy || '',
            sortColumn,
        };
    }

    private async getMetadata(clientId: number): Promise<Metadata> {
        const metadataRaw = await this.spMssqlService.getThPortalMetadata(clientId);

        const response: Metadata = {
            metadata: [
                {
                    name: MetadataStrangeHardcodedValuesInResponse.NAME,
                    value: MetadataStrangeHardcodedValuesInResponse.VALUE,
                    searchOn: [],
                },
            ],
        };
        const searchOn = response.metadata[0].searchOn;

        for (const row of metadataRaw) {
            if (!row.MethodName) continue;

            // @TODO This need fixes in stored proc
            if (row.MethodvalueName === 'LANGUAGE') row.MethodvalueName = 'LANGUAGES';
            if (row.MethodvalueName === 'PROFILE_TYPE') row.MethodvalueName = 'PROFILE_TYPES';

            const newOption =
                // manual remap due to values/names inconsistency on UI/DB
                row.MethodvalueName === Filters.FUNCTIONS || row.MethodvalueName === Filters.LANGUAGES || row.MethodvalueName === Filters.PROFILE_TYPES
                    ? { id: row.MethodName, value: row.Methodvalue, name: row.MethodName }
                    : { id: row.Methodvalue, value: row.MethodName, name: row.Methodvalue };

            const ifExistIndex = searchOn.findIndex((e) => e.name === Filters[row.MethodvalueName]);

            if (ifExistIndex === -1) {
                searchOn.push({
                    name: Filters[row.MethodvalueName],
                    value: initcap(Filters[row.MethodvalueName]).replace('_', ' '),
                    options: [newOption],
                });
            } else {
                searchOn[ifExistIndex].options.push(newOption);
            }
        }

        return response;
    }

    @KfApiErrorHandler(ec.INTERNAL_SERVER_ERROR)
    async getClientJobsPdfs(clientId: number, locale: string, reportType: ReportType, authToken: string, psSessionId: string) {
        // @TODO will be depricated after PDFs Bulk Download
        const headers = { authToken };
        const axios = Axios.create({ headers });

        const result = await axios.get(c.Enum.URL_KFHUB_API_BASE + c.Enum.API_VERSION + `/hrms/thportal/admin/jobs/clientJobsInfo?searchClientId=${clientId}`);
        const clientJobIds: ClientJobsInfo[] = result.data.data;

        const env = this.configService.get('APP_ENV');
        let lambdaUrl = '';
        switch (env) {
            case 'DEV':
                lambdaUrl = 'https://dev.profilemgr-report.kornferry.com';
                break;
            case 'DEV-INT':
                lambdaUrl = 'https://devint.profilemgr-report.kornferry.com';
                break;
            case 'TEST':
                lambdaUrl = 'https://0f5lv6cm91.execute-api.us-east-1.amazonaws.com';
                break;
            case 'STAGE':
                lambdaUrl = 'https://pvhad9fcm1.execute-api.us-east-1.amazonaws.com';
                break;
            case 'PROD-US':
                lambdaUrl = 'https://xwen6roqe2.execute-api.us-east-1.amazonaws.com';
                break;
            case 'PROD-EU':
                lambdaUrl = 'https://8v5rbx6fub.execute-api.eu-central-1.amazonaws.com';
                break;
            case 'PROD-CN':
                lambdaUrl = 'https://k2j0ekdksl.execute-api.ap-east-1.amazonaws.com';
                break;
        }

        const batchSize = 10; // On UI we use 5 batch
        for (let i = 0; i < clientJobIds.length; i += batchSize) {
            const downloadPdfPromices: Promise<any>[] = [];
            for (let j = i; j < i + batchSize; j++) {
                const clientJobId = clientJobIds[j].jobID,
                    clientJobName = clientJobIds[j].jobName.replace(/[\W_]+/g, '_');
                let query = '',
                    url = '';

                switch (reportType) {
                    case ReportType.IG:
                        query = `?jobId=${clientJobId}&reportType=${reportType}&reportLocale=${locale}&reportClientId=${clientId}`;
                        url = c.Enum.URL_KFHUB_API_BASE + c.Enum.API_VERSION + c.Enum.SELECT_ASSESSMENT_IG_PATH + query;
                        break;
                    case ReportType.SP:
                        query = `?spId=${clientJobId}&locale=${locale}&authToken=${authToken}&countryId=225&clientId=${clientId}&ps-session-id=${psSessionId}&excludeSections=4`;
                        url = lambdaUrl + '/current/download/sucessprofile' + query;
                        break;
                }

                const fileDirName = `./tmp/${reportType}_${clientId}_${clientJobName}_${clientJobId}.pdf`,
                    callback = (err) => {
                        if (err) throw new Error(err.toString());
                    };

                const getPdfPromise = new Promise((res) => res(axios.get(url, { responseType: 'arraybuffer' })))
                    .then((pdfBuffer: any) => fs.writeFile(fileDirName, pdfBuffer.data, { encoding: 'binary' }, callback))
                    .then((r) => `${fileDirName} is ready`)
                    .catch((e) => `O-o, ${fileDirName} error - ${e}`);

                downloadPdfPromices.push(getPdfPromise);
            }
            await Promise.all(downloadPdfPromices);
        }
    }
}
