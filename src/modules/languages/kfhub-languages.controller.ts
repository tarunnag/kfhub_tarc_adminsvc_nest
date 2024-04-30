import { KfAny, KfApiController, KfApiMethod, KfHttpMethodEnum } from '@kf-products-core/kfhub_svc_lib';
import { Query, Req } from '@nestjs/common';
import { KfExceptionCodes as ec } from '../../kfthm-exception-codes.enum';
import { KfHubLanguagesDTO } from './kfhub-languages.interface';
import { KfHubLanguagesService } from './kfhub-languages.service';

@KfApiController('languages')
export class KfHubLanguagesController {
    constructor(private readonly languagesService: KfHubLanguagesService) {}

    @KfApiMethod({
        apiTitle: 'List available languages',
        returnStatus: 200,
        returnDescription: 'Returns list of available languages',
        returnType: [KfHubLanguagesDTO],
        httpMethod: KfHttpMethodEnum.GET,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.INTERNAL_SERVER_ERROR,
    })
    async getLanguages(): Promise<KfHubLanguagesDTO[]> {
        return await this.languagesService.getLanguages();
    }
}
