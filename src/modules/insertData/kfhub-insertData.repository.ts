import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { KfApiErrorHandler, KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { Repository, EntityRepository, getConnection } from 'typeorm';
import { KfThmInsertDataEntity } from './kfhub-insertData.entity';
import { ParseJsonDataContract, InsertDataPost } from './kfhub-insertData.interface';
import { Logger } from '@nestjs/common';

@EntityRepository(KfThmInsertDataEntity)
export class KfThmInsertDataRepository extends Repository<KfThmInsertDataEntity> {
    private logger: Logger = new Logger('KfThmInsertDataRepository');

    // Insert data in bulk failed
    @KfApiErrorHandler(ec.INSERT_DATA_IN_BULK_FAILED)
    async insertBulkData(parseData: ParseJsonDataContract[], body: InsertDataPost, userId: number, id: number) {
        try {
            const bulkInsert: KfThmInsertDataEntity[] = [];

            parseData.forEach((data) => {
                const db = new KfThmInsertDataEntity();
                db.ProfileUploadFromEmpPayDataID = id;
                db.ClientFamily = data.client_family;
                db.ClientJobCode = data.client_job_code;
                db.HideInProfileManager = data.hide_in_profilemanager;
                db.ClientJobSummary = data.job_summary;
                db.ClientJobtitle = data.client_job_title;
                db.CompanyName = data.company_name;

                db.CompanyOrgCode = data.company_orgcode;

                if (data.company_id) {
                    db.CompanyID = data.company_id;
                }
                if (data.pams_id) {
                    db.CompanyID = data.pams_id;
                }
                if (data.country_id) {
                    db.CountryID = data.country_id;
                }
                if (data.reference_level) {
                    db.ReferenceLevel = data.reference_level;
                }

                db.CreateBy = userId;
                db.CreatedOn = new Date();

                db.JobCode = data.job_code;
                db.KFFamilyCode = data.family_code;
                db.KFSubfamilyCode = data.subfamily_code;
                db.ProfileRecordID = data.profileRecordId;
                // db.ProfileUploadStatusID = 0
                db.MappedSPClientJobID = null;

                db.BICProfileJRTDetailID = data.BIC_Profile_JRTDetailID;

                db.ArchitectJobFlag = data.architect_job_flag;

                db.ArchitectJobCode = data.architect_job_code;
                db.BenchMarkFlag = data.Benchmark_Job;
                db.CustomProfileID = data.custom_profile_id;
                db.LCID = data.language;

                bulkInsert.push(db);
            });

            await getConnection().createQueryBuilder().insert().into(KfThmInsertDataEntity).values(bulkInsert).execute();

            return body;
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }
}
