import { KfApiController, KfAny, KfApiMethod, KfHttpMethodEnum, KfException } from '@kf-products-core/kfhub_svc_lib';
import { Req, Body, Query } from '@nestjs/common';
import { Request } from 'express';
import { KfThmWorkdayService } from './kfthm-workday.service';
import { KfThmWorkdayInterface as WorkdayInterfaces } from './kfthm-workday.interface';
import { KfExceptionCodes } from '../../kfthm-exception-codes.enum';

@KfApiController('workday')
export class KfThmWorkdayController {
    constructor(private readonly workdayService: KfThmWorkdayService) {}

    @KfApiMethod({
        apiTitle: 'Download Workday Excel',
        returnStatus: 200,
        returnDescription: 'Returns download task UUID and status',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        httpPathUri: 'downloadUrl',
    })
    async download(@Query() query: WorkdayInterfaces.DownloadQuery): Promise<WorkdayInterfaces.DownloadResponse> {
        return this.workdayService.createDownloadTask(parseInt(query.clientId as any, 10));
    }

    @KfApiMethod({
        apiTitle: 'Upload Workday Excel',
        returnStatus: 200,
        returnDescription: 'Returns upload task UUID and S3 presigned url',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        httpPathUri: 'uploadUrl',
    })
    async upload(@Query() query: WorkdayInterfaces.UploadQuery, @Req() request: Request): Promise<WorkdayInterfaces.UploadResponse> {
        return this.workdayService.createUploadTask(query.clientId);
    }

    @KfApiMethod({
        apiTitle: 'Set effective publish date and trigger the publishing process',
        returnStatus: 200,
        returnDescription: 'Returns task UUID and status',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.POST,
        httpPathUri: 'pushData',
    })
    async publish(@Body() body: WorkdayInterfaces.PushDataBody, @Req() request: Request): Promise<WorkdayInterfaces.PublishResponse> {
        return this.workdayService.publish(body, request.headers.authtoken);
    }

    @KfApiMethod({
        apiTitle: 'Set Workday upload/download task status from Lambda',
        returnStatus: 200,
        returnDescription: 'Returns task UUID and status',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.PUT,
        httpPathUri: 'status',
    })
    async updateStatus(@Body() body: WorkdayInterfaces.UpdateStatusBody): Promise<WorkdayInterfaces.StatusResponse> {
        if (!this.workdayService.isValidStatus(body.processStatus)) {
            throw new KfException('Invalid status', 400, KfExceptionCodes.WORKDAY_INVALID_STATUS_ERR);
        }
        await this.workdayService.updateStatus(body.fileUUID, body.processStatus);
        return {
            uuid: body.fileUUID,
            status: body.processStatus,
        };
    }

    @KfApiMethod({
        apiTitle: 'Check Workday upload/download task status',
        returnStatus: 200,
        returnDescription: 'Returns task UUID and status',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        httpPathUri: 'status',
    })
    async getStatus(@Query() query: WorkdayInterfaces.GetStatusQuery): Promise<WorkdayInterfaces.StatusResponse> {
        return this.workdayService.getStatus(query.fileUUID);
    }
}
