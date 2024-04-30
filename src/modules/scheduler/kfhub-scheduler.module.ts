import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KfHubSchedulerService } from './kfhub-scheduler.service';

@Module({ imports: [ScheduleModule.forRoot()], providers: [KfHubSchedulerService] })
export class KfHubSchedulerModule {
    constructor(readonly kfHubSchedulerService: KfHubSchedulerService) {
        kfHubSchedulerService.runCrones();
    }
}
