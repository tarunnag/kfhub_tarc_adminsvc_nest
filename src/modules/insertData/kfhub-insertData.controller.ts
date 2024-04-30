import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { Common } from '../../common/common.interface';
import { Query, Param, Body } from '@nestjs/common';
import { KfApiMethod, KfHttpMethodEnum, KfApiController, KfAny } from '@kf-products-core/kfhub_svc_lib';
import { KfThmInsertDataService } from './kfhub-insertData.service';
import { InsertDataPost } from './kfhub-insertData.interface';
@KfApiController('data')
export class KfThmInsertDataController {
    constructor(private readonly service: KfThmInsertDataService) {}

    @KfApiMethod({
        apiTitle: '',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.POST,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.INSERT_DATA_FAILED,
        // Insert data failed
    })
    async insertDataInBulk(@Body() body: InsertDataPost, @Query() query: Common.Query.DefaultProps) {
        return await this.service.insertData(body, query);
    }
}
