import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { options, toNumber } from './kfthm-workday.utils';

export namespace KfThmWorkdayInterface {
    export class UpdateStatusBody {
        @IsString()
        fileUUID: string;

        @Transform(toNumber, options)
        processStatus: number;
    }

    export class PushDataBody {
        @IsString()
        fileUUID: string;

        @Transform(toNumber, options)
        ts: number;

        @Transform(toNumber, options)
        clientId: number;
    }

    export class GetStatusQuery {
        @IsString()
        fileUUID: string;
    }

    export class DownloadQuery {
        @Transform(toNumber, options)
        clientId: number;
    }

    export class UploadQuery {
        @Transform(toNumber, options)
        clientId: number;
    }

    export interface DownloadResponse {
        uuid: string;
        status: number;
    }

    export interface StatusResponse {
        uuid: string;
        status: number;
        url?: string;
    }

    export interface UploadResponse {
        uuid: string;
        url: string;
    }

    export interface PublishResponse {
        uuid: string;
        status: number;
    }

    export interface WorkdayJob {
        ClientID: number;
        ClientJobID: number;
        JobName: string;
        JobCode: string;
        JobProfileName: string;
        EffectiveDate: string;
        LastPublishedDate: string;
        ScheduleIntegration: string;
        LibraryEffectiveDate: string;
    }

    export interface UploadEntry {
        ClientID: number;
        SuccessProfileID: number;
        SuccessProfileName: string;
        JobCode: string;
        JobProfileName: string;
        EffectiveDate: string;
        LastPublishedDate: string;
        ScheduleIntegration: string;
    }
}
