export const CellColors = {
    header: '006651',
    title: 'F2F2F2',
    total: 'B5B5B5',
    white: 'FFFFFF',
    black: '000000',
    non_zero_color: 'FFE7CC',
    zero_color: 'FFCDCD',
    gray_border: 'D3D3D3',
};

export enum ServerGeneralInformationTitles {
    A3 = 'Server Location',
    A4 = 'Total Number of Clients:',
    A5 = 'Total Number of Active Clients:',
    A6 = 'Total Number of Users:',
    A7 = 'Total Number of Active Users',
    C3 = 'Subscriptions expiring in the next 3 months:',
    C4 = 'Subscriptions expiring in the next 6 months:',
    C5 = 'Report Date: (dd/mm/yyyy)',
}

export enum ServerSheetCellNotes {
    A4 = 'Includes the count of current clients with active subscription to Profile Manager and KF Architect as of the report date.',
    A5 = 'Number of clients with active users in past 3 months.',
    A6 = 'This is the total number of registered client users with UAM permission including access to Profile Manager and KF Architect.\nExcludes all KF Shadow and Delivery users.',
    A7 = 'Number of users who have logged into system in previous 3 months.',
    // C3 = 'This is the total number of registered client users with UAM permission including access to Profile Manager and KF Architect.',
    // C4 = 'Number of users who have logged into system in previous 3 months.',
    I10 = 'Includes the number of client users with UAM permissions to access Profile Manager.',
    J10 = 'Includes the number of client users with UAM permissions to access KF Architect.',
    K10 = 'The most recent date recording a client user successfully logging into the platform.',
    L10 = 'This count includes active profiles created in Profile Manager, AND those success profiles created when adding a job to KF Architect.\n Excludes all deleted profiles',
    M10 = 'Includes all active Job Descriptions in the client account.\nExcludes deleted.',
    N10 = 'Includes the current total number of KF Architect Jobs, all status including KF Draft and Inactive.\n Excludes deleted Jobs.',
    U10 = 'This will count exports generated AFTER Q1 FY24.',
    V10 = 'This will count exports generated AFTER Q1 FY24.',
    W10 = 'This will count exports generated AFTER Q1 FY24.',
    X10 = 'This will count exports generated AFTER Q1 FY24.',
}

export enum ClientOverviewSheetCellNotes {
    A9 = 'Total number of client users with access to Profile Manager and Architect.',
    A10 = 'The number of users who have accessed the platform within the last 3 months.',
    A11 = 'Total number of custom profiles created in the client account, since the account was created.\nExcludes deleted profiles',
    C3 = 'The number of newly created custom Behavioural Competencies that have been added to the Content Library; and which are currently active.',
    C4 = 'The number of new Responsibilities that have been added to the Content Library, this counts active responsibilites only.',
    C5 = 'This is a count of all new custom skills added to the Content Library.\nIncludes Active skils only.',
    C6 = 'The number of BiC Behavioural Competencies that have been edited from KFLA default in the Content Library.',
    C7 = 'The number of BiC Responsibilities that have edits made to either their title or description in the Content Library.',
    C8 = 'The number of BiC Skills that have edits made to their original content in the Content Library.',
    C9 = 'The count of Job Properties published. Includes Benchmark where relevant.',
    C10 = 'Yes/No to show whether a custom grade has been entered in the CLM.',
}

export enum ClientUsageSheetCellNotes {
    B4 = 'Total number of views/downloads since the first PM/KFA subscription.',
}

export enum ClientGeneralInformationTitles {
    A3 = 'Client name:',
    A4 = 'SAP ID:',
    A5 = 'PAMS ID:',
    A6 = 'Server Location:',
    A7 = 'Subscription from:',
    A8 = 'Subscription expires:',
    A9 = 'Total Number of Users:',
    A10 = 'Total Number of Active Users:',
    A11 = 'Total Number of Custom SPs:',
    C3 = 'Custom Behavioural Competencies:',
    C4 = 'Custom Responsibilities:',
    C5 = 'Custom Skills:',
    C6 = 'Edited Behavioural Competencies:',
    C7 = 'Edited Responsibilities:',
    C8 = 'Edited Skills:',
    C9 = 'Job Properties:',
    C10 = 'Custom Grades Set:',
    C11 = 'Date of Report: (dd/mm/yyyy)',
    E3 = 'Number of PM Matrix Exports:',
    E4 = 'Number of KFA Matrix Exports:',
    E5 = 'Number of KFA List Exports:',
    E6 = 'Number of KFA Archived jobs:',
}
