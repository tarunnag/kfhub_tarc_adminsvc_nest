import { Query, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { KfAny, KfApiController, KfApiMethod, KfException, KfHttpMethodEnum, KfSchemaValidationException } from '@kf-products-core/kfhub_svc_lib';
import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { Common } from '../../common/common.interface';
import { errorGenerator } from '../../common/common.utils';
import {
    GetUpdateStatus,
    InsertDataPost,
    KfaJobTaskExportStatus,
    UpdateKfaJobTaskExportStatus,
    UpdateStatus,
    ValidateJobCodesRequest,
    ValidateJobCodesResponse,
    ValidateJobTitlesPost,
    ValidateJobTitlesResponse,
} from './kfarch-job.interface';
import { KfArchJobService } from './kfarch-job.service';
import { KfArchJobExportService } from './kfarch-job-export.service';
import { ClientInfo, ClientJobsInfoProps } from './kfarch-job.interface';

@KfApiController('jobs')
export class KfArchJobController {
    constructor(private readonly jobService: KfArchJobService, private readonly jobTaskExportService: KfArchJobExportService) {}

    @KfApiMethod({
        apiTitle: 'Get url for file upload ',
        returnStatus: 200,
        returnDescription: 'Returns signed url to upload files',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        httpPathUri: 'uploadUrl',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.GET_UPLOAD_URL_FAILED,
    })
    async uploadSignUrl(@Query() query: Common.Query.DefaultProps) {
        return await this.jobService.getSignedUrlForUpload(query);
    }

    @KfApiMethod({
        apiTitle: 'Get url for file download',
        returnStatus: 200,
        returnDescription: 'Returns signed url to download files',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        httpPathUri: 'downloadUrl',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.GET_DOWNLOAD_URL_FAILED,
    })
    async downloadSignUrl(@Query() query: Common.Query.DownloadFile, @Req() request: Request) {
        if (query.status !== '5' && !query.fileUUID) {
            throw new KfSchemaValidationException([errorGenerator('fileUUId')]);
        }
        return await this.jobService.getSignedUrlForDownload(query, request);
    }

    // instead of invoking getsignedUrlForDownload return a message with 'Deprecated'

    @KfApiMethod({
        apiTitle: 'Get status',
        returnStatus: 200,
        returnDescription: 'Get status for job upload',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        httpPathUri: 'updateStatus',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.GET_UPLOAD_STATUS_FAILED,
    })
    async getJobUploadStatus(@Query() query: GetUpdateStatus) {
        return await this.jobService.getStatus(query);
    }

    @KfApiMethod({
        apiTitle: 'Update status',
        returnStatus: 200,
        returnDescription: 'Update status for job upload',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.PUT,
        httpPathUri: 'updateStatus',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.UPDATE_UPLOAD_STATUS_FAILED,
    })
    async updateJobUploadStatus(@Body() body: UpdateStatus) {
        return await this.jobService.createStatus(body);
    }

    @KfApiMethod({
        apiTitle: 'Upload data',
        returnStatus: 200,
        returnDescription: 'Insert data to staging table',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.POST,
        httpPathUri: 'updateData',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.INSERT_DATA_FAILED,
    })
    async insertDataInBulk(@Body() body: InsertDataPost, @Query() query: Common.Query.DefaultProps) {
        return await this.jobService.insertData(body, query);
    }

    @KfApiMethod({
        apiTitle: 'Push data',
        returnStatus: 200,
        returnDescription: 'Upload data from staging table to client tables',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.POST,
        httpPathUri: 'pushData',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.PUSH_DATA_FAILED,
    })
    async pushData(@Body() body: Common.Query.PushData, @Req() request: Request) {
        return await this.jobService.getPushData(body, request);
    }

    @KfApiMethod({
        apiTitle: 'Validate new job titles in bulk',
        returnStatus: 200,
        returnDescription: 'Checks if job titles already exist for given client. Returns false if any job title already exist',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.POST,
        httpPathUri: 'validateJobs',
    })
    async validateJobs(@Body() body: ValidateJobTitlesPost): Promise<ValidateJobTitlesResponse> {
        return await this.jobService.validateJobTitles(body);
    }

    @KfApiMethod({
        apiTitle: 'Validate new job codes in bulk',
        returnStatus: 200,
        returnDescription: 'Checks if job codes already exist for the given client. Returns array of job codes already presented in DB',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.POST,
        httpPathUri: 'validateJobCodes',
    })
    async validateJobCodes(@Body() body: ValidateJobCodesRequest): Promise<ValidateJobCodesResponse> {
        return await this.jobService.validateJobCodes(body);
    }

    @KfApiMethod({
        apiTitle: 'Create initial status of job task export',
        returnStatus: 200,
        returnDescription: 'Starts job task export and inserts initial status of the process',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.POST,
        httpPathUri: 'kfaJobsExport',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.START_JOB_TASK_EXPORT_FAILED,
    })
    async startKfaJobsExport(@Body() body: KfaJobTaskExportStatus, @Query() query: Common.Query.DefaultProps): Promise<{ taskUuid: string }> {
        if (!query.userId) {
            throw new KfException(ec.START_JOB_TASK_EXPORT_FAILED);
        }
        return await this.jobTaskExportService.createTxtFileAndStartExport(body.status, query.userId, query.clientId);
    }

    @KfApiMethod({
        apiTitle: 'Update status of job task export',
        returnStatus: 200,
        returnDescription: 'Update status of job task export on each stage of assembling an excel file',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.PUT,
        httpPathUri: 'kfaJobsExport',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.UPDATE_JOB_TASK_EXPORT_STATUS_FAILED,
    })
    async updateKfaJobTaskExportStatus(@Body() body: UpdateKfaJobTaskExportStatus): Promise<void> {
        return await this.jobTaskExportService.updateStatus(body.taskUuid, body.status);
    }

    @KfApiMethod({
        apiTitle: 'Get current status of job task export',
        returnStatus: 200,
        returnDescription: 'Receives current status of job task export and returns it',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        httpPathUri: 'kfaJobsExport',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.GET_JOB_TASK_EXPORT_FAILED,
    })
    async getKfaJobsExport(@Query() query: Common.Query.DownloadFile) {
        return await this.jobTaskExportService.getStatus(query.fileUUID, query.clientId);
    }

    @KfApiMethod({
        apiTitle: 'Get client Jobs main information',
        returnStatus: 200,
        returnDescription: 'array of job objects',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        httpPathUri: 'clientJobsInfo',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.GET_CLIENT_JOBS_MAIN_INFO_FAILED,
    })
    async getClientJobsMainInfo(@Query() query: ClientJobsInfoProps): Promise<ClientInfo> {
        const locale = query.lcid? query.lcid: query.locale;
        return await this.jobService.getClientJobsMainInfo(query.searchClientId, locale);
    }
}
