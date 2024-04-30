import { KfExceptionCodes as ec } from '../../kfthm-exception-codes.enum';
import { Query, Res, StreamableFile } from '@nestjs/common';
import { KfApiMethod, KfHttpMethodEnum, KfApiController, KfAny } from '@kf-products-core/kfhub_svc_lib';
import { Response } from 'express';
import { StatisticsRoute } from './statistics.route';
import { StatisticsService } from './statistics.service';
import { ClientStatisticsQuery } from './statistics.interface';

@KfApiController(StatisticsRoute.BASE)
export class StatisticsController {
    constructor(
        private readonly service: StatisticsService) { }

    @KfApiMethod({
        apiTitle: '',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        httpPathUri: StatisticsRoute.SERVER_STATISTICS,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.EXPORT_STATISTICS_FAILED
    })
    async exportServerStatistics(@Res() res: Response): Promise<StreamableFile> {
        const { buffer, contentType, fileName } = await this.service.exportServerStatistics();
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.status(200);
        return res.send(buffer);
    }

    @KfApiMethod({
        apiTitle: '',
        returnStatus: 200,
        returnDescription: '',
        returnType: KfAny,
        httpMethod: KfHttpMethodEnum.GET,
        httpPathUri: StatisticsRoute.CLIENT_STATISTICS,
        exceptionCode: ec.SUCCESS,
        customErrorCode: ec.EXPORT_STATISTICS_FAILED
    })
    async exportClientStatistics(@Query() query: ClientStatisticsQuery, @Res() res: Response): Promise<StreamableFile> {
        const { buffer, contentType, fileName } = await this.service.exportClientStatistics(query);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.status(200);
        return res.send(buffer);
    }
}
