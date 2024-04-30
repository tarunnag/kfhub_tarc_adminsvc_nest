import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

export interface Task {
    name: string;
    clientId: string;
    cron: string;
    path: string;
    host: string;
    port: number;
    credentials: {
        username: string;
        password: string;
    };
}

export enum SupportedTasks {
    BANK_OF_AMERICA_CSV = 'Bank of America CSV',
}

@Injectable()
export class KfHubSchedulerService {
    private logger: Logger = new Logger('KfHubSchedulerService');

    constructor(private readonly configService: KfConfigService, private readonly schedulerRegistry: SchedulerRegistry) {}

    public runCrones(): void {
        let tasks: Task[];
        try {
            tasks = JSON.parse(this.configService.get('SCHEDULE_TASKS'));
        } catch (e) {
            throw new Error(e);
        }

        if (tasks?.length) {
            tasks.forEach((task) => {
                if (/(((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7}/.test(task.cron)) {
                    const cron = new CronJob(task.cron, () => {
                        this.executeCron(task);
                    });
                    this.schedulerRegistry.addCronJob(task.name, cron);
                    cron.start();
                    this.logger.log(`Schedule task ${task.name} successfully started`);
                } else {
                    this.logger.log(`Scheduler task ${task.name} cron ${task.cron} has wrong format`);
                }
            });
        } else {
            this.logger.log('Scheduler tasks not found');
        }
    }

    private executeCron(task: Task): void {
        switch (task.name) {
            case SupportedTasks.BANK_OF_AMERICA_CSV:
                this.logger.log(`execute ${SupportedTasks.BANK_OF_AMERICA_CSV}`);
                break;
            default:
                this.logger.log(`Scheduler task ${task.name} not supported`);
                break;
        }
    }
}
