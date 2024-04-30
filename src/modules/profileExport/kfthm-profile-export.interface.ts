import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { options, toNumber } from '../../common/common.utils';

export class KfThmProfileExportRequestDTO {
    @IsString()
    requestorEmail: string;

    @IsString()
    reasonforExport: string;

    @IsString()
    clientName: string;

    @IsString()
    lcid: string;

    @Transform(toNumber, options)
    selectedClientId: number;

    @IsString()
    loggedInUserEmail: string;

    @IsString()
    language: string;
}

export interface KfThmProfileExportSaveRequest {
    ClientID?: number;
    RequestorEmail?: string;
    ReasonforExport?: string;
    LCID?: string;
    AuthToken?: string;
    GeneratedBy?: number;
    GeneratedOn?: string;
}

export interface KfThmDbResponse {
    [key: string]: any;
}
export interface KfThmDbResponse1 {
    'Success Profile': any;
    Responsibilities: any;
    Tasks: any;
    'Behavioral Comps': any;
    Skills: any;
    Tools: any;
    Education: any;
    'General Exp': any;
    'Managerial Exp': any;
    Traits: any;
    Drivers: any;
}

export enum KfThmProfileEnum {
    DESCRIPTION = 'Description',
    RESPONSIBILITY_DESCRIPTION = 'Responsibility Description',
    BEHAVIORAL_COMPETENCY_DESCRIPTION = 'Behavioral Competency Description',
    TECHNICAL_COMPETENCY_DESCRIPTION = 'Technical Competency Description', // This is added for backward compability
    SKILL_DESCRIPTION = 'Skill Description', // This is a new name for Skill Description column
    EDUCATION_DESCRIPTION = 'Education Description',
    SKILL_COMPONENTS = 'Skill Components',
    JOB_CODE = 'Job Code',
    JOB_ID = 'JobID',
    JRT_DETAIL_ID = 'JRTDetailID',
    JOB_FAMILY_ID = 'JobFamilyID',
    JOB_SUBFAMILY_ID = 'JobSubFamilyID',
    REFERENCE_LEVEL = 'ReferenceLevel',
    KF_LEVEL_CODE = 'KF Level Code',
    CREATED_ON = 'Created On',
    MODIFIED_ON = 'Modified On',
    SHORT_PROFILE = 'ShortProfile',
    UNIQUE_ID = 'UniqueID',
    LEVEL = 'Level',
    IMPORTANT = 'Important?',
    TYPE = 'Type',
    TASK_ORDER = 'Task Order',
    TOOL_ORDER = 'Tool Order',
    EXAMPLE_ORDER = 'Example Order',
}

export interface GradeSet {
    gradeSetId: number;
    gradeSetName: string;
    gradeSetStandard: string;
    isDefault: boolean;
    createdBy: number;
    createdByFirstname: string;
    createdByLastname: string;
    createdOn: number;
    modifiedByFirstname: string | null;
    modifiedByLastname: string | null;
    modifiedOn: number | null;
    status: string;
    countryCode: string;
    country: string | null;
}

export interface JobProps {
    [key: string]: JobProp;
}

interface JobPropPermissions {
    canView: boolean;
    canEdit: boolean;
}

export interface JobProp extends JobPropPermissions {
    id: string;
    name: string;
    value: string;
    canView: boolean;
    canEdit: boolean;
    props: Prop[];
    displayJobProperty: boolean;
    required: boolean;
}

export interface Prop extends JobPropPermissions {
    id: string;
    name: string;
}

export enum JobPropValues {
    BENCHMARK = 'BENCHMARK',
    BUSINESS_UNIT = 'BUSINESS_UNIT',
    LOCATION = 'LOCATION',
}

export interface JobProperty {
    id: string;
    code: string;
    name: string;
    isMultiSelected: boolean;
    isRequired: boolean;
    props: UsedJobPropertyValue[];
}
export interface UsedJobPropertyValue {
    id: string;
    name: string;
}
export interface JobProp extends JobPropPermissions {
    id: string;
    name: string;
    value: string;
    canView: boolean;
    canEdit: boolean;
    props: Prop[];
    displayJobProperty: boolean;
    required: boolean;
}

export enum PropValues {
    YES = 'Yes',
    NO = 'No',
}

interface JEScore {
    jeScoreType: string;
    id: number;
    options: JEScoreOption[];
}

interface JEScoreOption {
    id: number;
    type: string;
    code: string;
}

export interface Job extends JobBase {
    jobProperties: JobProperty[];
}

export interface JobBase {
    jobID: string;
    jobTitle: string;
    jobCode: string;
    hideInPM: string;
    jobStatus: JobStatus;
    totalPoints: string;
    hiddenInProfileManager: string;
    function: string;
    subFunction: string;
    valueStreamName: string;
    roleTypeName: string;
    khPracticalTechnicalKnowledge: string;
    khManagerialKnowledge: string;
    khCommunicationInfluencingSkill: string;
    khPoints: string;
    khRationales: string;
    psFreedomThink: string;
    psThinkingChallenge: string;
    psPercentage: string;
    psPoints: string;
    psRationales: string;
    acFreedomAct: string;
    acAreaImpact: string;
    acNatureImpact: string;
    acPoints: string;
    acRationales: string;
    wcPhysicalEffort: string;
    wcPhysicalEnvironment: string;
    wcSensoryAttention: string;
    wcMentalStress: string;
    wcPoints: string;
    wcRationale: string;
    kfHayPoints: string;
    gradeSetId: string;
    gradeSet: string;
    grade: string;
    shortProfile: string;
    benchmarkIndicator?: string;
    isGradeOverriddenByJE?: string;
    createdDate: string;
    createdBy: string;
    lastUpdateDate: string;
    lastUpdatedBy: string;
}

export enum JobStatus {
    DRAFT = 'Draft',
    ACTIVE = 'Active',
    DRAFT_KF = 'Draft (Korn Ferry)',
    INACTIVE = 'Inactive',
}

export enum KfaJobsColumNames {
    jobId = 'Job ID',
    jobTitle = 'Job Title',
    jobCode = 'Job Code',
    function = 'Function',
    subFunction = 'Sub-Function',
    valueStreamName = 'Value Streams',
    overallRationale = 'Overall Rationale',
    roleTypeName = 'Role Types',
    totalPoints = 'Total Points',
    gradeSet = 'Grade Set',
    grade = 'Grade',
    isGradeOverriddenByJE = 'Grade Override',
    shortProfile = 'Short Profile',
    benchmarkIndicator = 'Benchmark Indicator',
    hiddenInProfileManager = 'Hidden in Profile Manager',
    manager = 'Manager',
    createdDate = 'Created Date (mm/dd/yyyy)',
    createdBy = 'Created By',
    lastUpdateDate = 'Last Update Date (mm/dd/yyyy)',
    lastUpdatedBy = 'Last Updated By',
}

export enum KfaJobsColumKeys {
    id = 'jobId',
    title = 'jobTitle',
    jobCode = 'jobCode',
    familyName = 'function',
    subFamilyName = 'subFunction',
    valueStreamName = 'valueStreamName',
    overallRationale = 'overallRationale',
    roleTypeName = 'roleTypeName',
    totalPoints = 'totalPoints',
    gradeSet = 'gradeSet',
    grade = 'grade',
    isGradeOverriddenByJE = 'isGradeOverriddenByJE',
    shortProfile = 'shortProfile',
    benchmarkIndicator = 'benchmarkIndicator',
    hideInPM = 'hiddenInProfileManager',
    manager = 'Manager',
    createdDate = 'createdDate',
    createdBy = 'createdBy',
    lastUpdateDate = 'lastUpdateDate',
    lastUpdatedBy = 'lastUpdatedBy',
}

export interface KfaGrade {
    standardHayGrade: string;
    customGrades: {
        gradeSetId: number;
        gradeSetName: string;
        grades: { gradeLabel: 'string' }[];
    };
}

export interface KfaSource {
    type: string;
    firstName: string;
    lastName: string;
    effectiveDateTime: string;
}

export interface KfaJEScore {
    id: number;
    jeScoreType: string;
    rationaleDescription: string;
    points?: string;
    options: {
        id: number;
        code: string;
        type: string;
    }[];
}

export interface KfaMatrixLabel {
    managementId: number;
    managementName: string;
    levelId: number;
    levelName: string;
    levelOrder: string;
}

export interface JobForKFATemplate {
    id: number;
    title: string;
    jobCode: string;
    hideInPM: number;
    familyName: string;
    subFamilyName: string;
    valueStreamName: string;
    roleTypeName: string;
    wcTotalPoints: number;
    totalPoints: number;
    grade: KfaGrade;
    isGradeOverriddenByJE: boolean;
    benchmarkIndicator: number;
    source: KfaSource[];
    jeScores: KfaJEScore[];
    shortProfile: {
        value: string;
    };
    status: JobStatus;
    matrixLevelsLabels?: KfaMatrixLabel;
    overallRationale: string;
    JobID: number;
    JobProperties: JobProperty[];
}

export enum JEScoreTypes {
    KNOW_HOW = 'KNOW_HOW',
    PROBLEM_SOLVING = 'PROBLEM_SOLVING',
    ACCOUNTABILITY = 'ACCOUNTABILITY',
    WORKING_CONDITIONS = 'WORKING_CONDITIONS',
    CREATED_BY = 'CREATED_BY',
    LAST_MODIFIED_BY = 'LAST_MODIFIED_BY',
}

export enum JEScoreNames {
    KNOW_HOW = 'knowHow',
    PROBLEM_SOLVING = 'problemSolving',
    ACCOUNTABILITY = 'accountability',
    WORKING_CONDITIONS = 'workingConditions',
}

export const JEScoresColumnNames = {
    KNOW_HOW: {
        name: 'Know How',
        practicalTechnicalKnowledge: 'Practical Technical Knowledge',
        planningOrganisingIntegrating: 'Planning, Organising & Integrating',
        communicationInfluencing: 'Communication & Influencing',
        khPointsTotal: 'KH Points Total',
        knowHowRationale: 'Know How Rationale',
    },
    PROBLEM_SOLVING: {
        name: 'Problem Solving',
        thinkingEnvironment: 'Thinking Environment',
        thinkingChallenge: 'Thinking Challenge',
        ps: 'PS%',
        psPointsTotal: 'PS Points Total',
        problemSolvingRationale: 'Problem Solving Rationale',
    },
    ACCOUNTABILITY: {
        name: 'Accountability',
        freedomToAct: 'Freedom to Act',
        magnitudeAreaOfImpact: 'Magnitude (Area of Impact)',
        natureOfImpact: 'Nature of Impact',
        accPointsTotal: 'ACC points Total',
        accountabilityRationale: 'Accountability Rationale',
    },
    WORKING_CONDITIONS: {
        name: 'Working Conditions',
        physicalEffort: 'Physical Effort',
        physicalEnvironment: 'Physical Environment',
        sensoryAttention: 'Sensory Attention',
        mentalStress: 'Mental Stress',
        wcPointsTotal: 'WC Points Total',
        workingConditionRationale: 'Working Condition Rationale',
    },
};

export interface KfaJobsForExcel {
    columnNames: { [key: string]: string | Object };
    data: Job[];
}