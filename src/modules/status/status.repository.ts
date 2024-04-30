import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { KfDbException, KfApiErrorHandler } from '@kf-products-core/kfhub_svc_lib';
import { Repository, EntityRepository } from 'typeorm';
import { KfThmStatusEntity } from './status.entity';
@EntityRepository(KfThmStatusEntity)
export class KfThmStatusRepository extends Repository<KfThmStatusEntity> {
    // Create status failed
    @KfApiErrorHandler(ec.CREATE_STATUS_FAILED)
    async createStatus(uuid: string, createdBy: number, clientId: number, status: number) {
        try {
            return await this.save({
                ProfileUploadFromEmpPayDataStatusID: uuid,
                ProfileUploadStatusID: status,
                ClientId: clientId,
                CreateBy: createdBy,
            });
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }

    // Get Status metadata by uuid failed
    @KfApiErrorHandler(ec.GET_STATUS_METADATA_BY_UUID_FAILED)
    async getMetadata(uuid: string) {
        try {
            return await this.findOneOrFail({
                ProfileUploadFromEmpPayDataStatusID: uuid,
            });
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }

    // Update status by uuid failed
    @KfApiErrorHandler(ec.UPDATE_STATUS_BY_UUID_FAILED)
    async updateStatus(uuid: string, status: number) {
        try {
            const found = await this.getMetadata(uuid);

            return await this.update(
                {
                    ProfileUploadFromEmpPayDataID: found.ProfileUploadFromEmpPayDataID,
                    ProfileUploadFromEmpPayDataStatusID: uuid,
                },
                {
                    ProfileUploadStatusID: status,
                },
            );
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }
}
