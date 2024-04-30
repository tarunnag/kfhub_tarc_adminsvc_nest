import { IsString, IsBooleanString, IsNumberString, IsOptional } from 'class-validator';
import { Common } from '../../common/common.interface';
export namespace KfThmSignUrlInterface {
    export namespace Components {
        export class FileName {
            @IsString()
            fileName: string;
        }
        export class TransactionId {
            @IsString()
            transactionId: string;
        }
    }
    export namespace Body {
        export class UploadFile extends Components.FileName {}
    }

    // commented IsString and IsNumberString
    export namespace Query {
        export class UploadFile extends Common.Query.DefaultProps {
            @IsString()
            type: string;
        }
        export class DownloadFile {
            @IsNumberString()
            status?: string = '2';

            @IsString()
            @IsOptional()
            fileUUID: string = null;

            @IsOptional()
            clientId: number;
        }

        export class UploadSignedUrl extends Common.Query.DefaultProps {
            @IsNumberString()
            uploadClientId: number;
        }
    }

    export namespace Response {
        export interface UploadSignedUrl {
            url: string;
            uuid: string;
        }
    }

    export namespace Enum {
        export enum Extensions {
            XLS = 'xls',
            XLSX = 'xlsx',
        }

        export enum Error {
            INVALID_FILE_EXTENSION = 'Invalid file extension',
        }
        export enum SignUrl {
            PUT_OBJECT = 'putObject',
            GET_OBJECT = 'getObject',
        }
        export enum ProfilesType {
            JOB_PROFILES = 'job',
        }
    }
}
