import { KfApiErrorHandler, KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { Logger } from '@nestjs/common';
import { EntityRepository, getConnection, getManager, Repository } from 'typeorm';
import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { KfLanguagesEntity } from './kfhub-languages.entity';

@EntityRepository(KfLanguagesEntity)
export class KfHubLanguagesRepository extends Repository<KfLanguagesEntity> {
    logger = new Logger('KfHubLanguagesRepository');

    @KfApiErrorHandler(ec.INSERT_DATA_IN_BULK_FAILED)
    async getLanguages(): Promise<KfLanguagesEntity[]> {
        try {
            const [escapedQuery] = getConnection().driver.escapeQueryWithParameters('exec [SuccessProfile].[dbo].[GetActivateLanguages]', {}, {});
            this.logger.log(`getLanguages query: ${escapedQuery}`);
            return await getManager().query(escapedQuery);
        } catch (e) {
            throw new KfDbException(e);
        }
    }
}
