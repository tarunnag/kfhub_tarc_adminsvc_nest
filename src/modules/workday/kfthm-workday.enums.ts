export namespace KfThmWorkdayEnums {
    export enum DownloadStatus {
        PROCESS_STARTED = 1,
        ASSEMBLING_DATA = 2,
        GENERATING_XLSX = 3,
        SAVING_S3 = 4,
        SUCCESS = 5,
        UNKNOWN_ERROR = 10,
        ASSEMBLING_DATA_ERROR = 11,
        XLSX_ERROR = 12,
        S3_ERROR = 13,
    }

    export enum UploadStatus {
        AWAITNG_UPLOAD = 1,
        PARSING_STARTED = 2,
        VALIDATION_STARTED = 3,
        JSON_GENERATION_STARTED = 4,
        JSON_READY = 5,
        SUCCESS = 6,
        UNKNOWN_ERROR = 10,
        PARSING_ERROR = 11,
        VALIDATION_ERROR = 12,
        JSON_GENERATION_ERROR = 13,
        DB_STAGING_TABLE_ERROR = 14,
    }

    export enum TaskType {
        UPLOAD = 1,
        DOWNLOAD = 2,
    }
}
