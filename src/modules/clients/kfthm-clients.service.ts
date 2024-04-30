import { Injectable } from '@nestjs/common';
import { KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { getManager } from 'typeorm';
import { Common } from '../../common/common.interface';

@Injectable()
export class KfThmClientsService {
    /*
        TODO :

            re-factor service logic and database query

    */

    async clientList(query: Common.Query.Pagination) {
        try {
            const pageIndex = Number(query.pageIndex) || 1;
            const pageSize = Number(query.pageSize) || 20;
            const searchString = query.searchString || '';
            const offset = pageSize * Math.max(0, pageIndex - 1);

            const inputQuery = `
            Select ClientName,  ServerLocation, SponsorCountry, SAPCLientID, PamsID, Count(1) Over() TotalCount
            from (SELECT DISTINCT C.ClientName, Case C.ServerLocationID when 1 then 'US' when 2 then 'EU' when 3 then 'APAC' else '' End ServerLocation, CC.CountryName SponsorCountry, CI.SAPCLientID, C.ClientID PamsID
                    FROM ProductOrders.dbo.ClientInfo ci
                    JOIN ProductOrders.dbo.ClientOrder co ON co.LocalClientID = ci.LocalClientId
                    JOIN ProductOrders.dbo.ClientOrderItems coi ON coi.ClientOrderID = co.ClientOrderID
                    JOIN ProductOrders.dbo.Product p ON p.MaterialCode = coi.MaterialCode
                    JOIN Activate.dbo.Client C on C.ClientID = CI.LocalClientID
                    JOIN SuccessProfile.dbo.JobDescriptionModel JDM on JDM.ClientID = C.ClientID
                    Join ProductOrders.dbo.Country CC on CC.CountryCode = CI.LocationCountryCode
                    WHERE p.productLineID in (5)
                    AND coi.ExpirationDate > GETDATE()
                    ) CJ
                Where 1=1 and (CLientName like '%${searchString}%' OR PamsID like '%${searchString}%')
                Order by ClientName
                Offset ${offset} rows fetch next ${pageSize} rows only
            `;
            const clientInfo: any = await getManager().query(inputQuery);
            const totalResultRecords = clientInfo.length ? clientInfo[0].TotalCount : 0;
            const totalPages = clientInfo.length ? Math.ceil(totalResultRecords / Math.max(pageSize, 1)) : pageIndex;

            return {
                clientInfo,
                paging: {
                    pageIndex,
                    pageSize,
                    totalPages,
                    totalResultRecords,
                },
            };
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }
}
