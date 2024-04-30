import { TransformOptions } from 'class-transformer';
import { config, S3 } from 'aws-sdk';
import * as xlsx from 'xlsx';
import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';
import { Common, Nullable, Response } from './common.interface';
import { EntityManager, getConnection, Repository } from 'typeorm';

const configService = new KfConfigService();
const accessKeyId = configService.get('AMAZON_SECRET_KEY');
const secretAccessKey = configService.get('AMAZON_ACCESS_ID');
const URL_KFHUB_API_BASE_PROPERTY = configService.get('URL_KFHUB_API_BASE');

const jobsDataUrl = 'v1/hrms/architect/jobs?type=EXPORT_KFA_JOB_TEMPLATES';

const region = process.env.AMAZON_REGION;

config.update({
    region,
    accessKeyId,
    secretAccessKey,
});

export const getKfhubApiBaseUrl = () => {
    return configService.get(URL_KFHUB_API_BASE_PROPERTY);
};

export const s3 = new S3({ signatureVersion: 'v4', accessKeyId, secretAccessKey, region });

export const jsonToExcel = (data, errors?) => {
    const wb: xlsx.WorkBook = xlsx.utils.book_new();

    if (errors) {
        const warnings: xlsx.WorkSheet = xlsx.utils.json_to_sheet(errors);
        xlsx.utils.book_append_sheet(wb, warnings, 'Warning');
    }

    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'data');

    const result = xlsx.write(wb, {
        type: 'buffer',
    });

    return result;
};

export const toNumber = (textNumber) => parseInt(textNumber, 10);

export const options: TransformOptions = { toClassOnly: true };

export const errorGenerator = (property, constraint = 'isString') => {
    return {
        property,
        constraint,
        message: `${property} must be a string`,
    };
};

export const getKfhubApiHeaders = (authToken: string, psSessionId?) => {
    const hasSessionId = psSessionId ? { 'ps-session-id': psSessionId } : undefined;
    return {
        authToken,
        ...hasSessionId,
        'Content-Type': 'application/json',
    };
};

export const getUrlForCachedJsonRemoval = (clientId: number, ids: number[]) => {
    return configService.get('URL_KFHUB_API_BASE') + '/v1/hrms/successprofiles/json/full?clientId=' + clientId + '&ids=' + ids;
};

export const initcap = (str: string): string => {
    return str.replace(/\w+[^\w]*/g, (s) => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase());
};

export const getDecodedStandardFiltersFromQuery = (q: Common.Query.DefaultEncodedFilters): Common.Utils.DecodedStandardFilters => {
    const filterBy = decodeURIComponent(q.filterBy || '').split('|');
    const filterValues = decodeURIComponent(q.filterValues || '')
        .split('|')
        .map((values) => values.replace(/;/g, ','));

    const filtersKeysValues: Common.Utils.DecodedStandardFilters = filterBy.reduce((acc, filter, i) => ((acc[filter] = filterValues[i]), acc), {});

    return filtersKeysValues;
};

export const getStandardPagination = (pageIndex: number, pageSize: number, totalRecords: number): Common.Utils.StandardPagination => {
    return {
        pageIndex,
        pageSize,
        totalPages: totalRecords && +pageSize ? Math.ceil(totalRecords / pageSize) : 0,
        totalResultRecords: totalRecords ? +totalRecords : 0,
    };
};

export const anyToDate = (value: number | string | Date): Nullable<Date> => {
    try {
        const date = new Date(typeof value === 'string' ? Date.parse(value) : value);
        if (date && !isNaN(date.getTime())) {
            return date;
        }
    } catch (e) {
        console.log(e);
    }
    return null;
};

export const anyToDecimal = (v: any): number => parseInt(String(v), 10);

export const anyToTime = (v: any): Nullable<number> => anyToDate(v)?.getTime();

export const getJobDatasUrl = (clientId: number, lcid: string) => {
    return `${configService.get('URL_KFHUB_API_BASE')}/${jobsDataUrl}&clientId=${clientId}&lcid=${lcid}`;
};

export class MssqlUtils {
    static insertBigSet = async (valuesArr: {}[], context: Repository<any>, insertFunction = 'insert', paramsLimit = 1000 ) => {
        const rowsBatch = Math.floor(paramsLimit / Object.keys(valuesArr[0]).length);
        const cycles = Math.ceil(valuesArr.length/rowsBatch);
        for ( let i = 0; i < cycles; i++ ) {
            await context[insertFunction](valuesArr.slice(i*rowsBatch,(i+1)*rowsBatch));
        }
    }

    static getDatasetFromStream = <T = unknown>(sqlQuery: string, divider = 'ResultSet'): Promise<T> =>
    new Promise<T>(async (resolve, reject) => {
        const stream = await getConnection().createQueryRunner().stream(sqlQuery);
        const response = {} as T;
        let pointer: string;
        stream.on('data', (chunk: T) => {
            const resultSetName = chunk ? chunk[divider] : undefined;
            if (resultSetName) {
                pointer = resultSetName;
                response[pointer] = response[pointer] || [];
            } else if (pointer) {
                response[pointer].push(chunk);
            }
        });
        stream.on('end', () => resolve(response as T));
        stream.on('error', e => reject(e));
    });
    static throwErrorOnIncorrectDbResponse (dbResponse: unknown): void {
        if( Array.isArray(dbResponse) && dbResponse?.length === 1 && dbResponse[0].StatusCode === 1) {
            const errorResponse: Response = dbResponse[0];
            throw new Error(errorResponse.ExceptionCode);
        }
    }
    static async getAllPagesFromStoredProc<D>(getManager: EntityManager, storedProcQuery: string, batchSize: number): Promise<D[]> {
        try {
            let pageNumber = 1;
            let pageData: any[] = [];
            let batch: any[] = [];
            do {
                batch = await getManager.query(`
                    ${storedProcQuery},
                    @In_PageNumber = ${pageNumber},
                    @In_PageSize = ${batchSize}
                `);
                pageData = pageData.concat(batch);
                pageNumber++;
                if (!batch || !batch.length || batch.length < batchSize) {
                    break;
                }
            } while (batch?.length === batchSize);
            return pageData;
        } catch (error) {
            throw new Error(error);
        }
    }
    static addQuotesIfString<T>(value: T): string | T {
        return typeof value === 'string' ? `'${value}'` : value;
    }

}
