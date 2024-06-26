export enum KfExceptionCodes {
    GET_UPLOAD_URL_FAILED = 'APP.30451',
    GET_DOWNLOAD_URL_FAILED = 'APP.30452',
    AWS_IO_CALL_FAILED = 'APP.30453',
    GET_CLIENTS_LIST_FAILED = 'APP.30454',
    GET_UPLOAD_STATUS_FAILED = 'APP.30455',
    UPDATE_UPLOAD_STATUS_FAILED = 'APP.30456',
    INSERT_DATA_FAILED = 'APP.30457',
    PUSH_DATA_FAILED = 'APP.30458',
    GET_SUCCESS_PROFILES_FAILED = 'APP.30459',
    EXPORT_PROFILES_FAILED = 'APP.30460',
    EXPORT_STATISTICS_FAILED = 'APP.30460',
    START_JOB_TASK_EXPORT_FAILED = 'APP.30461',
    UPDATE_JOB_TASK_EXPORT_STATUS_FAILED = 'APP.30463',
    GET_JOB_TASK_EXPORT_STATUS_FAILED = 'APP.30466',
    GET_JOB_TASK_EXPORT_FAILED = 'APP.30467',
    GET_CLIENT_JOBS_MAIN_INFO_FAILED = 'APP.30468',

    CREATE_STATUS_FAILED = 'ADP.10420',
    GET_STATUS_METADATA_BY_UUID_FAILED = 'ADP.10421',
    UPDATE_STATUS_BY_UUID_FAILED = 'ADP.10422',
    INSERT_DATA_IN_BULK_FAILED = 'ADP.10423',
    CREATE_CLIENT_EXPORT_FAILED = 'ADP.10424',
    PROFILE_EXPORT_BY_CLIENT_ID_AND_LCID_FAILED = 'ADP.10425',
    CREATE_JOB_TASK_EXPORT_STATUS_BY_UUID_FAILED = 'ADP.10426',
    UPDATE_JOB_TASK_EXPORT_STATUS_BY_UUID_FAILED = 'ADP.10427',
    GET_JOB_TASK_EXPORT_BY_UUID_FAILED = 'ADP.10428',

    EXTERNAL_I_O_CALL_FAILED = 'APP.30464',
    SCHEMA_VALIDATION_EXCEPTION = 'VAL.12490',
    INTERNAL_SERVER_ERROR = 'APP.30465',
    SUCCESS = 'RES.20000',
    SYSTEM_ERROR_OCCURRED = 'SYS.10000',
    INPUT_VALIDATION_FAILED = 'VAL.12000',
    OUTPUT_VALIDATION_FAILED = 'VAL.12001',

    WORKDAY_INVALID_STATUS_ERR = 'VAL.12491',

    EXTERNAL_CALL_ERR = 'APP.30016',
    EXTERNAL_IO_CALL_ERR = 'APP.30064',
    SCHEMA_VAL_ERR = 'VAL.12200',
    INPUT_VAL_ERR = 'VAL.12000',
    OUTPUT_VAL_ERR = 'VAL.12001',
}
