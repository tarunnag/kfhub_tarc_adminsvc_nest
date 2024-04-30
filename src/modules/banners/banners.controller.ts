import { KfExceptionCodes as ec } from '../../kfthm-exception-codes.enum';
import { Query, Req } from '@nestjs/common';
import { KfApiMethod, KfHttpMethodEnum, KfApiController, KfAny } from '@kf-products-core/kfhub_svc_lib';
import { Request } from 'express';
import { BannersService } from './banners.service';

@KfApiController('banners')
export class BannersController {
    constructor(protected readonly service: BannersService) {}

    @KfApiMethod({
        apiTitle: 'Get banners metaInformation',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.SYSTEM_ERROR_OCCURRED,
    })
    async handleGenericGet(@Req() request: Request): Promise<any> {
        return await this.service.handleGet(request);
    }

    @KfApiMethod({
        apiTitle: 'Put banners',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.PUT,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.INPUT_VAL_ERR,
    })
    async handlePut(@Req() request: Request): Promise<boolean> {
        return await this.service.handlePut(request);
    }
}
