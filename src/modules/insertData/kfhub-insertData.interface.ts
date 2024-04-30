import { IsString } from 'class-validator';
import { Common } from '../../common/common.interface';

export class InsertDataPost extends Common.Query.FileUuid {
    @IsString()
    fileKey: string;
}

export class ParseJsonDataContract {
    country_id: number;
    company_id: number;
    pams_id: number;
    company_orgcode: string;
    company_name: string;
    client_job_code: string;
    client_family: string;
    reference_level: number;
    job_code: string;
    hide_in_profilemanager: number;
    family_code: string;
    subfamily_code: string;
    client_job_title: string;
    job_summary: string;
    AssociatedSuccessProfile: string;
    BIC_Profile_JRTDetailID: string;
    architect_job_flag: string;
    architect_job_code: string;
    Benchmark_Job: string; // 0 or 1
    profileRecordId?: number; // Added while creating chunks
    custom_profile_id: string;
    language: string;
}
