import { KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { Injectable } from '@nestjs/common';
import { Common } from '../../common/common.interface';
import { Logger } from '@nestjs/common';
import { KfThmSocketsService } from '../../socket/kfthm-socket.service';
import { KfThmStatusRepository } from '../status/status.repository';
import { jsonToExcel, s3 } from './../../common/common.utils';
import { ExcelPathParams, GetUploadStatus, Mappings, MappingStatus, MAPPING_FAILED, ExcelColumnHeaders, DBResponseProfileUpload } from './kfhub-uploadStatus.interface';
import { KfThmUploadStatusRepository } from './kfhub-uploadStatus.repository';
import { KfThmStatusEntity } from '../status/status.entity';
const { BucketDetails, BUCKET } = Common.Enum;

@Injectable()
export class KfThmUploadStatusService {
    logger: Logger = new Logger('KfThmUploadStatusService');
    constructor(private repo: KfThmUploadStatusRepository, private socket: KfThmSocketsService, private status: KfThmStatusRepository) {}

    async getStatus(query: GetUploadStatus): Promise<KfThmStatusEntity> {
        try {
            return await this.status.getMetadata(query.fileUUID);
        } catch (error) {
            throw new KfDbException(error.message);
        }
    }

    async createStatus(body: Common.Query.UpsertUploadStatus): Promise<{
        fileUUID: string;
    }> {
        try {
            this.socket.emitToClient(body);
            const uploadStatus = await this.processProfileMappingsAndReturnUploadStatus(body);
            await this.status.updateStatus(body.fileUUID, uploadStatus);

            return {
                fileUUID: body.fileUUID,
            };
        } catch (error) {
            throw new KfDbException(error.message);
        }
    }

    async processProfileMappingsAndReturnUploadStatus(body: Common.Query.UpsertUploadStatus): Promise<number> {
        let uploadStatus = body.processStatus;
        let excelData = null;
        let path = null;

        if (body.processStatus === 3) {
            const allMappings = await this.repo.getMapping(body.fileUUID);
            this.logger.log(allMappings, 'gotMapping');
            const { mapped, unmapped, errors } = this.processMappings(allMappings);

            // const metadata = await this.getStatus({ ...body });
            // const clientId = metadata.ClientId ? metadata.ClientId + '/' : '';
            const clientId = allMappings[0] ? allMappings[0].pams_id + '/' : '';
            ({
                statusToUpdate: uploadStatus,
                excelData,
                path,
            } = this.prepareStatusAndResponseExcel(
                { fileUUID: body.fileUUID, clientId },
                { mappedEntities: mapped, unmappedEntities: unmapped, allMappings, errors },
            ));
            this.logger.log(path, 'path');
            await s3
                .upload({
                    Bucket: BUCKET,
                    Key: path,
                    Body: excelData,
                })
                .promise();
        }
        return uploadStatus;
    }

    processMappings(allMappings: any[]): { mapped: any[]; unmapped: any[]; errors: any[] } {
        const mapped = [];
        const unmapped = [];
        const errors = [];
        allMappings.map((successProfile: any, index: number) => {
            if (successProfile.AssociatedSuccessProfile === null) {
                errors.push({
                    job_code: successProfile.job_code,
                    row: index + 2,
                    message: MAPPING_FAILED,
                });
                return unmapped.push(successProfile);
            }
            mapped.push(successProfile);
        });
        return { mapped, unmapped, errors };
    }

    constructPath(folder: string, fileUUID: string, clientId?: string): string {
        return `${BucketDetails.THM}/${clientId}${fileUUID}/${folder}/${Date.now()}${BucketDetails.MAPPED_STATS_XLSX}`;
    }

    prepareStatusAndResponseExcel(params: ExcelPathParams, mappings: Mappings): { statusToUpdate: number; excelData: any; path: string } {
        let statusToUpdate;
        let excelData;
        let path;
        if (mappings.unmappedEntities.length === 0) {
            statusToUpdate = MappingStatus.SUCCESS;
            excelData = jsonToExcel(this.getDataForExcel(mappings.mappedEntities));
            path = this.constructPath(BucketDetails.FILE_MAPPED_SUCCESS, params.fileUUID, params.clientId);
        } else {
            statusToUpdate = MappingStatus.FAILED;
            excelData = jsonToExcel(mappings.allMappings, mappings.errors);
            path = this.constructPath(BucketDetails.FILE_MAPPED_FAILED, params.fileUUID, params.clientId);
        }
        return { statusToUpdate, excelData, path };
    }

    getDataForExcel(mappings: DBResponseProfileUpload[]): ExcelColumnHeaders[] {
        const excelData: ExcelColumnHeaders[] = [];
        mappings.forEach(ele => {
            excelData.push({
                pams_id: ele.pams_id || '',
                company_name: ele.company_name || '',
                reference_level: ele.reference_level || '',
                job_code: ele.job_code || '',
                family_code: ele.family_code || '',
                subfamily_code: ele.subfamily_code || '',
                client_job_title: ele.client_job_title || '',
                job_summary: ele.job_summary || '',
                BICProfileJRTDetailID: ele.BICProfileJRTDetailID || '',
                architect_job_flag: ele.ArchitectJobFlag || '',
                architect_job_code: ele.ArchitectJobCode || '',
                Benchmark_Job: ele.Benchmark_Job || '',
                custom_profile_id: ele.custom_profile_id || '',
                hide_in_profilemanager: ele.hide_in_profilemanager || '',
                language: ele.language || ''
            })
        })
        return excelData;
    }

}
