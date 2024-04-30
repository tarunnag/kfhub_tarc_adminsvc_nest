import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { Query, Body, Headers, Req } from '@nestjs/common';
import { KfApiMethod, KfHttpMethodEnum, KfApiController, KfAny } from '@kf-products-core/kfhub_svc_lib';
import { KfThmProfileExportService } from './kfthm-profile-export.service';
import { KfThmProfileExportRequestDTO } from './kfthm-profile-export.interface';
import { Request } from 'express';
@KfApiController('exportprofiles')
export class KfThmProfileExportController {
    constructor(private readonly service: KfThmProfileExportService) {}

    @KfApiMethod({
        apiTitle: '',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.POST,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.EXPORT_PROFILES_FAILED,
        // Export profiles failed
    })
    async export(@Query() query, @Body() body: KfThmProfileExportRequestDTO, @Headers('authtoken') token, @Req() request: Request) {
        request.setTimeout(600000);
        return await this.service.profileExport(query, body, token);
    }
}
