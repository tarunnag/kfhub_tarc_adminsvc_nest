import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { performance } from 'perf_hooks';
import { getManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { KfConfigService, KfApiErrorHandler, KfException, KfHttpsService } from '@kf-products-core/kfhub_svc_lib';
import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { KfThmWorkdayEnums as WorkdayEnums } from './kfthm-workday.enums';
import { KfThmWorkdayInterface as WorkdayInterfaces } from './kfthm-workday.interface';
import { KfThmWorkdayPublishingStatusRepository as StatusRepo } from './kfthm-workday.repository';
import { KfThmWorkdayStagingDBService as StagingDB } from './kfthm-workday-staging-db.service';
import { s3, getMimeType } from './kfthm-workday.utils';
import { Common } from '../../common/common.interface';

const S3_PRESIGN_EXPIRE = 30_000;

@Injectable()
export class KfThmWorkdayService {
    private cfg: KfConfigService;
    private logger: Logger = new Logger('KfThmWorkdayService');

    constructor(private statusRepo: StatusRepo, private stagingDB: StagingDB, private http: KfHttpsService) {
        this.cfg = new KfConfigService();
    }

    async createDownloadTask(clientId: number): Promise<WorkdayInterfaces.DownloadResponse> {
        const t0 = performance.now();

        const uuid = this.generateUUID();

        try {
            await this.statusRepo.createStatus(uuid, WorkdayEnums.TaskType.DOWNLOAD, clientId, WorkdayEnums.DownloadStatus.PROCESS_STARTED);
        } catch (err) {
            const msg = `Error while inserting status into db: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.CREATE_STATUS_FAILED);
        }

        let statusEntry;
        try {
            statusEntry = await this.statusRepo.getMetadata(uuid);
        } catch (err) {
            const msg = `Error while selecting status from db: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.GET_STATUS_METADATA_BY_UUID_FAILED);
        }

        let workdayItems;
        try {
            workdayItems = await this.getWorkdayData(clientId);
        } catch (err) {
            const msg = `Error while getting workday data: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.INTERNAL_SERVER_ERROR);
        }

        const s3key = this.getExportJsonS3Key(clientId, uuid, statusEntry.CreatedOnUTC);

        try {
            await this.saveDataOnS3(s3key, workdayItems);
        } catch (err) {
            const msg = `Error while saving workday data on S3: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.AWS_IO_CALL_FAILED);
        }

        try {
            await this.statusRepo.updateStatus(uuid, WorkdayEnums.DownloadStatus.ASSEMBLING_DATA);
        } catch (err) {
            const msg = `Error while updating workday status in DB: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.UPDATE_STATUS_BY_UUID_FAILED);
        }

        const t1 = performance.now();
        this.logger.log(`Download task - total: ${t1 - t0} ms`);

        return {
            uuid,
            status: WorkdayEnums.DownloadStatus.ASSEMBLING_DATA,
        };
    }

    async createUploadTask(clientId: number): Promise<WorkdayInterfaces.UploadResponse> {
        const t0 = performance.now();

        const uuid = this.generateUUID();
        const status = WorkdayEnums.UploadStatus.AWAITNG_UPLOAD;
        const bucket = this.cfg.get('AMAZON_BUCKET');
        const contentType = getMimeType('.xlsx');

        try {
            await this.createBucketIfNotExist(bucket);
        } catch (err) {
            const msg = `Error while creating bucket if not exist: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.AWS_IO_CALL_FAILED);
        }

        try {
            await this.statusRepo.createStatus(uuid, WorkdayEnums.TaskType.UPLOAD, clientId, status);
        } catch (err) {
            const msg = `Error while inserting status into DB: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.CREATE_STATUS_FAILED);
        }

        let statusMeta;
        try {
            statusMeta = await this.statusRepo.getMetadata(uuid);
        } catch (err) {
            const msg = `Error while getting status meta from DB: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.GET_STATUS_METADATA_BY_UUID_FAILED);
        }

        const refDataS3Key = this.getUploadReferenceDataS3Key(clientId, uuid, statusMeta.CreatedOnUTC);

        let workdayItems;
        try {
            workdayItems = await this.getWorkdayData(clientId);
        } catch (err) {
            const msg = `Error while getting workday items: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.INTERNAL_SERVER_ERROR);
        }

        try {
            await this.saveDataOnS3(refDataS3Key, workdayItems);
        } catch (err) {
            const msg = `Error while saving reference data on S3: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.AWS_IO_CALL_FAILED);
        }

        const s3Key = this.getUploadExcelS3Key(clientId, uuid, statusMeta.CreatedOnUTC);

        let url;
        try {
            url = await this.signedUrlForUpload(bucket, s3Key, S3_PRESIGN_EXPIRE, contentType);
        } catch (err) {
            const msg = `Error while creating pre-signed url for uploading on S3: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.AWS_IO_CALL_FAILED);
        }

        const t1 = performance.now();
        this.logger.log(`Upload task creation: ${t1 - t0} ms`);

        return { uuid, url };
    }

    generateUUID(): string {
        const uuid = uuidv4();
        return uuid;
    }

    async updateStatus(uuid: string, status: number) {
        const t0 = performance.now();

        try {
            await this.statusRepo.updateStatus(uuid, status);
        } catch (err) {
            const msg = `Error while updating workday status in DB: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.UPDATE_STATUS_BY_UUID_FAILED);
        }

        const t1 = performance.now();
        this.logger.log(`Updating workday task status: ${t1 - t0} ms`);
    }

    async getStatus(uuid: string): Promise<WorkdayInterfaces.StatusResponse> {
        const t0 = performance.now();

        let meta;
        try {
            meta = await this.statusRepo.getMetadata(uuid);
        } catch (err) {
            const msg = `Error while fetching workday status from DB: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.GET_STATUS_METADATA_BY_UUID_FAILED);
        }

        const result: WorkdayInterfaces.StatusResponse = {
            status: meta.TaskStatus,
            uuid,
        };

        // If task type is download and status 5 - return presigned url as well
        if (meta.TaskType === WorkdayEnums.TaskType.DOWNLOAD && meta.TaskStatus === WorkdayEnums.DownloadStatus.SUCCESS) {
            const bucket = this.cfg.get('AMAZON_BUCKET');

            const s3Key = this.getDownloadExcelS3Key(meta.CreatedBy, uuid, meta.CreatedOnUTC);

            let url;
            try {
                url = await this.signedUrlForDownload(bucket, s3Key, S3_PRESIGN_EXPIRE);
            } catch (err) {
                const msg = `Error while creating pre-signed url for Workday download file: ${err.message}`;
                this.logger.log(msg);
                throw new KfException(msg, 500, ec.AWS_IO_CALL_FAILED);
            }

            result.url = url;
        }

        // If task type is upload and status 12 - return presigned url for error Excel file
        if (meta.TaskType === WorkdayEnums.TaskType.UPLOAD && meta.TaskStatus === WorkdayEnums.UploadStatus.VALIDATION_ERROR) {
            const bucket = this.cfg.get('AMAZON_BUCKET');

            const s3Key = this.getValidationErrorsS3Key(meta.CreatedBy, uuid, meta.CreatedOnUTC);

            let url;
            try {
                url = await this.signedUrlForDownload(bucket, s3Key, S3_PRESIGN_EXPIRE);
            } catch (err) {
                const msg = `Error while creating pre-signed url for Workday validation errors file: ${err.message}`;
                this.logger.log(msg);
                throw new KfException(msg, 500, ec.AWS_IO_CALL_FAILED);
            }

            result.url = url;
        }

        const t1 = performance.now();
        console.log(`Fetching workday task status: ${t1 - t0} ms`);

        return result;
    }

    isValidStatus(status: number): boolean {
        const downloadStatuses = Object.values(WorkdayEnums.DownloadStatus).filter((x) => !isNaN(x as number));
        const uploadStatuses = Object.values(WorkdayEnums.UploadStatus).filter((x) => !isNaN(x as number));
        return downloadStatuses.includes(status) || uploadStatuses.includes(status);
    }

    async getWorkdayData(clientId: number): Promise<WorkdayInterfaces.WorkdayJob[]> {
        const t0 = performance.now();

        const getWorkdayDataQuery = `exec [Workday].[dbo].[GetClientCustomProfilesForWorkday] @0, 'en'`;
        const queryParams = [clientId];

        const dbData = await getManager().query(getWorkdayDataQuery, queryParams);

        for (const row of dbData) {
            row.ClientID = clientId;
            // Remove empty attributes
            delete row[''];
        }
        const t1 = performance.now();
        console.log(`Download task - fetching data from DB: ${t1 - t0} ms`);

        return dbData;
    }

    async saveDataOnS3(s3Key: string, items: WorkdayInterfaces.WorkdayJob[]): Promise<any> {
        const t0 = performance.now();

        const bucket = this.cfg.get('AMAZON_BUCKET');

        const params: AWS.S3.PutObjectRequest = {
            Bucket: bucket,
            Key: s3Key,
            Body: JSON.stringify(items),
            ACL: 'private',
        };

        await s3.putObject(params).promise();

        const t1 = performance.now();
        console.log(`Download task - saving to S3: ${t1 - t0} ms`);
    }

    async readDataFromS3(s3Key: string): Promise<any> {
        const t0 = performance.now();

        const bucket = this.cfg.get('AMAZON_BUCKET');

        const params: AWS.S3.GetObjectRequest = {
            Bucket: bucket,
            Key: s3Key,
        };

        const data = await s3.getObject(params).promise();

        if (!data.Body) {
            throw new KfException(`Missing body when reading ${s3Key}`);
        }

        const t1 = performance.now();
        console.log(`Upload task - reading parsed JSON from S3: ${t1 - t0} ms`);

        return data.Body;
    }

    getExportJsonS3Key(clientId: number, uuid: string, date: Date): string {
        const ts = this.formatDateForS3Path(date);
        return `workday-integration/${clientId}/${uuid}/file-export/${ts}_export.json`;
    }

    getUploadExcelS3Key(clientId: number, uuid: string, date: Date): string {
        const ts = this.formatDateForS3Path(date);
        return `workday-integration/${clientId}/${uuid}/file-upload/${ts}_upload.xlsx`;
    }

    getUploadReferenceDataS3Key(clientId: number, uuid: string, date: Date): string {
        const ts = this.formatDateForS3Path(date);
        return `workday-integration/${clientId}/${uuid}/file-upload/${ts}_reference.json`;
    }

    getDownloadExcelS3Key(clientId: number, uuid: string, date: Date): string {
        const ts = this.formatDateForS3Path(date);
        return `workday-integration/${clientId}/${uuid}/file-download/Workday_Export_${clientId}.xlsx`;
    }

    getValidationErrorsS3Key(clientId: number, uuid: string, date: Date): string {
        const ts = this.formatDateForS3Path(date);
        return `workday-integration/${clientId}/${uuid}/file-upload/Workday_Import_Errors_${clientId}.xlsx`;
    }

    getParsedUploadS3Key(clientId: number, uuid: string, date: Date): string {
        const ts = this.formatDateForS3Path(date);
        return `workday-integration/${clientId}/${uuid}/file-parsed/${ts}_parsed.json`;
    }

    private formatDateForS3Path(date: Date): string {
        const ts = Math.round(date.valueOf() / 1000);
        return `${ts}`;
    }

    @KfApiErrorHandler(ec.AWS_IO_CALL_FAILED)
    async isBucketExist(bucket: string): Promise<boolean> {
        try {
            await s3.headBucket({ Bucket: bucket }).promise();
            return true;
        } catch {
            return false;
        }
    }

    @KfApiErrorHandler(ec.AWS_IO_CALL_FAILED)
    async createBucketIfNotExist(bucket: string): Promise<any> {
        const condition = await this.isBucketExist(bucket);

        if (!condition) {
            return await s3.createBucket({ Bucket: bucket }).promise();
        }
    }

    @KfApiErrorHandler(ec.AWS_IO_CALL_FAILED)
    async signedUrlForUpload(Bucket, Key, Expires, ContentType): Promise<string> {
        return await s3.getSignedUrlPromise('putObject', {
            Bucket,
            Key,
            Expires,
            ContentType,
            ACL: 'private',
        });
    }

    @KfApiErrorHandler(ec.AWS_IO_CALL_FAILED)
    async signedUrlForDownload(Bucket, Key, Expires): Promise<string> {
        return await s3.getSignedUrlPromise('getObject', {
            Bucket,
            Key,
            Expires,
        });
    }

    async publish(payload: WorkdayInterfaces.PushDataBody, authToken: string): Promise<WorkdayInterfaces.PublishResponse> {
        // Check that authToken is present
        if (!authToken) {
            const msg = `Unexpected authToken value: ${authToken}`;
            this.logger.log(msg);
            throw new KfException(msg, 400, ec.INPUT_VALIDATION_FAILED);
        }

        // Check that timestamp is in future
        const now = Math.round(Date.now() / 1000);
        if (payload.ts <= now) {
            const msg = 'Timestamp ts should be in the future';
            this.logger.log(msg);
            throw new KfException(msg, 400, ec.INPUT_VALIDATION_FAILED);
        }

        // Obtain current userId from auth token
        let tokenMeta;
        try {
            tokenMeta = await this.getTokenMeta(authToken);
        } catch (err) {
            const msg = `Error when trying to get token meta: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.INTERNAL_SERVER_ERROR);
        }
        const userId: number = parseInt(tokenMeta.userid, 10);

        // Check if status is correct for this fileUUID
        const statusMeta = await this.statusRepo.getMetadata(payload.fileUUID);
        if (statusMeta.TaskType !== WorkdayEnums.TaskType.UPLOAD) {
            const msg = `Incorrect task type - not upload: ${JSON.stringify(statusMeta)}`;
            this.logger.log(msg);
            throw new KfException(msg, 400, ec.WORKDAY_INVALID_STATUS_ERR);
        }
        if (statusMeta.TaskStatus !== WorkdayEnums.UploadStatus.JSON_READY) {
            const msg = `Incorrect task status - not JSON_READY: ${JSON.stringify(statusMeta)}`;
            this.logger.log(msg);
            throw new KfException(msg, 400, ec.WORKDAY_INVALID_STATUS_ERR);
        }

        // Get JSON from S3
        const s3Key = this.getParsedUploadS3Key(payload.clientId, payload.fileUUID, statusMeta.CreatedOnUTC);
        let rawData;
        try {
            rawData = await this.readDataFromS3(s3Key);
        } catch (err) {
            const msg = `Error while reading from S3: ${err.message}`;
            this.logger.log(msg);
            await this.updateStatus(payload.fileUUID, WorkdayEnums.UploadStatus.UNKNOWN_ERROR);
            throw new KfException(msg, 500, ec.AWS_IO_CALL_FAILED);
        }
        let entries: WorkdayInterfaces.UploadEntry[];
        try {
            entries = JSON.parse(rawData);
        } catch (err) {
            const msg = `Error while parsing data from S3: ${err.message}`;
            this.logger.log(msg);
            await this.updateStatus(payload.fileUUID, WorkdayEnums.UploadStatus.UNKNOWN_ERROR);
            throw new KfException(msg, 500, ec.INTERNAL_SERVER_ERROR);
        }

        const entriesToPublish = entries.filter((entry) => {
            return entry.ScheduleIntegration === 'Yes';
        });

        // Push it into staging table with given timestamp
        let workdayPublishId;
        try {
            workdayPublishId = await this.stagingDB.insertPostToWorkdayStatus(userId, payload.fileUUID);
        } catch (err) {
            const msg = `Error while inserting data into Workday staging status table: ${err.message}`;
            this.logger.log(msg);
            await this.updateStatus(payload.fileUUID, WorkdayEnums.UploadStatus.DB_STAGING_TABLE_ERROR);
            throw new KfException(msg, 500, ec.INTERNAL_SERVER_ERROR);
        }
        let recordIdx = 0;
        try {
            for (const entry of entriesToPublish) {
                const d = new Date(payload.ts * 1000);
                await this.stagingDB.insertPostToWorkday(userId, workdayPublishId, recordIdx, d, entry);
                recordIdx++;
            }
        } catch (err) {
            const msg = `Error while inserting data into Workday staging table: ${err.message}`;
            this.logger.log(msg);
            await this.updateStatus(payload.fileUUID, WorkdayEnums.UploadStatus.DB_STAGING_TABLE_ERROR);
            throw new KfException(msg, 500, ec.INTERNAL_SERVER_ERROR);
        }

        try {
            await this.stagingDB.callLoadToWorkdayStagingProc(payload.fileUUID);
        } catch (err) {
            const msg = `Error while calling load to workday proc: ${err.message}`;
            this.logger.log(msg);
            await this.updateStatus(payload.fileUUID, WorkdayEnums.UploadStatus.DB_STAGING_TABLE_ERROR);
            throw new KfException(msg, 500, ec.INTERNAL_SERVER_ERROR);
        }

        // Set success status for this upload task
        try {
            await this.updateStatus(payload.fileUUID, WorkdayEnums.UploadStatus.SUCCESS);
        } catch (err) {
            const msg = `Error while setting final success status: ${err.message}`;
            this.logger.log(msg);
            throw new KfException(msg, 500, ec.INTERNAL_SERVER_ERROR);
        }

        const result: WorkdayInterfaces.PublishResponse = {
            status: WorkdayEnums.UploadStatus.SUCCESS,
            uuid: payload.fileUUID,
        };
        return result;
    }

    private async getTokenMeta(authToken: string): Promise<any> {
        const headers = {
            'Content-Type': 'application/json',
            authToken,
        };

        const { URL_KFHUB_API_BASE, TOKEN_METADATA_PATH } = Common.Enum;

        const result: any = await this.http.get(URL_KFHUB_API_BASE + TOKEN_METADATA_PATH, headers);

        if (!result.userid) {
            throw new Error(`Unexpected response when getting token meta: ${JSON.stringify(result)}`);
        }

        return result;
    }
}
