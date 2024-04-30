import { KfAny, KfApiController, KfApiMethod, KfHttpMethodEnum } from '@kf-products-core/kfhub_svc_lib';
import { Body, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { Common } from '../../common/common.interface';
import { KfExceptionCodes as ec } from '../../kfthm-exception-codes.enum';
import { TranslationsDTO, TranslationsRO } from './kfhub-translations.dto';
import { KfHubTranslationsService } from './kfhub-translations.service';

@KfApiController('translations')
export class KfHubTranslationsController {
    constructor(private readonly translationsService: KfHubTranslationsService) {}

    @KfApiMethod({
        apiTitle: 'Get the list of translations (en, requested language from CMS and requested language from local DB )',
        returnStatus: 200,
        returnDescription: 'Returns list of translations',
        returnType: Array(TranslationsRO),
        httpMethod: KfHttpMethodEnum.GET,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.INTERNAL_SERVER_ERROR,
    })
    async getTranslations(@Query() query: Common.Query.TranslationProps): Promise<TranslationsDTO[]> {
        return await this.translationsService.getTranslations(query);
    }

    @KfApiMethod({
        apiTitle: 'Update the translations from CMS to local DB',
        returnStatus: 200,
        returnDescription: 'Update the translations',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.POST,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.INTERNAL_SERVER_ERROR,
    })
    // @TODO fix return typing
    async updateTranslations(@Body() body: Common.Query.TranslationProps, @Req() request: Request): Promise<boolean> {
        return await this.translationsService.updateTranslations(body, request.headers.authtoken);
    }
}
