import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsString, Length } from 'class-validator';
import { Common } from '../../common/common.interface';
import { options, toNumber } from '../../common/common.utils';

export class GetUpdateStatus extends Common.Query.FileUuid {}

export class GetKfaJobsExportStatus {
    @IsString()
    taskUuid: string;
}

export class UpdateStatus extends Common.Query.FileUuid {
    @Transform(toNumber, options)
    processStatus: number;
}

export class KfaJobTaskExportStatus {
    @IsNumber()
    status: number;
}

export class UpdateKfaJobTaskExportStatus {
    @IsString()
    taskUuid: string;

    @IsNumber()
    status: number;
}

export class InsertDataPost extends Common.Query.FileUuid {
    @IsString()
    fileKey: string;
}

export class JobsTitlesForValidation {
    @IsString()
    @Length(1, 240, { message: 'Job title length is not in [1, 240]' })
    title: string;

    @Transform(toNumber, options)
    architectJobFlag: number;
}
export class ValidateJobTitlesPost {
    @Transform(toNumber, options)
    clientId: number;

    @IsArray()
    jobs: JobsTitlesForValidation[];
}

export interface ValidateJobTitlesResponse {
    isValid: boolean;
    duplicateJobTitles?: string[];
}

export class ValidateJobCodesRequest {
    @Transform(toNumber, options)
    clientId: number;

    @IsArray()
    jobCodes: string[];
}

export interface ExistingJobCode {
    jobCode: string;
}

export interface ValidateJobCodesResponse {
    isValid: boolean;
    duplicatedJobCodes?: ExistingJobCode[];
}

export class KfParseJsonDataContract {
    jobID: number;
    jobTitle: string;
    jobCode: string;
    hideInPM: number;
    jobStatus: string;
    function: string;
    subFunction: string;
    khPracticalTechnicalKnowledge: string;
    khManagerialKnowledge: string;
    khCommunicationInfluencingSkill: string | number;
    khPoints: number;
    khRationales: string;
    psFreedomThink: string;
    psThinkingChallenge: string;
    psPercentage: string;
    psPoints: number;
    psRationales: string;
    acFreedomAct: string;
    acAreaImpact: string;
    acNatureImpact: string;
    acPoints: number;
    acRationales: string;
    wcPhysicalEffort: string;
    wcPhysicalEnvironment: string;
    wcSensoryAttention: string;
    wcMentalStress: string;
    wcPoints: number;
    wcRationale: string;
    kfHayPoints: number;
    gradeSet: string;
    grade: string;
    gradeOverride: boolean;
    shortProfile: string;
    benchmarkIndicator: boolean;
    dynProp0: string;
    dynProp1: string;
    dynProp2: string;
    dynProp3: string;
    dynProp4: string;
    dynProp5: string;
    dynProp6: string;
    dynProp7: string;
    dynProp8: string;
    dynProp9: string;
    dynProp10: string;
    dynProp11: string;
    dynProp12: string;
    dynProp13: string;
    dynProp14: string;
    dynProp15: string;
    dynProp16: string;
    dynProp17: string;
    dynProp18: string;
    dynProp19: string;
    dynProp20: string;
    dynProp21: string;
    dynProp22: string;
    dynProp23: string;
    dynProp24: string;
    dynProp25: string;
    dynProp26: string;
    dynProp27: string;
    dynProp28: string;
    dynProp29: string;
    dynProp30: string;
    dynProp31: string;
    dynProp32: string;
    dynProp33: string;
    dynProp34: string;
    dynProp35: string;
    dynProp36: string;
    dynProp37: string;
    dynProp38: string;
    dynProp39: string;
    dynProp40: string;
    createdDate: Date;
    createdBy: string;
    lastUpdateDate: Date;
    lastUpdatedBy: string;
    dynPropId0: number;
    dynPropId1: number;
    dynPropId2: number;
    dynPropId3: number;
    dynPropId4: number;
    dynPropId5: number;
    dynPropId6: number;
    dynPropId7: number;
    dynPropId8: number;
    dynPropId9: number;
    dynPropId10: number;
    dynPropId11: number;
    dynPropId12: number;
    dynPropId13: number;
    dynPropId14: number;
    dynPropId15: number;
    dynPropId16: number;
    dynPropId17: number;
    dynPropId18: number;
    dynPropId19: number;
    dynPropId20: number;
    dynPropId21: number;
    dynPropId22: number;
    dynPropId23: number;
    dynPropId24: number;
    dynPropId25: number;
    dynPropId26: number;
    dynPropId27: number;
    dynPropId28: number;
    dynPropId29: number;
    dynPropId30: number;
    dynPropId31: number;
    dynPropId32: number;
    dynPropId33: number;
    dynPropId34: number;
    dynPropId35: number;
    dynPropId36: number;
    dynPropId37: number;
    dynPropId38: number;
    dynPropId39: number;
    dynPropId40: number;
    CalcKnowHowPoints: number;
    CalcProblemSolvingPoints: number;
    CalcAccountabilityPoints: number;
    CalcWorkingConditionsPoints: number;
    CalcShortProfile: string;
    CalcKFHayPoints: number;
    CalcGrade: number;
    OverallRationale: string;
}

export interface ClientInfo {
    clientJobsInfo: ClientJobsInfo[];
    isWorkingConditionsEnabled: boolean;
}
export interface ClientJobsInfo {
    jobID: number;
    successProfileOrJobDescription: string;
    jRTDetailID: string;
    jobName: string;
    description: string;
    jobFamilyID: string;
    jobFamilyName: string;
    jobSubFamilyID: string;
    jobSubFamilyName: string;
    referenceLevel: string;
    levelName: string;
    subLevelName: string;
    createdOn: string;
    createdBy: string;
    modifiedOn: string;
    modifiedBy: string;
    shortProfile: string;
    bICProfileName: string;
}

export class ClientJobsInfoProps extends Common.Query.DefaultProps {
    @Transform(toNumber, options)
    searchClientId: number;
}
