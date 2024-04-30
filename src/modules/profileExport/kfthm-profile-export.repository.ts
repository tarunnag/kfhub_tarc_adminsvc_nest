import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { KfThmProfileExportEntity } from './kfthm-profie-export.entity';
import { KfApiErrorHandler, KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { Repository, EntityRepository, getManager } from 'typeorm';
import { BATCH_SIZE, LIGHTWEIGHT_ENTRIES_BATCH_SIZE } from './kfthm-profile-export.const';
import { KfThmProfileExportSaveRequest } from './kfthm-profile-export.interface';
@EntityRepository(KfThmProfileExportEntity)
export class KfThmProfileExportRepository extends Repository<KfThmProfileExportEntity> {
    // Create client export failed
    @KfApiErrorHandler(ec.CREATE_CLIENT_EXPORT_FAILED)
    async createClientExport(data: KfThmProfileExportSaveRequest) {
        try {
            return await this.save(data);
        } catch (error) {
            throw new KfDbException(error);
        }
    }
    @KfApiErrorHandler(ec.PROFILE_EXPORT_BY_CLIENT_ID_AND_LCID_FAILED)
    async getCustomSuccessProfiles(clientId: number, lcid: string): Promise<any[] | never> {
        try {
            let pageNumber = 1;
            let successProfiles: any[] = [];
            let batch: any[] = [];
            while (true) {
                batch = await getManager().query(`
                GenerateCustomSPExportSuccessProfiles
                    @In_ClientID =${clientId},
                    @In_LCID ='${lcid}',
                    @In_PageNumber = ${pageNumber},
                    @In_PageSize = ${BATCH_SIZE + 1}
            `);
                successProfiles = successProfiles.concat(batch);
                pageNumber++;
                if (!batch || !batch.length) {
                    break;
                }
            }
            return successProfiles;
        } catch (error) {
            throw new KfDbException(error);
        }
    }
    @KfApiErrorHandler(ec.PROFILE_EXPORT_BY_CLIENT_ID_AND_LCID_FAILED)
    async getResponsibilities(clientId: number, lcid: string): Promise<any[] | never> {
        try {
            let pageNumber = 1;
            let responsibilities: any[] = [];
            let batch: any[] = [];
            while (true) {
                batch = await getManager().query(`
            GenerateCustomSPExportResponsibilities
                  @In_ClientID =${clientId},
                  @In_LCID ='${lcid}',
                  @In_PageNumber = ${pageNumber},
                  @In_PageSize = ${BATCH_SIZE + 1}
                  `);
                responsibilities = responsibilities.concat(batch);
                pageNumber++;
                if (!batch || !batch.length) {
                    break;
                }
            }
            return responsibilities;
        } catch (error) {
            throw new KfDbException(error);
        }
    }
    @KfApiErrorHandler(ec.PROFILE_EXPORT_BY_CLIENT_ID_AND_LCID_FAILED)
    async getBehavioralSkills(clientId: number, lcid: string): Promise<any[] | never> {
        try {
            let pageNumber = 1;
            let behavioralSkills: any[] = [];
            let batch: any[] = [];
            while (true) {
                batch = await getManager().query(`
            GenerateCustomSPExportBehavioralSkills
                    @In_ClientID =${clientId},
                    @In_LCID ='${lcid}',
                    @In_PageNumber = ${pageNumber},
                    @In_PageSize = ${BATCH_SIZE + 1}
            `);
                behavioralSkills = behavioralSkills.concat(batch);
                pageNumber++;
                if (!batch || !batch.length) {
                    break;
                }
            }
            return behavioralSkills;
        } catch (error) {
            throw new KfDbException(error);
        }
    }
    @KfApiErrorHandler(ec.PROFILE_EXPORT_BY_CLIENT_ID_AND_LCID_FAILED)
    async getTechnicalCompetencies(clientId: number, lcid: string): Promise<any[] | never> {
        try {
            let pageNumber = 1;
            let technicalCompetencies: any[] = [];
            let batch: any[] = [];
            while (true) {
                batch = await getManager().query(`
                GenerateCustomSPExportTechnicalCompetencies
                        @In_ClientID =${clientId},
                        @In_LCID ='${lcid}',
                        @In_PageNumber = ${pageNumber},
                        @In_PageSize = ${BATCH_SIZE + 1}
                `);
                technicalCompetencies = technicalCompetencies.concat(batch);
                pageNumber++;
                if (!batch || !batch.length) {
                    break;
                }
            }
            return technicalCompetencies;
        } catch (error) {
            throw new KfDbException(error);
        }
    }
    @KfApiErrorHandler(ec.PROFILE_EXPORT_BY_CLIENT_ID_AND_LCID_FAILED)
    async getEducation(clientId: number, lcid: string): Promise<any[] | never> {
        try {
            let pageNumber = 1;
            let education: any[] = [];
            let batch: any[] = [];
            while (true) {
                batch = await getManager().query(`
            GenerateCustomSPExportEducation
                    @In_ClientID =${clientId},
                    @In_LCID ='${lcid}',
                    @In_PageNumber = ${pageNumber},
                    @In_PageSize = ${LIGHTWEIGHT_ENTRIES_BATCH_SIZE + 1}
            `);
                education = education.concat(batch);
                pageNumber++;
                if (!batch || !batch.length) {
                    break;
                }
            }
            return education;
        } catch (error) {
            throw new KfDbException(error);
        }
    }
    @KfApiErrorHandler(ec.PROFILE_EXPORT_BY_CLIENT_ID_AND_LCID_FAILED)
    async getGeneralExps(clientId: number, lcid: string): Promise<any[] | never> {
        try {
            let pageNumber = 1;
            let generalExp: any[] = [];
            let batch: any[] = [];
            while (true) {
                batch = await getManager().query(`
                GenerateCustomSPExportGeneralExp
                    @In_ClientID =${clientId},
                    @In_LCID ='${lcid}',
                    @In_PageNumber = ${pageNumber},
                    @In_PageSize = ${LIGHTWEIGHT_ENTRIES_BATCH_SIZE + 1}
            `);
                generalExp = generalExp.concat(batch);
                pageNumber++;
                if (!batch || !batch.length) {
                    break;
                }
            }
            return generalExp;
        } catch (error) {
            throw new KfDbException(error);
        }
    }
    @KfApiErrorHandler(ec.PROFILE_EXPORT_BY_CLIENT_ID_AND_LCID_FAILED)
    async getManagerialExps(clientId: number, lcid: string): Promise<any[] | never> {
        try {
            let pageNumber = 1;
            let managerialExps: any[] = [];
            let batch: any[] = [];
            while (true) {
                batch = await getManager().query(`
            GenerateCustomSPExportManagerialExp
                    @In_ClientID =${clientId},
                    @In_LCID ='${lcid}',
                    @In_PageNumber = ${pageNumber},
                    @In_PageSize = ${LIGHTWEIGHT_ENTRIES_BATCH_SIZE + 1}
            `);
                managerialExps = managerialExps.concat(batch);
                pageNumber++;
                if (!batch || !batch.length) {
                    break;
                }
            }
            return managerialExps;
        } catch (error) {
            throw new KfDbException(error);
        }
    }
    @KfApiErrorHandler(ec.PROFILE_EXPORT_BY_CLIENT_ID_AND_LCID_FAILED)
    async getTraits(clientId: number, lcid: string): Promise<any[] | never> {
        try {
            let pageNumber = 1;
            let traits: any[] = [];
            let batch: any[] = [];
            while (true) {
                batch = await getManager().query(`
                GenerateCustomSPExportTraits
                    @In_ClientID =${clientId},
                    @In_LCID ='${lcid}',
                    @In_PageNumber = ${pageNumber},
                    @In_PageSize = ${BATCH_SIZE + 1}
            `);
                traits = traits.concat(batch);
                pageNumber++;
                if (!batch || !batch.length) {
                    break;
                }
            }
            return traits;
        } catch (error) {
            throw new KfDbException(error);
        }
    }
    @KfApiErrorHandler(ec.PROFILE_EXPORT_BY_CLIENT_ID_AND_LCID_FAILED)
    async getDrivers(clientId: number, lcid: string): Promise<any[] | never> {
        try {
            let pageNumber = 1;
            let drivers: any[] = [];
            let batch: any[] = [];
            while (true) {
                batch = await getManager().query(`
                GenerateCustomSPExportDrivers
                    @In_ClientID =${clientId},
                    @In_LCID ='${lcid}',
                    @In_PageNumber = ${pageNumber},
                    @In_PageSize = ${BATCH_SIZE + 1}
            `);
                drivers = drivers.concat(batch);
                pageNumber++;
                if (!batch || !batch.length) {
                    break;
                }
            }
            return drivers;
        } catch (error) {
            throw new KfDbException(error);
        }
    }
    @KfApiErrorHandler(ec.PROFILE_EXPORT_BY_CLIENT_ID_AND_LCID_FAILED)
    async getTasks(clientId: number, lcid: string): Promise<any[] | never> {
        try {
            let pageNumber = 1;
            let tasks: any[] = [];
            let batch: any[] = [];
            while (true) {
                batch = await getManager().query(`
                GenerateCustomSPExportTasks
                    @ClientID =${clientId},
                    @LCID ='${lcid}',
                    @In_PageNumber = ${pageNumber},
                    @In_PageSize = ${LIGHTWEIGHT_ENTRIES_BATCH_SIZE + 1}
            `);
                tasks = tasks.concat(batch);
                pageNumber++;
                if (!batch || !batch.length) {
                    break;
                }
            }
            return tasks;
        } catch (error) {
            throw new KfDbException(error);
        }
    }
    @KfApiErrorHandler(ec.PROFILE_EXPORT_BY_CLIENT_ID_AND_LCID_FAILED)
    async getTools(clientId: number, lcid: string): Promise<any[] | never> {
        try {
            let pageNumber = 1;
            let tools: any[] = [];
            let batch: any[] = [];
            while (true) {
                batch = await getManager().query(`
                GenerateCustomSPExportTools
                    @ClientID =${clientId},
                    @LCID ='${lcid}',
                    @In_PageNumber = ${pageNumber},
                    @In_PageSize = ${LIGHTWEIGHT_ENTRIES_BATCH_SIZE + 1}
            `);
                tools = tools.concat(batch);
                pageNumber++;
                if (!batch || !batch.length) {
                    break;
                }
            }
            return tools;
        } catch (error) {
            throw new KfDbException(error);
        }
    }
}
