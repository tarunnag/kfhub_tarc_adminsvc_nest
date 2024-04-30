import { Module } from '@nestjs/common';
import { KfThmMsSqlDbModule } from './kfthm-mssql-db.module';
import { KfCommonModule, KfHealthCheckModule, KfHealthCheckOptionsService } from '@kf-products-core/kfhub_svc_lib';
import { KfThmHealthCheckOptionsService } from './services/kfthm-health-check-options.service';
import { KfHubSchedulerModule } from './modules/scheduler/kfhub-scheduler.module';
import { KfHubSftpModule } from './modules/sftp/kfhub-sftp.module';

@Module({
    imports: [KfCommonModule, KfHealthCheckModule, KfThmMsSqlDbModule.forRoot(), KfHubSftpModule, KfHubSchedulerModule],
    providers: [
        KfThmHealthCheckOptionsService,
        {
            provide: KfHealthCheckOptionsService,
            useValue: KfThmHealthCheckOptionsService,
        },
    ],
})
export class KfThmApplicationModule {}
