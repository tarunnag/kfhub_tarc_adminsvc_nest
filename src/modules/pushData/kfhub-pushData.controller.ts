import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { Common } from '../../common/common.interface';
import { Query, Param, Body } from '@nestjs/common';
import { KfApiMethod, KfHttpMethodEnum, KfApiController, KfAny } from '@kf-products-core/kfhub_svc_lib';
import { KfThmPushDataService } from './kfhub-pushData.service';
@KfApiController('pushData')
export class KfThmPushDataController {
    constructor(private readonly service: KfThmPushDataService) {}

    @KfApiMethod({
        apiTitle: '',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.POST,
        httpPathUri: '',
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.PUSH_DATA_FAILED,
        // Push data failed
    })
    async uploadSignUrl(@Query() query: Common.Query.DefaultProps, @Body() body: Common.Query.PushData) {
        return await this.service.getPushData(query, body);
    }
}
