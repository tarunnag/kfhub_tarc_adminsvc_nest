import { KfApiErrorHandler, KfDbException, KfException } from '@kf-products-core/kfhub_svc_lib';
import { KfExceptionCodes as ec } from '../../kfthm-exception-codes.enum';
import { EntityRepository, getManager, Repository, getConnection } from 'typeorm';
import { KfTranslationsEntity } from './kfhub-translations.entity';
import { Common } from '../../common/common.interface';

@EntityRepository(KfTranslationsEntity)
export class KfHubTranslationsRepository extends Repository<KfTranslationsEntity> {
    @KfApiErrorHandler(ec.INSERT_DATA_IN_BULK_FAILED)
    async getTranslations(lang: string, category: Common.Query.Categories): Promise<KfTranslationsEntity[]> {
        try {
            const [escapedQuery, parameters] = getConnection().driver.escapeQueryWithParameters(
                'exec [SuccessProfile].[dbo].[GetSubCategoryTranslationsByLanguage] :JobSectionCode, :LCID',
                {
                    JobSectionCode: this.getCategory(category),
                    LCID: lang,
                },
                {},
            );
            return await getManager().query(escapedQuery, parameters);
        } catch (e) {
            throw new KfDbException(e);
        }
    }

    private getCategory(category: Common.Query.Categories): string {
        switch (category) {
            case Common.Query.Categories.COMPETENCIES:
                return 'BEHAVIORAL_SKILLS';
            case Common.Query.Categories.TRAITS:
                return 'TRAITS';
            case Common.Query.Categories.DRIVERS:
                return 'DRIVERS';
            default:
                throw new KfException('Unsupported category', 500, ec.INTERNAL_SERVER_ERROR);
        }
    }
}
