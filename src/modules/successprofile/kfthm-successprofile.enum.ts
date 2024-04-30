export enum ReportType {
    IG = 'InterviewGuide',
    SP = 'successProfile',
}

export enum RequestType {
    SUCCESS_PROFILE = 'SEARCH_SUCCESS_PROFILES',
    SUCCESS_PROFILES_IDS = 'SEARCH_SUCCESS_PROFILES_IDS',
    METADATA = 'METADATA',
}

export enum SortColumn {
    JOB_TITLE = 'JOB_TITLE',
    MODIFIED_ON = 'MODIFIED_ON',
}

export enum Filters {
    GRADES = 'GRADES',
    LEVELS = 'LEVELS',
    FUNCTIONS = 'FUNCTIONS',
    LANGUAGES = 'LANGUAGES',
    PROFILE_TYPES = 'PROFILE_TYPES',
}

export enum ProfileTypes {
    DEFAULT = '1,2',
    JOB_DESCRIPTION = 1,
    CUSTOM_PROFILE = 2,
}

export enum MetadataStrangeHardcodedValuesInResponse {
    NAME = 'SEARCH_SUCCESS_PROFILES',
    VALUE = 'SEARCH_SUCCESS_PROFILES',
}
