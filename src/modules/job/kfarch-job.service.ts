import { KfApiErrorHandler, KfDbException, KfException, KfHttpsService } from '@kf-products-core/kfhub_svc_lib';
import { Injectable, Logger } from '@nestjs/common';
import { getManager } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Common } from '../../common/common.interface';
import { getUrlForCachedJsonRemoval, getKfhubApiHeaders, s3 } from '../../common/common.utils';
import { KfThmSignUrlUtils } from '../signUrl/kfthm-signUrl.util';
import { KfArchClientJobDBService } from './kfarch-clientjob-db.service';
import { KfArchJobTitlesStagingRepository } from './kfarch-job-titles-staging.repository';
import {
    GetUpdateStatus,
    InsertDataPost,
    KfParseJsonDataContract,
    ValidateJobCodesRequest,
    ValidateJobCodesResponse,
    ValidateJobTitlesPost,
    ValidateJobTitlesResponse,
} from './kfarch-job.interface';
import { KfArchInsertDataRepository, KfArchStatusRepository } from './kfarch-job.repository';
import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { Request } from 'express';
import { ClientJobsInfo, ClientInfo } from './kfarch-job.interface';

const Stages = Common.Enum.BucketDetails;
const { BUCKET, JOBS_DOWNLOAD_URL, JOBS_DOWNLOAD_API_BASE } = Common.Enum;
const { EXPIRES, FILE_UPLOAD, UPLOAD_XLSX, KFM } = Stages;

@Injectable()
export class KfArchJobService extends KfThmSignUrlUtils {
    private logger: Logger = new Logger('KfArchJobService');

    constructor(
        private repo: KfArchInsertDataRepository,
        private status: KfArchStatusRepository,
        private jobTitlesStaging: KfArchJobTitlesStagingRepository,
        private clientJobDB: KfArchClientJobDBService,
        private readonly httpsService: KfHttpsService,
    ) {
        super();
    }
    async getSignedUrlForDownload(query: Common.Query.DownloadFile, request) {
        try {
            let stage = Stages.FILE_ERROR;

            switch (query.status) {
                case '0':
                    stage = Stages.FILE_UPLOAD;
                    break;
                case '1':
                    stage = Stages.FILE_PARSE;
                    break;
                case '2':
                    throw new KfException('Fatal error, no output file', 400, ec.GET_DOWNLOAD_URL_FAILED);
                case '3':
                    stage = Stages.FILE_VALIDATION;
                    break;
                case '4':
                    stage = Stages.FILE_ERROR;
                    break;
                case '5':
                    const authToken = request.headers.authtoken;
                    const jobsList: any = await this.downloadListOfJobs(authToken, query);
                    return { url: jobsList };
            }

            const key = await this.getFullFileName(query, stage, BUCKET, KFM);

            const url = await this.signedUrlForDownload(BUCKET, key, EXPIRES);
            return { url };
        } catch (error) {
            this.logger.error(error.message);
            throw new KfDbException(error.message);
        }
    }

    async downloadListOfJobs(authToken: string, query) {
        const clientId = query.clientId;
        const headers = {
            'Content-Type': 'application/json',
        };
        const result = await this.httpsService.post(JOBS_DOWNLOAD_URL + JOBS_DOWNLOAD_API_BASE, headers, { authToken, clientId });
        return result;
    }

    async getSignedUrlForUpload(query: Common.Query.DefaultProps) {
        try {
            const contentType = this.getMimeType('.xlsx');

            await this.createBucketIfNotExist(BUCKET);

            const { uuid, url } = this.constructFilePath(FILE_UPLOAD, UPLOAD_XLSX, KFM, query);
            const endPoint = await this.signedUrlForUpload(BUCKET, url, EXPIRES, contentType);

            await this.status.createStatus(uuid, query, 0);

            return {
                url: endPoint,
                uuid,
            };
        } catch (error) {
            this.logger.error(error.message);
            throw new KfDbException(error.message);
        }
    }

    async getPushData(body: Common.Query.PushData, request: Request) {
        try {
            const found = await this.status.getMetadata(body.fileUUID);
            const id = found.KFArchitectProfilesUpdateID;
            const jobIds = await this.repo.getJobIds(id);
            const inputQuery = `
            Architect.dbo.UpdateKFArchitectProfiles ${+body.uploadClientId}, '${body.fileUUID}';
        `;
            const results = await getManager().query(inputQuery);
            await this.deleteCachedJsonRecords(body, request);
            return results;
        } catch ({ message }) {
            this.logger.error(message);
            throw new KfDbException(message);
        }
    }

    async deleteCachedJsonRecords(body: Common.Query.PushData, request: Request): Promise<void> {
        try {
            const found = await this.status.getMetadata(body.fileUUID);
            const id = found.KFArchitectProfilesUpdateID;
            const jobIds = await this.repo.getJobIds(id);
            const chunks = this.chunkArray(jobIds, 250);
            for (const ids of chunks) {
                await this.deleteCachedJsonByIds(request, ids, +body.uploadClientId);
            }
        } catch (err) {
            this.logger.error(`Error in calling getting Fifty records: ${err}`);
            throw new KfException(err, 500, ec.EXTERNAL_I_O_CALL_FAILED);
        }
    }

    @KfApiErrorHandler(ec.EXTERNAL_I_O_CALL_FAILED)
    private async deleteCachedJsonByIds(request: Request, ids: number[], clientId: number): Promise<void> {
        try {
            const url = getUrlForCachedJsonRemoval(clientId, ids);
            const headers = this.getHeaders(request);
            await this.httpsService.delete(url, headers);
        } catch (err) {
            this.logger.error(`Error in deleting cached json: ${err}`);
        }
    }

    protected chunkArray(array: number[], chunkSize: number): number[][] {
        return Array.from({ length: Math.ceil(array.length / chunkSize) },
        (_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize));
    }

    protected getHeaders(request: Request) {
        const headers = getKfhubApiHeaders(request.headers.authtoken, request.headers['ps-session-id']);
        return headers;
    }

    async getStatus(query: GetUpdateStatus) {
        try {
            return await this.status.getMetadata(query.fileUUID);
        } catch (error) {
            this.logger.error(error.message);
            throw new KfDbException(error.message);
        }
    }

    async createStatus(body: Common.Query.UpsertUploadStatus) {
        await this.status.updateStatus(body.fileUUID, body.processStatus);
    }

    async insertData(body: InsertDataPost, query: Common.Query.DefaultProps) {
        try {
            const file = await this.getFile(body.fileKey);
            const found = await this.status.getMetadata(body.fileUUID);

            // Split file into batches of 10 entries
            const batchSize = 10;
            const batches = this.divideInChunks(file, batchSize);

            batches.forEach(async (batch, i) => {
                const offset = batchSize * i;
                await this.repo.insertBulkData(batch, body, found.CreateBy, found.KFArchitectProfilesUpdateID, offset);
            });

            return {};
        } catch ({ message }) {
            this.logger.error(message);
            throw new KfDbException(message);
        }
    }

    async validateJobTitles(body: ValidateJobTitlesPost): Promise<ValidateJobTitlesResponse> {
        if (body.jobs.length === 0) {
            return {
                isValid: true,
            };
        }

        // Insert batches of titles to validate into comparision staging table
        const validationTaskUuid = uuidv4();
        const batchSize = 1000;
        try {
            while (body.jobs.length > 0) {
                // Insert into staging table
                await this.jobTitlesStaging.insertBulkData(validationTaskUuid, body.jobs.splice(0, batchSize));
            }
        } catch (err) {
            this.logger.error(`Error when inserting data into job title validation table: ${err.message}`);

            try {
                // Try to clean up - remove already inserted entries
                await this.jobTitlesStaging.deleteBulk(validationTaskUuid);
            } catch (err) {
                // Clean up also failed
                this.logger.error(`Unable to clean up after failed batch insert attempt: ${err.message}`);
                throw err;
            }

            throw err;
        }

        const existingJobTitles = await this.clientJobDB.checkExistingJobTitlesForClient(body.clientId, validationTaskUuid);

        // Clean up
        try {
            await this.jobTitlesStaging.deleteBulk(validationTaskUuid);
        } catch (err) {
            this.logger.error(`Error when cleaning up staging table: ${err.message}`);
            throw err;
        }

        if (existingJobTitles.length === 0) {
            return {
                isValid: true,
            };
        }

        const response: ValidateJobTitlesResponse = {
            isValid: false,
            duplicateJobTitles: [],
        };
        existingJobTitles.forEach((entry) => {
            response.duplicateJobTitles.push(entry.title);
        });
        return response;
    }

    async validateJobCodes(body: ValidateJobCodesRequest): Promise<ValidateJobCodesResponse> {
        if (body.jobCodes.length === 0) {
            return {
                isValid: true,
            };
        }
        try {
            const existingJobCodes = await this.clientJobDB.selectExistingClientJobCodes(body.clientId, body.jobCodes);

            if (existingJobCodes.length === 0) {
                return {
                    isValid: true,
                };
            }
            const response: ValidateJobCodesResponse = {
                isValid: false,
                duplicatedJobCodes: [...existingJobCodes],
            };

            return response;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }

    async getClientJobsMainInfo(clientId: number, locale: string): Promise<ClientInfo> {
        const [workConds, jobsInfo] = await Promise.all([
            this.clientJobDB.selectIsClientWorkingConditionsEnabled(clientId),
            this.clientJobDB.selectClientJobsMainInfo(clientId, locale),
        ]);
        return {
            clientJobsInfo: jobsInfo,
            isWorkingConditionsEnabled: workConds,
        };
    }

    private divideInChunks(data: KfParseJsonDataContract[], batchSize: number): KfParseJsonDataContract[][] {
        const batches: KfParseJsonDataContract[][] = [];

        let batchIdx = 0;
        let batchCounter = 0;
        data.forEach((entry: KfParseJsonDataContract) => {
            if (!batches[batchIdx]) {
                batches[batchIdx] = [];
            }

            batches[batchIdx].push(entry);

            batchCounter++;

            if (batchCounter >= batchSize) {
                batchIdx++;
                batchCounter = 0;
            }
        });

        return batches;
    }

    async getFile(key): Promise<KfParseJsonDataContract[]> {
        const { Body } = await s3
            .getObject({
                Bucket: Common.Enum.BUCKET,
                Key: key,
            })
            .promise();
        return JSON.parse(Body.toString());
    }
}
