import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KfThmWorkdayController } from './kfthm-workday.controller';
import { KfThmWorkdayService } from './kfthm-workday.service';
import { KfThmWorkdayStagingDBService } from './kfthm-workday-staging-db.service';
import { KfThmWorkdayPublishingStatusRepository } from './kfthm-workday.repository';

@Module({
    imports: [TypeOrmModule.forFeature([KfThmWorkdayPublishingStatusRepository]), KfThmWorkdayModule],
    controllers: [KfThmWorkdayController],
    providers: [KfThmWorkdayService, KfThmWorkdayStagingDBService],
})
export class KfThmWorkdayModule {}
