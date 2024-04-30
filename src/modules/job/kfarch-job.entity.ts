import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { KfStringToNumberTransformer } from '@kf-products-core/kfhub_svc_lib';

@Entity('KFArchitectProfilesUpdateStatus', { database: 'Architect' })
export class KfArchStatusEntity {
    @PrimaryGeneratedColumn({ name: 'KFArchitectProfilesUpdateID' })
    KFArchitectProfilesUpdateID?: number;

    @Column({ name: 'KFArchitectProfilesUpdateStatusID' })
    KFArchitectProfilesUpdateStatusID: string;

    @Column({ name: 'ProfileUpdateStatusID', transformer: [KfStringToNumberTransformer] })
    ProfileUpdateStatusID: number;

    @Column({ name: 'CreatedOn' })
    CreatedOn: Date;

    @Column({ name: 'CreatedBy', transformer: [KfStringToNumberTransformer] })
    CreateBy: number;

    @Column({ name: 'ClientID', transformer: [KfStringToNumberTransformer] })
    ClientID: number;
}

@Entity('KFArchitectProfilesUpdate', { database: 'Architect' })
export class KfArchInsertDataEntity {
    @PrimaryColumn({ name: 'KFArchitectProfilesUpdateID' })
    KFArchitectProfilesUpdateID: number;

    @Column({ name: 'ProfileRecordID', transformer: [KfStringToNumberTransformer] })
    ProfileRecordID: number;

    @Column({ name: 'ClientJobID', transformer: [KfStringToNumberTransformer] })
    ClientJobID: number;

    @Column({ name: 'JobName' })
    JobName: string;

    @Column({ name: 'ClientJobCode' })
    ClientJobCode: string;

    @Column({ name: 'HideInProfileManager' })
    HideInPM: number;

    @Column({ name: 'ClientJobStatus' })
    ClientJobStatus: string;

    @Column({ name: 'ClientJobFunctionName' })
    ClientJobFunctionName: string;

    @Column({ name: 'ClientJobSubFunctionName' })
    ClientJobSubFunctionName: string;

    @Column({ name: 'KnowHowScores' })
    KnowHowScores: string;

    @Column({ name: 'KnowHowPoints', transformer: [KfStringToNumberTransformer] })
    KnowHowPoints: number;

    @Column({ name: 'KnowHowRationale' })
    KnowHowRationale: string;

    @Column({ name: 'ProblemSolvingScores' })
    ProblemSolvingScores: string;

    @Column({ name: 'ProblemSolvingPercentage' })
    ProblemSolvingPercentage: string;

    @Column({ name: 'ProblemSolvingPoints', transformer: [KfStringToNumberTransformer] })
    ProblemSolvingPoints: number;

    @Column({ name: 'ProblemSolvingRationale' })
    ProblemSolvingRationale: string;

    @Column({ name: 'AccountabilityScores' })
    AccountabilityScores: string;

    @Column({ name: 'AccountabilityPoints', transformer: [KfStringToNumberTransformer] })
    AccountabilityPoints: number;

    @Column({ name: 'AccountabilityRationale' })
    AccountabilityRationale: string;

    @Column({ name: 'WorkingConditionsScores' })
    WorkingConditionsScores: string;

    @Column({ name: 'WorkingConditionsPoints', transformer: [KfStringToNumberTransformer] })
    WorkingConditionsPoints: number;

    @Column({ name: 'WorkingConditionsRationale' })
    WorkingConditionsRationale: string;

    @Column({ name: 'KFHayPoints', transformer: [KfStringToNumberTransformer] })
    KFHayPoints: number;

    @Column({ name: 'GradeSetName' })
    GradeSetName: string;

    @Column({ name: 'Grade' })
    Grade: string;

    @Column({ name: 'IsGradeOverriddenByJE' })
    GradeOverride: boolean;

    @Column({ name: 'ShortProfile' })
    ShortProfile: string;

    @Column({ name: 'BenchmarkIndicator' })
    BenchmarkIndicator: boolean;

    @Column({ name: 'CreatedOn' })
    CreatedOn: Date;

    @Column({ name: 'CreatedBy', transformer: [KfStringToNumberTransformer] })
    CreatedBy: number;

    @Column({ name: 'CalcKnowHowPoints', transformer: [KfStringToNumberTransformer] })
    CalcKnowHowPoints: number;

    @Column({ name: 'CalcProblemSolvingPoints', transformer: [KfStringToNumberTransformer] })
    CalcProblemSolvingPoints: number;

    @Column({ name: 'CalcAccountabilityPoints', transformer: [KfStringToNumberTransformer] })
    CalcAccountabilityPoints: number;

    @Column({ name: 'CalcWorkingConditionsPoints', transformer: [KfStringToNumberTransformer] })
    CalcWorkingConditionsPoints: number;

    @Column({ name: 'CalcKFHayPoints', transformer: [KfStringToNumberTransformer] })
    CalcKFHayPoints: number;

    @Column({ name: 'CalcGrade', transformer: [KfStringToNumberTransformer] })
    CalcGrade: number;

    @Column({ name: 'CalcShortProfile' })
    CalcShortProfile: string;

    @Column({ name: 'JP1_ID' })
    JP1_ID: number;

    @Column({ name: 'JP1_Value' })
    JP1_Value: string;

    @Column({ name: 'JP2_ID' })
    JP2_ID: number;

    @Column({ name: 'JP2_Value' })
    JP2_Value: string;

    @Column({ name: 'JP3_ID' })
    JP3_ID: number;

    @Column({ name: 'JP3_Value' })
    JP3_Value: string;

    @Column({ name: 'JP4_ID' })
    JP4_ID: number;

    @Column({ name: 'JP4_Value' })
    JP4_Value: string;

    @Column({ name: 'JP5_ID' })
    JP5_ID: number;

    @Column({ name: 'JP5_Value' })
    JP5_Value: string;

    @Column({ name: 'JP6_ID' })
    JP6_ID: number;

    @Column({ name: 'JP6_Value' })
    JP6_Value: string;

    @Column({ name: 'JP7_ID' })
    JP7_ID: number;

    @Column({ name: 'JP7_Value' })
    JP7_Value: string;

    @Column({ name: 'JP8_ID' })
    JP8_ID: number;

    @Column({ name: 'JP8_Value' })
    JP8_Value: string;

    @Column({ name: 'JP9_ID' })
    JP9_ID: number;

    @Column({ name: 'JP9_Value' })
    JP9_Value: string;

    @Column({ name: 'JP10_ID' })
    JP10_ID: number;

    @Column({ name: 'JP10_Value' })
    JP10_Value: string;

    @Column({ name: 'JP11_ID' })
    JP11_ID: number;

    @Column({ name: 'JP11_Value' })
    JP11_Value: string;

    @Column({ name: 'JP12_ID' })
    JP12_ID: number;

    @Column({ name: 'JP12_Value' })
    JP12_Value: string;

    @Column({ name: 'JP13_ID' })
    JP13_ID: number;

    @Column({ name: 'JP13_Value' })
    JP13_Value: string;

    @Column({ name: 'JP14_ID' })
    JP14_ID: number;

    @Column({ name: 'JP14_Value' })
    JP14_Value: string;

    @Column({ name: 'JP15_ID' })
    JP15_ID: number;

    @Column({ name: 'JP15_Value' })
    JP15_Value: string;

    @Column({ name: 'JP16_ID' })
    JP16_ID: number;

    @Column({ name: 'JP16_Value' })
    JP16_Value: string;

    @Column({ name: 'JP17_ID' })
    JP17_ID: number;

    @Column({ name: 'JP17_Value' })
    JP17_Value: string;

    @Column({ name: 'JP18_ID' })
    JP18_ID: number;

    @Column({ name: 'JP18_Value' })
    JP18_Value: string;

    @Column({ name: 'JP19_ID' })
    JP19_ID: number;

    @Column({ name: 'JP19_Value' })
    JP19_Value: string;

    @Column({ name: 'JP20_ID' })
    JP20_ID: number;

    @Column({ name: 'JP20_Value' })
    JP20_Value: string;

    @Column({ name: 'JP21_ID' })
    JP21_ID: number;

    @Column({ name: 'JP21_Value' })
    JP21_Value: string;

    @Column({ name: 'JP22_ID' })
    JP22_ID: number;

    @Column({ name: 'JP22_Value' })
    JP22_Value: string;

    @Column({ name: 'JP23_ID' })
    JP23_ID: number;

    @Column({ name: 'JP23_Value' })
    JP23_Value: string;

    @Column({ name: 'JP24_ID' })
    JP24_ID: number;

    @Column({ name: 'JP24_Value' })
    JP24_Value: string;

    @Column({ name: 'JP25_ID' })
    JP25_ID: number;

    @Column({ name: 'JP25_Value' })
    JP25_Value: string;

    @Column({ name: 'JP26_ID' })
    JP26_ID: number;

    @Column({ name: 'JP26_Value' })
    JP26_Value: string;

    @Column({ name: 'JP27_ID' })
    JP27_ID: number;

    @Column({ name: 'JP27_Value' })
    JP27_Value: string;

    @Column({ name: 'JP28_ID' })
    JP28_ID: number;

    @Column({ name: 'JP28_Value' })
    JP28_Value: string;

    @Column({ name: 'JP29_ID' })
    JP29_ID: number;

    @Column({ name: 'JP29_Value' })
    JP29_Value: string;

    @Column({ name: 'JP30_ID' })
    JP30_ID: number;

    @Column({ name: 'JP30_Value' })
    JP30_Value: string;

    @Column({ name: 'JP31_ID' })
    JP31_ID: number;

    @Column({ name: 'JP31_Value' })
    JP31_Value: string;

    @Column({ name: 'JP32_ID' })
    JP32_ID: number;

    @Column({ name: 'JP32_Value' })
    JP32_Value: string;

    @Column({ name: 'JP33_ID' })
    JP33_ID: number;

    @Column({ name: 'JP33_Value' })
    JP33_Value: string;

    @Column({ name: 'JP34_ID' })
    JP34_ID: number;

    @Column({ name: 'JP34_Value' })
    JP34_Value: string;

    @Column({ name: 'JP35_ID' })
    JP35_ID: number;

    @Column({ name: 'JP35_Value' })
    JP35_Value: string;

    @Column({ name: 'JP36_ID' })
    JP36_ID: number;

    @Column({ name: 'JP36_Value' })
    JP36_Value: string;

    @Column({ name: 'JP37_ID' })
    JP37_ID: number;

    @Column({ name: 'JP37_Value' })
    JP37_Value: string;

    @Column({ name: 'JP38_ID' })
    JP38_ID: number;

    @Column({ name: 'JP38_Value' })
    JP38_Value: string;

    @Column({ name: 'JP39_ID' })
    JP39_ID: number;

    @Column({ name: 'JP39_Value' })
    JP39_Value: string;

    @Column({ name: 'JP40_ID' })
    JP40_ID: number;

    @Column({ name: 'JP40_Value' })
    JP40_Value: string;

    @Column({ name: 'JP41_ID' })
    JP41_ID: number;

    @Column({ name: 'JP41_Value' })
    JP41_Value: string;

    @Column({ name: 'OverallRationale' })
    OverallRationale: string;
}

@Entity('StgClientJobTitlesValidation', { database: 'SuccessProfile' })
export class KfArchJobTitlesStagingEntity {
    @PrimaryColumn({ name: 'TaskGUID' })
    uuid: string;

    @Column({ name: 'JobName' })
    title: string;

    @Column({ name: 'ArchitectJobFlag', transformer: [KfStringToNumberTransformer] })
    architectJobFlag: number;
}
