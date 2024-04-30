import { Injectable, Logger } from '@nestjs/common';
import { MssqlUtils } from '../../common/common.utils';
import { ClientStatistics, ClientStatisticsDataService, ClientStatisticsQuery, ServerStatistics, ServerStatisticsDataService } from './statistics.interface';
const clientData = {} //require('../../../data/client-kf-mock-data.json');
const serverData = {} //require('../../../data/server-kf-mock-data.json');
@Injectable()
export class ServerStatisticsSqlDataService implements ServerStatisticsDataService {
    private readonly logger = new Logger('ServerStatisticsSqlDataService');

    async getServerStatistics(): Promise<ServerStatistics> {
        try {
            return (await MssqlUtils.getDatasetFromStream(`exec SuccessProfile.dbo.GetServerLevelUsageStatistics`)) as ServerStatistics;
        } catch (e) {
            this.logger.error(e, `Error in getting serverStatistics from SqlServer`);
            throw e;
        }
    }
}
@Injectable()
export class ClientStatisticsSqlDataService implements ClientStatisticsDataService {
    private readonly logger = new Logger('ClientStatisticsSqlDataService');

    async getClientStatistics(query: ClientStatisticsQuery): Promise<ClientStatistics> {
        try {
            return (await MssqlUtils.getDatasetFromStream(`exec SuccessProfile.dbo.GetClientLevelUsageStatistics @InClientID = ${query.requestClient}`)) as ClientStatistics;
        } catch (e) {
            this.logger.error(e, `Error in getting ClientStatistics from SqlServer`);
        }
    }
}
@Injectable()
export class ServerStatisticsMockDataService implements ServerStatisticsMockDataService {
    private readonly logger = new Logger('ServerStatisticsMockDataService');

    async getServerMockStatistics(): Promise<ServerStatistics> {
        try {
            return serverData as ServerStatistics;
        } catch (e) {
            this.logger.error(e, `Error in getting serverStatistics from MockData`);
            throw e;
        }
    }
}
@Injectable()
export class ClientStatisticsMockDataService implements ClientStatisticsMockDataService {
    private readonly logger = new Logger('ServerStatisticsMockDataService');

    async getClientMockStatistics(): Promise<ClientStatistics> {
        try {
            return clientData as ClientStatistics;
        } catch (e) {
            this.logger.error(e, `Error in getting serverStatistics from MockData`);
            throw e;
        }
    }
}
