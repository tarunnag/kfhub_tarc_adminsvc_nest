import { KfApiErrorHandler, KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { EntityRepository, Repository } from 'typeorm';
import { KfArchJobTaskExportStatusEntity } from './kfarch-job-export.entity';
import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { Logger } from '@nestjs/common';

@EntityRepository(KfArchJobTaskExportStatusEntity)
export class KfaJobTaskExportStatusRepository extends Repository<KfArchJobTaskExportStatusEntity> {
    private logger: Logger = new Logger('KfaJobTaskExportStatusRepository');

    @KfApiErrorHandler(ec.CREATE_JOB_TASK_EXPORT_STATUS_BY_UUID_FAILED)
    async createStatus(taskUuid: string, taskStatus: number, createdOn: Date, userId: number): Promise<void> {
        try {
            await this.save({
                TaskGuid: taskUuid,
                TaskStatus: taskStatus,
                CreatedOn: createdOn,
                CreatedBy: userId,
            });
        } catch ({ message }) {
            this.logger.error(message);
            throw new KfDbException(message);
        }
    }

    @KfApiErrorHandler(ec.UPDATE_JOB_TASK_EXPORT_STATUS_BY_UUID_FAILED)
    async updateStatus(taskUuid: string, taskStatus: number): Promise<void> {
        try {
            await this.update(
                {
                    TaskGuid: taskUuid,
                },
                {
                    TaskStatus: taskStatus,
                },
            );
        } catch ({ message }) {
            this.logger.error(message);
            throw new KfDbException(message);
        }
    }

    @KfApiErrorHandler(ec.GET_JOB_TASK_EXPORT_BY_UUID_FAILED)
    async getStatus(taskUuid: string) {
        try {
            return await this.findOneOrFail({
                TaskGuid: taskUuid,
            });
        } catch ({ message }) {
            this.logger.error(message);
            throw new KfDbException(message);
        }
    }
}
