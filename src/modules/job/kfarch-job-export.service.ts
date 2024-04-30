import { Injectable, Logger } from '@nestjs/common';
import { KfThmSignUrlUtils } from '../signUrl/kfthm-signUrl.util';
import { KfaJobTaskExportStatusRepository } from './kfarch-job-export.repository';
import { Common } from '../../common/common.interface';
import { JobTaskExportStatus } from './kfarch-job.enum';
import { Buffer } from 'buffer';
import { KfConfigService, KfException } from '@kf-products-core/kfhub_svc_lib';
import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { v4 as uuidv4 } from 'uuid';
const Stages = Common.Enum.BucketDetails;
const { BUCKET } = Common.Enum;
const { EXPIRES, KFM } = Stages;

@Injectable()
export class KfArchJobExportService {
    private logger: Logger = new Logger('KfArchJobExportService');
    private cfg: KfConfigService;
    constructor(private repo: KfaJobTaskExportStatusRepository, private signUrlUtils: KfThmSignUrlUtils) {
        this.cfg = new KfConfigService();
    }

    private getStartTxtFileS3Key(clientId: number, taskUuid: string, date: number): string {
        const s3PathKey = `KFManagement/${clientId}/${taskUuid}/file_export/${date}_startKfaJobsExport.txt`;
        return s3PathKey;
    }

    private async getSignedUrlForDownloadJobTaskExport(clientId: number, taskUuid: string, date: number): Promise<string> {
        const queryDownloadFile: Common.Query.DownloadFile = new Common.Query.DownloadFile();
        queryDownloadFile.fileUUID = taskUuid;
        queryDownloadFile.clientId = clientId;
        this.logger.log(`fileUUID of query is ${queryDownloadFile.fileUUID}`);
        const stage = Stages.FILE_EXPORT;
        const key = await this.signUrlUtils.getFullFileName(queryDownloadFile, stage, BUCKET, KFM);
        return await this.signUrlUtils.signedUrlForDownload(BUCKET, key, EXPIRES);
    }

    private async saveOnS3(s3PathKey: string) {
        await this.signUrlUtils.uploadToS3({
            Bucket: this.cfg.get('AMAZON_BUCKET'),
            Key: s3PathKey,
            Body: Buffer.from('Start KFA job task export'),
        });
    }

    async createTxtFileAndStartExport(status: number, userId: number, clientId: number): Promise<{ taskUuid: string }> {
        const createdOn = Date.now();
        const taskUuid: string = uuidv4();

        try {
            const s3PathKey = this.getStartTxtFileS3Key(clientId, taskUuid, createdOn);
            await this.saveOnS3(s3PathKey);

            await this.repo.createStatus(taskUuid, status, new Date(createdOn), userId);
            return { taskUuid };
        } catch (err) {
            const msg = `Error while creating txt file and saving start job task export status: ${err.message}`;
            this.logger.error(msg);
            throw new KfException(msg, 500, ec.START_JOB_TASK_EXPORT_FAILED);
        }
    }

    async updateStatus(taskUuid: string, taskStatus: number): Promise<void> {
        try {
            return await this.repo.updateStatus(taskUuid, taskStatus);
        } catch (err) {
            const msg = `Error while updating job task export status: ${err.message}`;
            this.logger.error(msg);
            throw new KfException(msg, 500, ec.UPDATE_JOB_TASK_EXPORT_STATUS_FAILED);
        }
    }

    // fileUUID does not comply with taskUuid in terms of its meaning
    // And I suggest renaming fileUUID to simply Uuid because in download query
    // we have both assumed options fileUUID and taskUuid
    async getStatus(taskUuid: string, clientId?: number): Promise<{ taskStatus: number } | { taskStatus: number; url: string }> {
        try {
            const { TaskStatus } = await this.repo.getStatus(taskUuid);
            if (TaskStatus === JobTaskExportStatus.SUCCESS) {
                try {
                    const date = Date.now();
                    const url = await this.getSignedUrlForDownloadJobTaskExport(clientId, taskUuid, date);
                    return { taskStatus: TaskStatus, url };
                } catch (err) {
                    const msg = `Error while recieving signed url for job task export: ${err.message}`;
                    this.logger.error(msg);
                    throw new KfException(msg, 500, ec.GET_JOB_TASK_EXPORT_STATUS_FAILED);
                }
            } else {
                return { taskStatus: TaskStatus };
            }
        } catch (err) {
            const msg = `Error while recieving job task export status: ${err.message}`;
            this.logger.error(msg);
            throw new KfException(msg, 500, ec.GET_JOB_TASK_EXPORT_STATUS_FAILED);
        }
    }
}
