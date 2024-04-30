import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { KfDbException, KfApiErrorHandler } from '@kf-products-core/kfhub_svc_lib';
import { Repository, EntityRepository } from 'typeorm';
import { KfThmWorkdayPublishingStatusEntity } from './kfthm-workday.entity';

@EntityRepository(KfThmWorkdayPublishingStatusEntity)
export class KfThmWorkdayPublishingStatusRepository extends Repository<KfThmWorkdayPublishingStatusEntity> {
    // Create status failed
    @KfApiErrorHandler(ec.INTERNAL_SERVER_ERROR)
    async createStatus(uuid: string, type: number, clientId: number, status: number) {
        try {
            return await this.save({
                TaskId: uuid,
                TaskStatus: status,
                TaskType: type,
                CreatedBy: clientId,
            });
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }

    // Get Status metadata by uuid failed
    @KfApiErrorHandler(ec.INTERNAL_SERVER_ERROR)
    async getMetadata(uuid: string) {
        try {
            return await this.findOneOrFail({
                TaskId: uuid,
            });
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }

    // Update status by uuid failed
    @KfApiErrorHandler(ec.INTERNAL_SERVER_ERROR)
    async updateStatus(uuid: string, status: number) {
        try {
            return await this.update(
                {
                    TaskId: uuid,
                },
                {
                    TaskStatus: status,
                },
            );
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }
}
