import { KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { Repository, EntityRepository, getConnection } from 'typeorm';
import { Common } from '../../common/common.interface';
import { KfThmInsertDataEntity } from '../insertData/kfhub-insertData.entity';

@EntityRepository(KfThmInsertDataEntity)
export class KfThmUploadStatusRepository extends Repository<KfThmInsertDataEntity> {
    async getMapping(uuid) {
        try {
            return await this.query(`SuccessProfile.dbo.ProfileUploadFromEmpDataValidation '${uuid}'`);
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }

    // async updateStatus(uuid, statusNumber) {
    //     return await this.query(`
    //         UpdateProfileUploadStatus '${uuid}', ${statusNumber}
    //     `)
    // }
}
