import { Common } from "../../common/common.interface";

export interface StatisticsExportResult {
    buffer: Buffer;
    contentType: string;
    fileName: string;
}

export interface ClientStatisticsQuery extends Common.Query.DefaultProps {
    requestClient: number;
}

export interface ServerStatisticsDataService {
    getServerStatistics(): Promise<ServerStatistics>;
}

export interface ServerStatisticsMockDataService {
    getServerMockStatistics(): Promise<ServerStatistics>;
}

export interface ClientStatisticsMockDataService {
    getClientMockStatistics(): Promise<ClientStatistics>;
}

export interface ServerStatisticsRenderer {
    contentType: string;
    render(data: ServerStatistics): Promise<Buffer>;
}

export interface ClientStatisticsDataService {
    getClientStatistics(query: ClientStatisticsQuery): Promise<ClientStatistics>;
}

export interface ClientStatisticsRenderer {
    contentType: string;
    render(data: ClientStatistics): Promise<Buffer>;
}

export interface ServerStatistics {
    CLIENTINFORMATION: ServerStatisticsClientRawData[];
    GENERALINFORMATION: ServerStatisticsGeneralRawData[];
}

// export interface ClientStatistics {
//     OVERVIEW: ClientStatisticsOverView;
//     USAGESHEET: ClientStatisticsUsageReport;
// }
export interface ClientStatistics {
    GENERAL_INFORMATION: ClientStatisticsGeneralRawData[];
    SUBSCRIPTION_INFORMATION: ClientStatisticsSubscriptionRawData[];
    USER_DETAILS: ClientStatisticsUserRawData[];
    PM_KFA_VIEWS: ClientStatisticsPMKFAviewLogRawData[];
    PM_KFA_12_MONTHS_VIEW_DOWNLOADS: ClientStatisticsPMKFASubscriptionRawData[];
    SP_12_MONTHS_VIEW_DOWNLOADS: ClientStatisticsSpsSubscriptionRawData[];
    IG_12_MONTHS_VIEW_DOWNLOADS: ClientStatisticsIGSubscriptionRawData[];
}
export interface ClientStatisticsGeneralRawData {
    ClientName: string;
    SAPClientID: number;
    ClientID: number;
    ServerLocation: string;
    StartDate: string;
    Expirationdate: string;
    TotalUsers: number;
    CustomSPCount: number;
    CustomResp: number;
    CustomComp: number;
    CustomSkills: number;
    HasJobProperties: string;
    HasCustomGrades: string;
    TotalActiveClients: number;
    EditedResps: number;
    EditedComps: number;
    EditedSkills: number;
    NoOfSPDownloads: number;
    NoOfJDDownloads: number;
    NoOfKFAJobDownloads: number;
    NoOfPMMatrixPageDownloads: number;
    NoOfKFAMatrixPageDownloads: number;
    NoOfKFAListPageDownloads: number;
    NoOfIGDownloads: number;
    NoOfKFAArchiveJobs: number;
}
export interface ClientStatisticsSubscriptionRawData {
    EngagementNumber: string;
    MaterialCode: string;
    ProductName: string;
    StartDate: string;
    ExpirationDate: string;
}
export interface ClientStatisticsUserRawData {
    Email: string;
    FirstName: string;
    LastName: string;
    UserRole: string;
    PrimaryTeam: string;
    NofOfLogins: number;
    LastLoggeddate: string;
}
export interface ClientStatisticsPMKFAviewLogRawData {
    Email: string;
    PMViewLog: number;
    PMDownloadLog: number;
    KFAViewLog: number;
    KFADownloadLog: number;
}
export interface ClientStatisticsPMKFASubscriptionRawData {
    MonthDate: string;
    PMViewLog: number;
    PMDownloadLog: number;
    KFAViewLog: number;
    KFADownloadLog: number;
}
export interface ClientStatisticsSpsSubscriptionRawData {
    MonthDate: string;
    CustomSPCreatedCount: number;
    CustomSPModifiedCount: number;
}
export interface ClientStatisticsIGSubscriptionRawData {
    MonthDate: string;
    CustomIGDownloads: number;
}
export interface ServerStatisticsClientRawData {
    EngagementNumber: string;
    PALMSID: number;
    ClientName: string;
    Country: string;
    HavePMAccess: number;
    HaveKFAAccess: number;
    StartDate: string;
    ExpirationDate: string;
    TotalPMUsers: number;
    TotalKFAUsers: number;
    LastLoggeddate: string;
    CustomSPCount: number;
    CustomJDCount: number;
    CustomKFACount: number;
    MaxCreatedOn: string;
    MaxModifiedOn: string;
    NoOfSPDownloads: number;
    NoOfJDDownloads: number;
    NoOfKFAJobDownloads: number;
    NoOfIGDownloads: number;
    NoOfPMMatrixPageDownloads: number;
    NoOfKFAMatrixPageDownloads: number;
    NoOfKFAListPageDownloads: number;
    NoOfKFAArchiveJobs: number;
}

export interface ServerStatisticsGeneralRawData {
    ServerLocation: string;
    TotalClients: number;
    TotalActiveClients: number;
    TotalClientusers: number;
    TotalActiveClientUsers: number;
    SubsEnding3Months: number;
    SubsEnding6Months: number;
    ReportDate: string;
}
export interface CustomObject {
    name: string;
    totalsRowFunction: string;
}
