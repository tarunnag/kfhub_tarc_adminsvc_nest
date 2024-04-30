export enum JobTaskExportStatus {
    START_EXPORT = 0,
    GOT_ALL_JOBS = 1,
    GOT_CUSTOM_GRADE_SETS = 2,
    GOT_JOB_PROPERTIES = 3,
    CREATED_EXCEL = 4,
    SUCCESS = 5,
}

// I saw that this field is used in other servies like Workday.
// Probably, it should been shared across all of them
export enum AwsS3Config {
    ACL = 'private',
}
