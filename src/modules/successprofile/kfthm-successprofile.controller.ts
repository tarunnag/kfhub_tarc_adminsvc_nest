import { KfExceptionCodes as ec } from '../../kfthm-exception-codes.enum';
import { Query, Req } from '@nestjs/common';
import { KfApiMethod, KfHttpMethodEnum, KfApiController, KfAny } from '@kf-products-core/kfhub_svc_lib';
import { KfThmSuccessprofileService } from './kfthm-successprofile.service';
import { ReportType } from './kfthm-successprofile.enum';
import { SuccessProfilesQuery } from './kfthm-successprofile.interface';
import { Request } from 'express';

@KfApiController('successprofiles')
export class KfThmSuccessprofileController {
    constructor(private readonly service: KfThmSuccessprofileService) {}

    @KfApiMethod({
        apiTitle: '',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.GET_SUCCESS_PROFILES_FAILED,
    })
    async getClientList(@Query() query: SuccessProfilesQuery) {
        return await this.service.getSuccessProfilesData(query);
    }

    @KfApiMethod({
        apiTitle: 'internal api to get clients SP pdfs',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpPathUri: 'getClientPDFs',
        httpMethod: KfHttpMethodEnum.GET,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.SYSTEM_ERROR_OCCURRED,
    })
    getClientPDFs(@Query('clientId') clientId: number, @Query('locale') locale: string, @Query('reportType') reportType: ReportType, @Req() request: Request) {
        return this.service.getClientJobsPdfs(clientId, locale, reportType, request.headers.authtoken, request.headers.pssessionid);
    }
}
