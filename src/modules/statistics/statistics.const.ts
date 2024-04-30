export enum ContentType {
    EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export const ContentTypeExtension = {
    [ContentType.EXCEL]: 'xlsx',
};

export enum CommonTitles {
    GENERAL_INFORMATION = 'General Information',
}

export enum ServerClientTitles {
    EngagementNumber = 'Engagement number',
    PALMSID = 'PAMSID',
    ClientName = 'Client Name',
    Country = 'Country',
    HavePMAccess = 'Profile Manager',
    HaveKFAAccess = 'Architect',
    StartDate = 'Subscription Start date (dd/mm/yyyy)',
    ExpirationDate = 'Subscription Expiration date (dd/mm/yyyy)',
    TotalPMUsers = 'Count of PM Users',
    TotalKFAUsers = 'Count of KFA Users',
    LastLoggeddate = 'Date last user logged in',
    CustomSPCount = 'Custom PM SPs Created',
    CustomJDCount = 'Custom PM JDs Created',
    CustomKFACount = 'Custom KFA Jobs Created',
    MaxCreatedOn = 'Date last Profile Created: (dd/mm/yyyy))',
    MaxModifiedOn = 'Date Last Profile Edited: (dd/mm/yyyy)',
    NoOfSPDownloads = 'No. of SP pdf downloads',
    NoOfJDDownloads = 'No. of JD downloads',
    NoOfKFAJobDownloads = 'No. of KFA Job downloads',
    NoOfIGDownloads = 'No. of IG downloads',
    NoOfPMMatrixPageDownloads = 'No. of PM matrix exports',
    NoOfKFAMatrixPageDownloads = 'No. of KFA Matrix exports',
    NoOfKFAListPageDownloads = 'No. of KFA list exports',
    NoOfKFAArchiveJobs = 'No. of KFA jobs archived',
}

export enum ClientOverViewSubscriptionDetails {
    ENGAGEMENT_NUMBER = 'Engagement number',
    PRODUCT_SKU = 'Product SKU',
    PRODUCT = 'Product',
    START_DATE = 'Start date (dd/mm/yyyy)',
    END_DATE = 'Expiration date (dd/mm/yyyy)',
}

export enum ClientOverViewUserDetails {
    EMAIL = 'Email Address',
    FIRST_NAME = 'First Name',
    LAST_NAME = 'Last Name',
    USER_ROLE = 'User Role',
    PRIMARY_TEAM = 'Primary Team',
    TOTAL_LOGIN_COUNT = 'Total Login Count',
    LAST_LOGIN_DATE = 'Last Login Date (dd/mm/yyyy)',
}

export enum ClientOverviewTitles {
    ENGAGEMENT_NUMBER = 'Engagement Number',
    PRODUCT_SKU = 'Product SKU',
    PRODUCT = 'Product',
    START_DATE = 'Start date (dd/mm/yyyy)',
    END_DATE = 'Expiration date (dd/mm/yyyy)',
}

export enum ClientUsageBreakdownPMKFATitles {
    EMAIL = 'Email',
    PM_VIEW_LOG = 'PM View Log',
    PM_DOWNLOAD_LOG = 'PM Download Log',
    KFA_VIEW_LOG = 'KFA View Log',
    KFA_DOWNLOAD_LOG = 'KFA Download Log',
}

export enum ClientUsageBreakdownSPCreationTitles {
    DATE = 'Date',
    CREATED_CUSTOM_SP = 'Created Custom SPs',
    MODIFIED_CUSTOM_SP = 'Modified Custom SPs',
}

export enum ClientUsageBreakdownIGCreationTitles {
    DATE = 'Date',
    INTERVIEW_GUIDES_CREATED = 'Interview Guides Created',
}

export enum ClientUsageBreakdownPMKFASubScriptionTitles {
    DATE = 'Date',
    PM_VIEW_LOG = 'PM View Log',
    PM_DOWNLOAD_LOG = 'PM Download Log',
    KFA_VIEW_LOG = 'KFA View Log',
    KFA_DOWNLOAD_LOG = 'KFA Download Log',
}

export enum ClientOverviewColumns {
    SUBSCRIPTION_INFORMATION = 'Subscription Information',
    USER_DETAILS = 'User Details',
}

export enum UsageSheetColumns {
    TOTAL_VIEW_DOWNLOAD_LOG_TITLE = 'Total Number of View/Download Log (PM and KFA)',
    VIEW_DOWNLOAD_LOG_TABLE_TITLE = 'Number of View/Download Log (PM and KFA) - previous 12 months of subscription',
    SP_CREATION_TABLE_TITLE = 'Number of SPs creation/modification - previous 12 months of subscription',
    NUMBER_OF_INTERVIEW_GUIDES = 'Number of Interview Guides created - previous 12 months of subscription',
}

export enum ClientOverviewSubscriptionTitles {
    EngagementNumber = 'Engagement Number',
    MaterialCode = 'Product SKU',
    ProductName = 'Product',
    StartDate = 'Start date (dd/mm/yyyy)',
    ExpirationDate = 'End date (dd/mm/yyyy)',
}

export enum ClientOverviewUserDetailsTitles {
    Email = 'Email Address',
    FirstName = 'First Name',
    LastName = 'Last name',
    UserRole = 'User Role',
    PrimaryTeam = 'Primary Role',
    NofOfLogins = 'Total Login Count',
    LastLoggeddate = 'Last Login Date (dd/mm/yyyy)',
}

export enum UsageTotalNumberOfLogs {
    Email = 'Email',
    PMViewLog = 'PM View Log',
    PMDownloadLog = 'PM Download Log',
    KFAViewLog = 'KFA View Log',
    KFADownloadLog = 'KFA Download Log',
}

export enum UsageTotalNumberOfLogsSubscriptions {
    MonthDate = 'Date',
    PMViewLog = 'PM View Log',
    PMDownloadLog = 'PM Download Log',
    KFAViewLog = 'KFA View Log',
    KFADownloadLog = 'KFA Download Log',
}

export enum UsageSheetNumberOfSPs {
    MonthDate = 'Date',
    CustomSPCreatedCount = 'Created Custom SPs',
    CustomSPModifiedCount = 'Modified Custom SPs',
}

export enum UsageSheetInterviewGuidesCreated {
    MonthDate = 'Date',
    CustomIGDownloads = 'Interview Guides Created',
}
