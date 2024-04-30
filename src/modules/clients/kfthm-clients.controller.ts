import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { Common } from '../../common/common.interface';
import { Query, Param, Body } from '@nestjs/common';
import { KfApiMethod, KfHttpMethodEnum, KfApiController, KfAny } from '@kf-products-core/kfhub_svc_lib';
import { KfThmClientsService } from './kfthm-clients.service';
@KfApiController('clients')
export class KfThmClientsController {
    constructor(private readonly service: KfThmClientsService) {}

    @KfApiMethod({
        apiTitle: '',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.GET_CLIENTS_LIST_FAILED,
        // Get clients list failed
    })
    async getClientList(@Query() query: Common.Query.Pagination) {
        return await this.service.clientList(query);
    }
}
