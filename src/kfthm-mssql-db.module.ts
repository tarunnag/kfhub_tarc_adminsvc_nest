import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KfConfigModule, KfConfigService, KfLoggingService, KfLoggingModule } from '@kf-products-core/kfhub_svc_lib';
import { KfThmSignUrlModule } from './modules/signUrl/kfthm-signUrl.module';
import { KfThmClientsModule } from './modules/clients/kfhub-clients.module';
import { KfThmUploadStatusModule } from './modules/uploadStatus/kfhub-uploadStatus.module';
import { KfThmInsertDataModule } from './modules/insertData/kfhub-insertData.module';
import { KfThmPushDataModule } from './modules/pushData/kfhub-pushData.module';
import { KfThmSocketModule } from './socket/kfthm-socket.module';
import { KfThmSuccessprofileModule } from './modules/successprofile/kfthm-successprofile.module';
import { KfThmProfileExportModule } from './modules/profileExport/kfthm-profile-export.module';
import { KfArchJobModule } from './modules/job/kfarch-job.module';
import { KfThmWorkdayModule } from './modules/workday/kfthm-workday.module';
import { KfHubLanguagesModule } from './modules/languages/kfhub-languages.module';
import { KfHubTranslationsModule } from './modules/translations/kfhub-translations.module';
import { BannersModule } from './modules/banners/banners.module';
import { StatisticsExportModule } from './modules/statistics/statistics.module';

const MODULES = [
    KfThmSignUrlModule,
    KfThmClientsModule,
    KfThmUploadStatusModule,
    KfThmInsertDataModule,
    KfThmPushDataModule,
    KfThmSocketModule,
    KfThmSuccessprofileModule,
    KfThmProfileExportModule,
    KfArchJobModule,
    BannersModule,
    KfThmWorkdayModule,
    KfHubLanguagesModule,
    KfHubTranslationsModule,
    StatisticsExportModule,
];

export class KfThmMsSqlDbModule {
    public static forRoot(): DynamicModule {
        let imports = [];
        let exports = [];
        const thmMssqlModuleEnabled = process.env.THM_MSSQL_MODULE_ENABLED === 'true';
        if (thmMssqlModuleEnabled) {
            imports = [
                TypeOrmModule.forRootAsync({
                    imports: [KfConfigModule, KfLoggingModule],
                    useFactory: (configService: KfConfigService, loggingService: KfLoggingService) => {
                        return KfThmMsSqlDbModule.getAtsDbTypeOrmConfig(configService, loggingService);
                    },
                    inject: [KfConfigService, KfLoggingService],
                }),
                ...MODULES,
            ];

            exports = [...MODULES];
        }

        return {
            module: KfThmMsSqlDbModule,
            imports,
            exports,
        };
    }

    static getAtsDbTypeOrmConfig(configService: KfConfigService, loggingService: KfLoggingService): any {
        return {
            type: 'mssql',
            host: configService.get('THM_DB_HOST'),
            port: +configService.get('THM_DB_PORT'),
            username: configService.get('THM_DB_U'),
            password: configService.get('THM_DB_P'),
            database: configService.get('THM_DB_DATABASE'),
            entities: ['**/*.entity{.ts,.js}'],
            synchronize: false,
            connectTimeout: 300000,
            logging: loggingService.getTypeOrmLoggingLevels(),
            requestTimeout: 300000,
            extra: {
                trustServerCertificate: true,
            },
        };
    }
}
