import { Logger } from '@nestjs/common';
import { KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { KfArchJobTitlesStagingEntity } from './kfarch-job.entity';
import { JobsTitlesForValidation } from './kfarch-job.interface';

@EntityRepository(KfArchJobTitlesStagingEntity)
export class KfArchJobTitlesStagingRepository extends Repository<KfArchJobTitlesStagingEntity> {
    private logger: Logger = new Logger('KfArchJobTitlesStagingRepository');
    private queryChunkSize: number = 300;

    async insertBulkData(uuid: string, data: JobsTitlesForValidation[]): Promise<void> {
        try {
            const bulkInsert: KfArchJobTitlesStagingEntity[] = data.map(({ title, architectJobFlag }) => ({ uuid, title, architectJobFlag }));
            /*
            If we try to make insert with a lot of parameters we
            get error "The incoming request has too many parameters.
            The server supports a maximum of 2100 parameters. Reduce
            the number of parameters and resend the request.", that why
            I decide to split one inset to many with 300 jobs in each
            */
            await Promise.all(
                Array(Math.ceil(bulkInsert.length / this.queryChunkSize))
                    .fill(null)
                    .map(() => {
                        return getConnection()
                            .createQueryBuilder()
                            .insert()
                            .into(KfArchJobTitlesStagingEntity)
                            .values(bulkInsert.slice(0, this.queryChunkSize))
                            .execute();
                    }),
            );
        } catch (err) {
            this.logger.error(err.message);
            throw new KfDbException(err.message);
        }
    }

    async deleteBulk(uuid: string): Promise<void> {
        try {
            await getConnection().createQueryBuilder().delete().from(KfArchJobTitlesStagingEntity).where('TaskGUID = :uuid', { uuid }).execute();
        } catch (err) {
            this.logger.error(err.message);
            throw new KfDbException(err.message);
        }
    }
}
