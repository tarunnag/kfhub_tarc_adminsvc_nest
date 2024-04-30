import { Injectable } from '@nestjs/common';
import { getManager, getConnection } from 'typeorm';
import { ExistingJobCode, ClientJobsInfo } from './kfarch-job.interface';
import { ClientJobsInfoDB as CJI } from './kfarch_clientjob-db.enum';
import { KfDbException } from '@kf-products-core/kfhub_svc_lib';

interface ExistingJobTitle {
    title: string;
}

@Injectable()
export class KfArchClientJobDBService {
    async checkExistingJobTitlesForClient(clientId: number, taskUuid: string): Promise<ExistingJobTitle[]> {
        const [selectQuery, queryParams] = getConnection().driver.escapeQueryWithParameters(
            `SELECT DISTINCT(cj.JobName) AS title
            FROM [SuccessProfile].[dbo].[ClientJob] cj
            INNER JOIN [Activate].[dbo].[Person] p
            ON cj.JobSourceID = p.PersonID AND p.ClientID = :clientId
            INNER JOIN [SuccessProfile].[dbo].[StgClientJobTitlesValidation] stg
            ON cj.JobName = stg.JobName AND stg.TaskGUID = :taskUuid
            WHERE cj.ClientJobStatusID NOT IN (4,8)
            AND cj.ArchitectJobFlag = 1 and stg.ArchitectJobFlag = 1`,
            {
                clientId,
                taskUuid,
            },
            {},
        );

        return await getManager().query(selectQuery, queryParams);
    }

    async selectExistingClientJobCodes(clientId: number, jobCodes: string[]): Promise<ExistingJobCode[]> {
        const [selectQuery, queryParams] = getConnection().driver.escapeQueryWithParameters(
            `SELECT DISTINCT(cj.JobCode) AS jobCode
            FROM [SuccessProfile].[dbo].[ClientJob] cj
            INNER JOIN [Activate].[dbo].[Person] p
            ON cj.JobSourceID = p.PersonID AND p.ClientID = :clientId
            WHERE cj.JobCode IN (:...jobCodes) AND cj.clientjobstatusid NOT IN (4)`,
            {
                clientId,
                jobCodes,
            },
            {},
        );

        return await getManager().query(selectQuery, queryParams);
    }

    async selectClientJobsMainInfo(clientId: number, locale: string): Promise<ClientJobsInfo[]> {
        const dbData = await getManager().query(`
        GenerateCustomSPExportSuccessProfiles
                @In_ClientID =${clientId},
                @In_LCID ='${locale}',
                @In_PageNumber = ${null},
                @In_PageSize = ${null}
                `);
        return this.mapClientJobsMainInfo(dbData);
    }

    async selectIsClientWorkingConditionsEnabled(clientId: number): Promise<boolean> {
        try {
            const dbData = await getManager().query(`
            Select Enabled From ProductAdmin.dbo.view_ClientPreferenceParsed
                Where ClientID=${clientId} and SettingType='WORKING_CONDITIONS_JOB_DIMENSIONS' and CountryID=0`);
            return !!dbData[0]?.Enabled;
        } catch (e) {
            throw new KfDbException('Error in selectIsClientWorkingConditionsEnabled ' + e.message);
        }
    }

    private mapClientJobsMainInfo(dbResp: any): ClientJobsInfo[] {
        return dbResp.map((job) => ({
            jobID: job[CJI.jobId],
            successProfileOrJobDescription: job[CJI.successProfileOrJobDescription],
            jRTDetailID: job[CJI.jrtDetailId],
            jobName: job[CJI.jobName],
            description: job[CJI.description],
            jobFamilyID: job[CJI.jobFamilyId],
            jobFamilyName: job[CJI.jobFamilyName],
            jobSubFamilyID: job[CJI.jobSubFamilyId],
            jobSubFamilyName: job[CJI.jobSubFamilyName],
            referenceLevel: job[CJI.referenceLevel],
            levelName: job[CJI.levelName],
            subLevelName: job[CJI.subLevelName],
            createdOn: job[CJI.createdOn],
            createdBy: job[CJI.createdBy],
            modifiedOn: job[CJI.modifiedOn],
            modifiedBy: job[CJI.modifiedBy],
            shortProfile: job[CJI.shortProfile],
            bICProfileName: job[CJI.bicProfileName],
        }));
    }
}
