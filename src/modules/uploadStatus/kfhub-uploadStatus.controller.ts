import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { Common } from '../../common/common.interface';
import { Query, Param, Body } from '@nestjs/common';
import { KfApiMethod, KfHttpMethodEnum, KfApiController, KfAny } from '@kf-products-core/kfhub_svc_lib';
import { KfThmUploadStatusService } from './kfhub-uploadStatus.service';
import { GetUploadStatus, UpsertUploadStatus } from './kfhub-uploadStatus.interface';
@KfApiController('uploadStatus')
export class KfThmUploadStatusController {
    constructor(private readonly service: KfThmUploadStatusService) {}

    @KfApiMethod({
        apiTitle: '',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.GET_UPLOAD_STATUS_FAILED,
        // Get upload status failed
    })
    async getStatusForAFile(@Query() query: GetUploadStatus) {
        return await this.service.getStatus(query);
    }

    @KfApiMethod({
        apiTitle: '',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.PUT,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.UPDATE_UPLOAD_STATUS_FAILED,
        // Update upload status failed
    })
    async upsertStatusForAFile(@Body() body: UpsertUploadStatus) {
        return await this.service.createStatus(body);
    }
}
