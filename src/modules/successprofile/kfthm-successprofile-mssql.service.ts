import { getManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { KfApiErrorHandler } from '@kf-products-core/kfhub_svc_lib';
import { ProfilesRaw, MetadataLanguagesRaw, MetadataFiltersRaw as MetadataRaw } from './kfthm-successprofile.service.i';

@Injectable()
export class SpMssqlService {
    @KfApiErrorHandler('Error in getThPortalProfiles')
    async getThPortalProfiles(clientId: number, locale: string, pageIndex: number, pageSize: number, searchString: string,
        sortBy: string, sortColumn: string, grade: string, level: string, functions: string, profileType: string): Promise<ProfilesRaw[]> {
                const sqlQuery= `exec SuccessProfile.dbo.GETTHPortalProfiles
                        @In_ClientID = ${clientId},
                        @In_Locale = '${locale}',
                        @In_sortColumn = '${sortColumn}',
                        @In_sortBy = '${sortBy}',
                        @In_SearchString = N'${searchString}',
                        @In_ProfileType = '${profileType}',
                        @In_Family = '${functions}',
                        @In_Level = '${level}',
                        @In_Grade = '${grade}',
                        @In_pageIndex = ${pageIndex},
                        @In_pageSize = ${pageSize}`;
                return await getManager().query(sqlQuery);
    }

    @KfApiErrorHandler('Error in getThPortalMetadataLanguages')
    async getClientPreferedLanguage(clientId: number): Promise<MetadataLanguagesRaw[]> {
        const sqlQuery= `Select DISTINCT LL.LCID as LCID, LL.SystemName as LanguageName
            from ClientJob CJ Inner Join Person PP on CJ.JobSourceID = PP.PersonID and PP.ClientID = ${clientId}
                Inner join Activate.dbo.Language LL on LL.LCID = CJ.LCID
            where CJ.ClientJobStatusID <> 4 Order by LL.SystemName`;
        return await getManager().query(sqlQuery);
    }

    @KfApiErrorHandler('Error in getThPortalMetadata')
    async getThPortalMetadata(clientId: number): Promise<MetadataRaw[]> {
        const sqlQuery= `exec SuccessProfile.dbo.GETTHPortalMetadata @ClientID=${clientId}`;
        return await getManager().query(sqlQuery);
    }
}