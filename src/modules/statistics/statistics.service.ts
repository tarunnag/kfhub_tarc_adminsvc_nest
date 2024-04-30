import { Inject, Injectable, Logger } from '@nestjs/common';
import { KfException } from '@kf-products-core/kfhub_svc_lib';
import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import {
    ClientStatisticsDataServiceToken,
    ClientStatisticsRendererToken,
    ServerStatisticsDataServiceToken,
    ServerStatisticsRendererToken,
    ServerStatisticsMockDataServiceToken,
    ClientStatisticsMockDataServiceToken,
} from './statistics.tokens';
import {
    ClientStatisticsDataService,
    ClientStatisticsMockDataService,
    ClientStatisticsQuery,
    ClientStatisticsRenderer,
    ServerStatisticsDataService,
    ServerStatisticsMockDataService,
    ServerStatisticsRenderer,
    StatisticsExportResult,
} from './statistics.interface';
import { ContentTypeExtension } from './statistics.const';
@Injectable()
export class StatisticsService {
    private readonly logger = new Logger('StatisticsService');

    constructor(
        @Inject(ServerStatisticsDataServiceToken)
        private readonly serverStatisticsDataService: ServerStatisticsDataService,
        @Inject(ServerStatisticsRendererToken)
        private readonly serverStatisticsRenderer: ServerStatisticsRenderer,
        @Inject(ClientStatisticsDataServiceToken)
        private readonly clientStatisticsDataService: ClientStatisticsDataService,
        @Inject(ClientStatisticsRendererToken)
        private readonly clientStatisticsRenderer: ClientStatisticsRenderer,
        @Inject(ServerStatisticsMockDataServiceToken)
        private readonly serverStatisticsMockDataService: ServerStatisticsMockDataService,
        @Inject(ClientStatisticsMockDataServiceToken)
        private readonly clientStatisticsMockDataService: ClientStatisticsMockDataService,
    ) {}

    async exportServerStatistics(): Promise<StatisticsExportResult> {
        try {
            // const data = await this.serverStatisticsMockDataService.getServerMockStatistics(); // for mock data
            const data = await this.serverStatisticsDataService.getServerStatistics();
            const buffer = await this.serverStatisticsRenderer.render(data);
            const contentType = this.serverStatisticsRenderer.contentType;
            return {
                buffer,
                contentType,
                fileName: `serverStatistics.${ContentTypeExtension[contentType] || 'raw'}`,
            };
        } catch (e) {
            this.logger.error(e, 'Error in exportServerStatistics');
            throw new KfException(e.message, 500, ec.EXTERNAL_IO_CALL_ERR);
        }
    }

    async exportClientStatistics(query: ClientStatisticsQuery): Promise<StatisticsExportResult> {
        try {
            //  const data = await this.clientStatisticsMockDataService.getClientMockStatistics(); // for mock data
            const data = await this.clientStatisticsDataService.getClientStatistics(query);
            const buffer = await this.clientStatisticsRenderer.render(data);
            const contentType = this.clientStatisticsRenderer.contentType;
            return {
                buffer,
                contentType,
                fileName: `clientStatistics.${ContentTypeExtension[contentType] || 'raw'}`,
            };
        } catch (e) {
            this.logger.error(e, 'Error in ClientServerStatistics');
            throw new KfException(e.message, 500, ec.EXTERNAL_IO_CALL_ERR);
        }
    }
}
