import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KfArchJobController } from './kfarch-job.controller';
import { KfArchJobService } from './kfarch-job.service';
import { KfArchJobExportService } from './kfarch-job-export.service';
import { KfArchInsertDataRepository, KfArchStatusRepository } from './kfarch-job.repository';
import { KfArchJobTitlesStagingRepository } from './kfarch-job-titles-staging.repository';
import { KfArchClientJobDBService } from './kfarch-clientjob-db.service';
import { KfaJobTaskExportStatusRepository } from './kfarch-job-export.repository';
import { KfThmSignUrlUtils } from '../signUrl/kfthm-signUrl.util';

@Module({
    imports: [
        TypeOrmModule.forFeature([KfArchStatusRepository, KfArchInsertDataRepository, KfArchJobTitlesStagingRepository, KfaJobTaskExportStatusRepository]),
        KfArchJobModule,
    ],
    providers: [KfArchJobService, KfArchClientJobDBService, KfArchJobExportService, KfThmSignUrlUtils],
    controllers: [KfArchJobController],
})
export class KfArchJobModule {}
