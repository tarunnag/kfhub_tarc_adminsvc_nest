import { Logger } from '@nestjs/common';
import { KfApiErrorHandler, KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { KfArchStatusEntity, KfArchInsertDataEntity } from './kfarch-job.entity';
import { KfExceptionCodes as ec } from '../../kfthm-exception-codes.enum';
import { Common } from '../../common/common.interface';
import { InsertDataPost, KfParseJsonDataContract } from './kfarch-job.interface';

@EntityRepository(KfArchStatusEntity)
export class KfArchStatusRepository extends Repository<KfArchStatusEntity> {
    private logger: Logger = new Logger('KfArchStatusRepository');

    @KfApiErrorHandler(ec.CREATE_STATUS_FAILED)
    async createStatus(uuid: string, query: Common.Query.DefaultProps, status: number) {
        const { clientId, loggedInUserClientId, userId } = query;

        try {
            return await this.save({
                KFArchitectProfilesUpdateStatusID: uuid,
                ProfileUpdateStatusID: status,
                CreateBy: userId,
                ClientID: clientId ? clientId : loggedInUserClientId,
            });
        } catch ({ message }) {
            this.logger.error(message);
            throw new KfDbException(message);
        }
    }

    @KfApiErrorHandler(ec.GET_STATUS_METADATA_BY_UUID_FAILED)
    async getMetadata(uuid: string) {
        try {
            return await this.findOneOrFail({
                KFArchitectProfilesUpdateStatusID: uuid,
            });
        } catch ({ message }) {
            this.logger.error(message);
            throw new KfDbException(message);
        }
    }

    @KfApiErrorHandler(ec.UPDATE_STATUS_BY_UUID_FAILED)
    async updateStatus(uuid: string, status: number) {
        try {
            const found = await this.getMetadata(uuid);

            return await this.update(
                {
                    KFArchitectProfilesUpdateID: found.KFArchitectProfilesUpdateID,
                    KFArchitectProfilesUpdateStatusID: uuid,
                },
                {
                    ProfileUpdateStatusID: status,
                },
            );
        } catch ({ message }) {
            this.logger.error(message);
            throw new KfDbException(message);
        }
    }
}

@EntityRepository(KfArchInsertDataEntity)
export class KfArchInsertDataRepository extends Repository<KfArchInsertDataEntity> {
    private logger: Logger = new Logger('KfArchInsertDataRepository');

    createDataEntity(data: KfParseJsonDataContract, userId: number, id: number, offset: number): KfArchInsertDataEntity {
        const WorkingConditionsScores = `${data.wcPhysicalEffort} ${data.wcPhysicalEnvironment}  ${data.wcSensoryAttention}  ${data.wcMentalStress}`;
        return {
            KFArchitectProfilesUpdateID: id,
            ProfileRecordID: offset,
            ClientJobID: data.jobID,
            JobName: data.jobTitle,
            ClientJobStatus: data.jobStatus,
            ClientJobCode: data.jobCode,
            HideInPM: data.hideInPM,
            ClientJobFunctionName: data.function,
            ClientJobSubFunctionName: data.subFunction,
            KnowHowScores: `${data.khPracticalTechnicalKnowledge} ${data.khManagerialKnowledge} ${data.khCommunicationInfluencingSkill}`,
            KnowHowPoints: data.khPoints,
            KnowHowRationale: data.khRationales,
            ProblemSolvingScores: `${data.psFreedomThink} ${data.psThinkingChallenge}`,
            ProblemSolvingPercentage: data.psPercentage,
            ProblemSolvingPoints: data.psPoints,
            ProblemSolvingRationale: data.psRationales,
            AccountabilityScores: `${data.acFreedomAct} ${data.acAreaImpact} ${data.acNatureImpact}`,
            AccountabilityPoints: data.acPoints,
            AccountabilityRationale: data.acRationales,
            WorkingConditionsScores: WorkingConditionsScores.trim() ? WorkingConditionsScores : null,
            WorkingConditionsPoints: data.wcPoints ? data.wcPoints : null,
            WorkingConditionsRationale: data.wcRationale ? data.wcRationale : null,
            KFHayPoints: data.kfHayPoints,
            GradeSetName: data.gradeSet,
            Grade: data.grade,
            GradeOverride: !!data.gradeOverride,
            ShortProfile: data.shortProfile,
            BenchmarkIndicator: !!data.benchmarkIndicator,
            CreatedBy: userId,
            CreatedOn: new Date(),
            CalcKnowHowPoints: data.CalcKnowHowPoints,
            CalcProblemSolvingPoints: data.CalcProblemSolvingPoints,
            CalcAccountabilityPoints: data.CalcAccountabilityPoints,
            CalcWorkingConditionsPoints: data.CalcWorkingConditionsPoints ? data.CalcWorkingConditionsPoints : null,
            CalcKFHayPoints: data.CalcKFHayPoints ? data.CalcKFHayPoints : null,
            CalcGrade: data.CalcGrade,
            CalcShortProfile: data.CalcShortProfile,
            JP1_ID: data.dynPropId0,
            JP1_Value: data.dynProp0,
            JP2_ID: data.dynPropId1,
            JP2_Value: data.dynProp1,
            JP3_ID: data.dynPropId2,
            JP3_Value: data.dynProp2,
            JP4_ID: data.dynPropId3,
            JP4_Value: data.dynProp3,
            JP5_ID: data.dynPropId4,
            JP5_Value: data.dynProp4,
            JP6_ID: data.dynPropId5,
            JP6_Value: data.dynProp5,
            JP7_ID: data.dynPropId6,
            JP7_Value: data.dynProp6,
            JP8_ID: data.dynPropId7,
            JP8_Value: data.dynProp7,
            JP9_ID: data.dynPropId8,
            JP9_Value: data.dynProp8,
            JP10_ID: data.dynPropId9,
            JP10_Value: data.dynProp9,
            JP11_ID: data.dynPropId10,
            JP11_Value: data.dynProp10,
            JP12_ID: data.dynPropId11,
            JP12_Value: data.dynProp11,
            JP13_ID: data.dynPropId12,
            JP13_Value: data.dynProp12,
            JP14_ID: data.dynPropId13,
            JP14_Value: data.dynProp13,
            JP15_ID: data.dynPropId14,
            JP15_Value: data.dynProp14,
            JP16_ID: data.dynPropId15,
            JP16_Value: data.dynProp15,
            JP17_ID: data.dynPropId16,
            JP17_Value: data.dynProp16,
            JP18_ID: data.dynPropId17,
            JP18_Value: data.dynProp17,
            JP19_ID: data.dynPropId18,
            JP19_Value: data.dynProp18,
            JP20_ID: data.dynPropId19,
            JP20_Value: data.dynProp19,
            JP21_ID: data.dynPropId20,
            JP21_Value: data.dynProp20,
            JP22_ID: data.dynPropId21,
            JP22_Value: data.dynProp21,
            JP23_ID: data.dynPropId22,
            JP23_Value: data.dynProp22,
            JP24_ID: data.dynPropId23,
            JP24_Value: data.dynProp23,
            JP25_ID: data.dynPropId24,
            JP25_Value: data.dynProp24,
            JP26_ID: data.dynPropId25,
            JP26_Value: data.dynProp25,
            JP27_ID: data.dynPropId26,
            JP27_Value: data.dynProp26,
            JP28_ID: data.dynPropId27,
            JP28_Value: data.dynProp27,
            JP29_ID: data.dynPropId28,
            JP29_Value: data.dynProp28,
            JP30_ID: data.dynPropId29,
            JP30_Value: data.dynProp29,
            JP31_ID: data.dynPropId30,
            JP31_Value: data.dynProp30,
            JP32_ID: data.dynPropId31,
            JP32_Value: data.dynProp31,
            JP33_ID: data.dynPropId32,
            JP33_Value: data.dynProp32,
            JP34_ID: data.dynPropId33,
            JP34_Value: data.dynProp33,
            JP35_ID: data.dynPropId34,
            JP35_Value: data.dynProp34,
            JP36_ID: data.dynPropId35,
            JP36_Value: data.dynProp35,
            JP37_ID: data.dynPropId36,
            JP37_Value: data.dynProp36,
            JP38_ID: data.dynPropId37,
            JP38_Value: data.dynProp37,
            JP39_ID: data.dynPropId38,
            JP39_Value: data.dynProp38,
            JP40_ID: data.dynPropId39,
            JP40_Value: data.dynProp39,
            JP41_ID: data.dynPropId40,
            JP41_Value: data.dynProp40,
            OverallRationale: data.OverallRationale,
        };
    }

    createDataEntities(contract: KfParseJsonDataContract[], userId, id: number, offset: number): KfArchInsertDataEntity[] {
        return contract.map((data, i) => this.createDataEntity(data, userId, id, offset + i + 1));
    }

    @KfApiErrorHandler(ec.INSERT_DATA_IN_BULK_FAILED)
    async insertBulkData(contract: KfParseJsonDataContract[], body: InsertDataPost, userId, id: number, offset: number) {
        try {
            const bulkInsert = this.createDataEntities(contract, userId, id, offset);
            await getConnection().createQueryBuilder().insert().into(KfArchInsertDataEntity).values(bulkInsert).execute();
            return body;
        } catch ({ message }) {
            this.logger.error(message);
            throw new KfDbException(message);
        }
    }

    @KfApiErrorHandler(ec.INSERT_DATA_IN_BULK_FAILED)
    async getJobIds(id: number) {
        try {
            return await getConnection()
                .createQueryBuilder()
                .select('ClientJobID')
                .from(KfArchInsertDataEntity, 'KfArchInsertDataEntity')
                .where('KfArchInsertDataEntity.KFArchitectProfilesUpdateID = :id', { id })
                .execute();
        } catch ({ message }) {
            this.logger.error(message);
            throw new KfDbException(message);
        }
    }
}
