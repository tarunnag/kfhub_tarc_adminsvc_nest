import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { options, toNumber } from './common.utils';
import { KfExceptionCodes } from '../kfthm-exception-codes.enum';

export module Common {
    export module Query {
        export class DefaultProps {
            @Transform(toNumber, options)
            loggedInUserClientId: number;

            @Transform(toNumber, options)
            userId: number;

            @IsString()
            locale: string = 'en';

            @IsOptional()
            @Transform(toNumber, options)
            clientId: number;

            @IsOptional()
            lcid: string;
        }

        export interface DefaultPaginationFilters extends DefaultProps {
            searchString: string;
            sortColumn: string;
            sortBy: string;
            pageIndex: string;
            pageSize: string;
        }

        export interface DefaultEncodedFilters extends DefaultProps {
            filterBy: string;
            filterValues: string;
        }

        export class FileUuid {
            @IsString()
            fileUUID: string;
        }

        export class UpsertUploadStatus extends FileUuid {
            @Transform(toNumber, options)
            processStatus: number;
        }

        export class PushData {
            @IsString()
            fileUUID: string;

            @Transform(toNumber, options)
            uploadClientId: number;
        }

        export interface Pagination {
            pageIndex: number;
            pageSize: number;
            searchString: string;
        }

        export class DownloadFile {
            @IsNumberString()
            status: string = '2';

            @IsString()
            @IsOptional()
            fileUUID: string = null;

            @IsOptional()
            clientId: number;
        }

        export enum Categories {
            TRAITS = 'TRAITS',
            COMPETENCIES = 'COMPETENCIES',
            DRIVERS = 'DRIVERS',
        }
        export class TranslationProps {
            @IsString()
            categoryId: Categories;

            @IsString()
            languageId: string;

            @IsString()
            cmsLanguageId: string;
        }
    }
    export module Enum {
        export const BUCKET = process.env.AMAZON_BUCKET.toString();
        export const ARCH_BUCKET = process.env.AMAZON_BUCKET.toString();
        export const JOBS_DOWNLOAD_URL = process.env.AWS_JOBS_DOWNLOAD_URL.toString();
        export const JOBS_DOWNLOAD_API_BASE = '/current/export-job-templates';
        export const URL_KFHUB_API_BASE = process.env.URL_KFHUB_API_BASE.toString();
        export const API_VERSION = process.env.API_VERSION.toString();
        export const TOKEN_METADATA_PATH = '/v1/actions/token/metadata';
        export const SELECT_ASSESSMENT_IG_PATH = '/hrms/successprofiles/interviewguide';
        export const TRANSLATIONS_URL = process.env.TRANSLATIONS_URL.toString();

        export enum BucketDetails {
            EXPIRES = 30_000,
            THM = 'THManagement',
            KFM = 'KFManagement',
            AUTHENTICATED_READ = 'authenticated-read',

            FILE_UPLOAD = 'file_upload',
            FILE_PARSE = 'file_parse',
            FILE_VALIDATION = 'file_validation',
            FILE_EXPORT = 'file_export',
            FILE_ERROR = 'file_error',
            FILE_MAPPED_SUCCESS = 'file_mapped_success',
            FILE_MAPPED_FAILED = 'file_mapped_failed',

            UPLOAD_XLSX = '_upload.xlsx',
            PARSE_JSON = '_parse.json',
            VALIDATION_JSON = '_validation.json',
            ERROR_XLSX = '_error.xlsx',
            MAPPED_STATS_XLSX = '_mappedstats.xlsx',
            THM_GOLDEN_TEMPLATE_XLSX = 'thm_golden_template.xlsx',
            KFA_JOB_UPDATE_TEMPLATE = 'job_update_template.xlsx',
        }
    }
    export module Utils {
        export interface DecodedStandardFilters {
            [key: string]: string;
        }

        export interface StandardPagination {
            pageIndex: number;
            pageSize: number;
            totalPages: number;
            totalResultRecords: number;
        }
    }
}

export type Nullable<T> = T | null;

export enum ApplicationRoleType {
    GLOBAL = 'GLOBAL',
}
export interface ApplicationRole {
    name: string;
    description: string;
    type: ApplicationRoleType;
}
export class Response {
    StatusCode: number;
    ExceptionCode: KfExceptionCodes;
}
