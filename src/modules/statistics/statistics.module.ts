import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import {
    ClientStatisticsDataServiceToken,
    ClientStatisticsRendererToken,
    ServerStatisticsDataServiceToken,
    ServerStatisticsRendererToken,
    ServerStatisticsMockDataServiceToken,
    ClientStatisticsMockDataServiceToken,
} from './statistics.tokens';
import {
    ClientStatisticsMockDataService,
    ClientStatisticsSqlDataService,
    ServerStatisticsMockDataService,
    ServerStatisticsSqlDataService,
} from './statistics.sql.data-service';
import { ServerStatisticsExcelRenderer } from './statistics.excel.server-renderer';
import { StatisticsExcelHelper } from './excelJs/statistics.excel.helper';
import { ClientStatisticsExcelRenderer } from './statistics.excel.client-renderer';

@Module({
    imports: [StatisticsExportModule],
    providers: [
        StatisticsService,
        StatisticsExcelHelper,
        {
            provide: ServerStatisticsDataServiceToken,
            useClass: ServerStatisticsSqlDataService,
        },
        {
            provide: ServerStatisticsMockDataServiceToken,
            useClass: ServerStatisticsMockDataService,
        },
        {
            provide: ClientStatisticsMockDataServiceToken,
            useClass: ClientStatisticsMockDataService,
        },
        {
            provide: ServerStatisticsRendererToken,
            useClass: ServerStatisticsExcelRenderer,
        },
        {
            provide: ClientStatisticsDataServiceToken,
            useClass: ClientStatisticsSqlDataService,
        },
        {
            provide: ClientStatisticsRendererToken,
            useClass: ClientStatisticsExcelRenderer,
        },
    ],
    controllers: [StatisticsController],
})
export class StatisticsExportModule {}
