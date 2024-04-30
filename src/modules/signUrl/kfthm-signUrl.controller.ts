import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { KfThmSignUrlInterface as Kf } from './kfthm-signUrl.interface';
import { Common } from '../../common/common.interface';
import { Query, Param, Body } from '@nestjs/common';
import { KfThmSignUrlService } from './kfthm-signUrl.service';
import { KfApiMethod, KfHttpMethodEnum, KfApiController, KfAny, KfSchemaValidationException } from '@kf-products-core/kfhub_svc_lib';
import { errorGenerator } from '../../common/common.utils';

@KfApiController('')
export class KfThmSignUrlController {
    constructor(private readonly service: KfThmSignUrlService) {}

    @KfApiMethod({
        apiTitle: 'Returns signed url to upload files',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        httpPathUri: 'uploadUrl',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.GET_UPLOAD_URL_FAILED,
        // Get upload url failed
    })
    async uploadSignUrl(@Query() query: Kf.Query.UploadSignedUrl): Promise<Kf.Response.UploadSignedUrl> {
        return await this.service.getSignedUrlForUpload(query);
    }

    @KfApiMethod({
        apiTitle: 'Returns signed url to download files',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        httpPathUri: 'downloadUrl',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.GET_DOWNLOAD_URL_FAILED,
        // Get download url failed
    })
    async downloadSignUrl(@Query() query: Kf.Query.DownloadFile) {
        if (query.status !== '5' && !query.fileUUID) {
            throw new KfSchemaValidationException([errorGenerator('fileUUId')]);
        }
        return await this.service.getSignedUrlForDownload(query);
    }
}
