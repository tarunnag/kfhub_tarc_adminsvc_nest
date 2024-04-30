import { Injectable } from '@nestjs/common';
import { getManager, getConnection } from 'typeorm';
import { KfThmWorkdayInterface as WorkdayInterfaces } from './kfthm-workday.interface';

@Injectable()
export class KfThmWorkdayStagingDBService {
    async insertPostToWorkdayStatus(createdById: number, uuid: string): Promise<number> {
        const insertStatusQuery = `
            INSERT [Workday].[dbo].[PostKFSuccessProfileToWorkdayStatus] (
            [PostKFSuccessProfileToWorkdayStatusID], [UploadStatusID], [LCID], [CreatedBy]
        ) VALUES (@0, 0, N'en', @1)`;
        const insertQueryParams = [uuid, createdById];
        await getManager().query(insertStatusQuery, insertQueryParams);

        const selectStatusQuery = `
            SELECT * FROM [Workday].[dbo].[PostKFSuccessProfileToWorkdayStatus]
            WHERE [PostKFSuccessProfileToWorkdayStatusID] = @0
            ORDER BY [CreatedOn] DESC
        `;
        const selectQueryParams = [uuid];
        const dbData = await getManager().query(selectStatusQuery, selectQueryParams);

        if (!dbData[0]) {
            throw new Error('Unable to find inserted Workday status row');
        }

        return dbData[0].PostKFSuccessProfileToWorkdayID;
    }

    async insertPostToWorkday(
        requestedByUserId: number,
        statusID: number,
        recordID: number,
        publishDate: Date,
        entry: WorkdayInterfaces.UploadEntry,
    ): Promise<void> {
        const strPublishDate = `${publishDate.getUTCFullYear()}-${publishDate.getUTCMonth() + 1}-${publishDate.getUTCDate()}`;

        const regex = /^(\d+)\/(\d+)\/(\d\d\d\d)$/;
        const matches = entry.EffectiveDate.match(regex);
        if (!matches || matches.length != 4) {
            throw Error(`Unexpected EffectiveDate value: ${entry.EffectiveDate}`);
        }
        const month = parseInt(matches[1], 10);
        const day = parseInt(matches[2], 10);
        const year = parseInt(matches[3], 10);
        const strEffectiveDate = `${year}-${month}-${day}`;

        // TODO Add ClientName when access to [Activate].[dbo].[Client] will be confirmed
        const insertQuery = `
            INSERT [Workday].[dbo].[PostKFSuccessProfileToWorkday] (
                [PostKFSuccessProfileToWorkdayID],
                [ProfileRecordID],
                [ClientID],
                [ClientName],
                [SuccessProfileID],
                [SuccessProfileName],
                [WorkDayJobCode],
                [WorkDayJobProfileName],
                [EffectiveDate],
                [RequestedBy],
                [WorkDaySyncDate]
            ) VALUES (
                @0,
                @1,
                @2,
                '',
                @3,
                @4,
                @5,
                @6,
                CAST(@7 AS Date),
                @8,
                CAST(@9 AS Date)
            );
        `;
        const queryParams = [
            statusID,
            recordID,
            entry.ClientID,
            entry.SuccessProfileID,
            entry.SuccessProfileName,
            entry.JobCode,
            entry.JobProfileName,
            strEffectiveDate,
            requestedByUserId,
            strPublishDate,
        ];
        await getManager().query(insertQuery, queryParams);
    }

    async callLoadToWorkdayStagingProc(taskUUID: string) {
        const query = 'exec [Workday].[dbo].[LoadPostKFSuccessProfileToWorkdayToStaging] @0';
        const params = [taskUUID];
        await getManager().query(query, params);
    }
}
