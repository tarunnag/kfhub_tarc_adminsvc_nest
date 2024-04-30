import { Common } from '../../common/common.interface';
import { Transform } from 'class-transformer';
import { options, toNumber } from '../../common/common.utils';

export class GetUploadStatus extends Common.Query.FileUuid {}

export class UpsertUploadStatus extends Common.Query.FileUuid {
    @Transform(toNumber, options)
    processStatus: number;
}

export interface ExcelPathParams extends Common.Query.FileUuid {
    clientId: string;
}

export interface Mappings {
    mappedEntities?: any[];
    unmappedEntities?: any[];
    allMappings?: any[];
    errors?: any[];
}

export enum MappingStatus {
    SUCCESS = 3,
    FAILED = 4,
}

export interface ExcelColumnHeaders {
    pams_id: string;
    company_name: string;
    reference_level: string;
    job_code: string;
    family_code: string;
    subfamily_code: string;
    client_job_title: string;
    job_summary: string;
    BICProfileJRTDetailID: string;
    architect_job_flag: string;
    architect_job_code: string;
    Benchmark_Job: string;
    custom_profile_id: string;
    hide_in_profilemanager: string;
    language: string;
}

export interface DBResponseProfileUpload {
    pams_id: string;
    company_name: string;
    reference_level: string;
    job_code: string;
    family_code: string;
    subfamily_code: string;
    client_job_title: string;
    job_summary: string;
    BICProfileJRTDetailID: string;
    ArchitectJobFlag: string;
    ArchitectJobCode: string;
    Benchmark_Job: string;
    custom_profile_id: string;
    hide_in_profilemanager: string;
    language: string;
}

export const MAPPING_FAILED = 'Mapping failed for success profile';
