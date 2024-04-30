import { SuccessProfilesQuery } from './kfthm-successprofile.interface';


const getNextNumber = (base => (): number => base++)(new Date().getTime());

export const definedOr = (value, orValue) => (typeof value === 'undefined' ? orValue : value);
export const getRandomNumber = (min: number = 1, max: number = 100) => Math.round(Math.random() * (max - min));
export const getRandomString = (opts?: object) => {
    const { min, max, dict } = Object.assign(
        {
            min: 0,
            max: 100,
            dict: 'abcdefghijklmnopqrstuvwxyz0123456789',
        },
        definedOr(opts, {}),
    );
    const e = '';
    const dl = Math.max(0, dict.length - 1);
    return dl
        ? Array(min + getRandomNumber(min, max))
            .fill(e)
            .reduce((a) => a + dict[getRandomNumber(0, dl)], e)
        : e;
};
export const getRandomEmptyString = (): string => getRandomString({ dict: '  \r\t\n' });

export const getNumber = (): number => getNextNumber();
export const getString = (): string => getNextNumber().toString(36);
export const getDate = (): Date => new Date(getNextNumber());
export const getBoolean = (): boolean => Boolean(getNextNumber() % 2);

export const spQuery: SuccessProfilesQuery = {
    type: 'SEARCH_SUCCESS_PROFILES',
    pageIndex: '0',
    searchString: '',
    sortBy: 'DESC',
    sortColumn: 'JOB_TITLE',
    loggedInUserClientId: 14193,
    userId: 358497,
    locale: 'en',
    pageSize: '100',
    requestClient: '',
    clientId: 0,
    filterBy: '',
    filterValues: '',
    lcid: 'en'
};

export const metadataQuery: SuccessProfilesQuery = {
    type: 'METADATA',
    loggedInUserClientId: 14193,
    userId: 358497,
    locale: 'en',
    requestClient: '',
    searchString: '',
    sortColumn: '',
    sortBy: '',
    pageIndex: '',
    pageSize: '',
    clientId: 0,
    filterBy: '',
    filterValues: '',
    lcid: 'en'
};

export const thPortalProfiles = [
    {
        JobName: 'Academic Faculty Member/Physician II 15-01',
        JobID: '90371',
        ProfileType: 'JOB_DESCRIPTION',
        Grade: '20',
        LevelName: 'Executive',
        FunctionName: 'Physician Services',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1610700669910',
        TotalRecords: '4247'
    },
    {
        JobName: 'Administrative Assistant I COPY 012221',
        JobID: '90379',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '10',
        LevelName: 'Individual Contributor',
        FunctionName: 'Administration / Support / Service 24-02',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1611348490346',
        TotalRecords: '4247'
    },
    {
        JobName: 'Administrative Assistant I COPY 012221',
        JobID: '90380',
        ProfileType: 'JOB_DESCRIPTION',
        Grade: '10',
        LevelName: 'Individual Contributor',
        FunctionName: 'Administration / Support / Service 24-02',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1611348534060',
        TotalRecords: '4247'
    },
    {
        JobName: 'Title case checks B25.01',
        JobID: '90393',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '18',
        LevelName: 'Individual Contributor',
        FunctionName: 'Petroleum Engineering/Production',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1611564005370',
        TotalRecords: '4247'
    },
    {
        JobName: 'for CL checks',
        JobID: '90397',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '16',
        LevelName: 'Individual Contributor',
        FunctionName: 'Claims B25.01 11:49',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1611569351326',
        TotalRecords: '4247'
    },
    {
        JobName: 'bcs not edited',
        JobID: '90401',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '15',
        LevelName: 'Individual Contributor',
        FunctionName: 'Health and Environment',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1611571615920',
        TotalRecords: '4247'
    },
    {
        JobName: 'bcs edited COPY',
        JobID: '90402',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '15',
        LevelName: 'Individual Contributor',
        FunctionName: 'Health and Environment',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1611571648596',
        TotalRecords: '4247'
    },
    {
        JobName: 'Environmental and Health Professional II',
        JobID: '90403',
        ProfileType: 'JOB_DESCRIPTION',
        Grade: '15',
        LevelName: 'Individual Contributor',
        FunctionName: 'Health and Environment',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1611572058366',
        TotalRecords: '4247'
    },
    {
        JobName: 'Head of Banking COPY',
        JobID: '90405',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '22',
        LevelName: 'Executive',
        FunctionName: 'Branch Financial Services/Banking',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1611574149816',
        TotalRecords: '4247'
    },
    {
        JobName: 'gCheck_26jan2021_4',
        JobID: '90429',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '17',
        LevelName: 'Front Line Manager',
        FunctionName: 'Health and Environment',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1611688837373',
        TotalRecords: '4247'
    },
    {
        JobName: 'PC Board Design Manager III B12.02',
        JobID: '90521',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '23',
        LevelName: 'Mid Level Manager',
        FunctionName: 'Hardware Engineering',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1613113058333',
        TotalRecords: '4247'
    },
    {
        JobName: 'job 8 12-02',
        JobID: '90530',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '19',
        LevelName: 'Mid Level Manager',
        FunctionName: 'Petroleum Engineering/Production',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1613116100770',
        TotalRecords: '4247'
    },
    {
        JobName: 'Added Job 11 12-02',
        JobID: '90533',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '19',
        LevelName: 'Mid Level Manager',
        FunctionName: 'Clinical Research and Development',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1613118845133',
        TotalRecords: '4247'
    },
    {
        JobName: 'Test 17022021 COPY',
        JobID: '90539',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '16',
        LevelName: 'Individual Contributor',
        FunctionName: 'Health and Environment',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1613557780833',
        TotalRecords: '4247'
    },
    {
        JobName: 'Test 17022021',
        JobID: '90538',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '13',
        LevelName: 'Individual Contributor',
        FunctionName: 'Health and Environment',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1613558365716',
        TotalRecords: '4247'
    },
    {
        JobName: 'je 2',
        JobID: '90541',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '13',
        LevelName: 'Individual Contributor',
        FunctionName: 'Health and Environment',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1613569424933',
        TotalRecords: '4247'
    },
    {
        JobName: 'je 1',
        JobID: '90540',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '13',
        LevelName: 'Individual Contributor',
        FunctionName: 'Health and Environment',
        CreatedBy: 'clm1 user one',
        ModifiedOn: '1613569425573',
        TotalRecords: '4247'
    },
    {
        JobName: 'Test KFA Changes Matrix Issue 1',
        JobID: '91542',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '14',
        LevelName: 'Individual Contributor',
        FunctionName: 'Health and Environment',
        CreatedBy: 'CLM Test Company 1 User',
        ModifiedOn: '1613579275110',
        TotalRecords: '4247'
    },
    {
        JobName: 'Test KFA Changes Matrix Issue 10',
        JobID: '91543',
        ProfileType: 'CUSTOM_PROFILE',
        Grade: '14',
        LevelName: 'Individual Contributor',
        FunctionName: 'Health and Environment',
        CreatedBy: 'CLM Test Company 1 User',
        ModifiedOn: '1613579275110',
        TotalRecords: '4247'
    }
];

export const preferedLanguages = [ { LCID: 'en', LanguageName: 'English' } ];

export const getSpDataResult = {
    'result': [
        {
            'JobName': 'Academic Faculty Member/Physician II 15-01',
            'JobID': '90371',
            'ProfileType': 'JOB_DESCRIPTION',
            'Grade': '20',
            'LevelName': 'Executive',
            'FunctionName': 'Physician Services',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1610700669910',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'Administrative Assistant I COPY 012221',
            'JobID': '90379',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '10',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Administration / Support / Service 24-02',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1611348490346',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'Administrative Assistant I COPY 012221',
            'JobID': '90380',
            'ProfileType': 'JOB_DESCRIPTION',
            'Grade': '10',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Administration / Support / Service 24-02',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1611348534060',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'Title case checks B25.01',
            'JobID': '90393',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '18',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Petroleum Engineering/Production',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1611564005370',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'for CL checks',
            'JobID': '90397',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '16',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Claims B25.01 11:49',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1611569351326',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'bcs not edited',
            'JobID': '90401',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '15',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Health and Environment',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1611571615920',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'bcs edited COPY',
            'JobID': '90402',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '15',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Health and Environment',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1611571648596',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'Environmental and Health Professional II',
            'JobID': '90403',
            'ProfileType': 'JOB_DESCRIPTION',
            'Grade': '15',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Health and Environment',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1611572058366',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'Head of Banking COPY',
            'JobID': '90405',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '22',
            'LevelName': 'Executive',
            'FunctionName': 'Branch Financial Services/Banking',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1611574149816',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'gCheck_26jan2021_4',
            'JobID': '90429',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '17',
            'LevelName': 'Front Line Manager',
            'FunctionName': 'Health and Environment',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1611688837373',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'PC Board Design Manager III B12.02',
            'JobID': '90521',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '23',
            'LevelName': 'Mid Level Manager',
            'FunctionName': 'Hardware Engineering',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1613113058333',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'job 8 12-02',
            'JobID': '90530',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '19',
            'LevelName': 'Mid Level Manager',
            'FunctionName': 'Petroleum Engineering/Production',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1613116100770',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'Added Job 11 12-02',
            'JobID': '90533',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '19',
            'LevelName': 'Mid Level Manager',
            'FunctionName': 'Clinical Research and Development',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1613118845133',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'Test 17022021 COPY',
            'JobID': '90539',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '16',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Health and Environment',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1613557780833',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'Test 17022021',
            'JobID': '90538',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '13',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Health and Environment',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1613558365716',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'je 2',
            'JobID': '90541',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '13',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Health and Environment',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1613569424933',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'je 1',
            'JobID': '90540',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '13',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Health and Environment',
            'CreatedBy': 'clm1 user one',
            'ModifiedOn': '1613569425573',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'Test KFA Changes Matrix Issue 1',
            'JobID': '91542',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '14',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Health and Environment',
            'CreatedBy': 'CLM Test Company 1 User',
            'ModifiedOn': '1613579275110',
            'TotalRecords': '4247'
        },
        {
            'JobName': 'Test KFA Changes Matrix Issue 10',
            'JobID': '91543',
            'ProfileType': 'CUSTOM_PROFILE',
            'Grade': '14',
            'LevelName': 'Individual Contributor',
            'FunctionName': 'Health and Environment',
            'CreatedBy': 'CLM Test Company 1 User',
            'ModifiedOn': '1613579275110',
            'TotalRecords': '4247'
        }
    ],
    'paging': {
        'pageIndex': 1,
        'pageSize': 100,
        'totalPages': 43,
        'totalResultRecords': 4247
    },
    'preferredLanguages': [
        {
            'LCID': 'en',
            'LanguageName': 'English'
        }
    ]
};
export const getSpDataEmptyResult = {
    'paging': {
        'pageIndex': 1, 'pageSize': 100, 'totalPages': 0, 'totalResultRecords': 0
    },
    'preferredLanguages': [],
    'result': []
};

export const metadata = [
    {
        MethodvalueName: 'FUNCTIONS',
        MethodName: 'AB',
        Methodvalue: 'Academic Medical'
    },
    {
        MethodvalueName: 'FUNCTIONS',
        MethodName: 'F0138222',
        Methodvalue: '21-4-22'
    },
    {
        MethodvalueName: 'GRADES',
        MethodName: 'Reference Level 04',
        Methodvalue: '4'
    },
    {
        MethodvalueName: 'GRADES',
        MethodName: 'Reference Level 05',
        Methodvalue: '5'
    },
    {
        MethodvalueName: 'LANGUAGE',
        MethodName: 'Dutch',
        Methodvalue: 'nl'
    },
    {
        MethodvalueName: 'LANGUAGE',
        MethodName: 'English',
        Methodvalue: 'en'
    },
    {
        MethodvalueName: 'LEVELS',
        MethodName: 'Senior Executive',
        Methodvalue: '2'
    },
    {
        MethodvalueName: 'PROFILE_TYPE',
        MethodName: 'Job Description',
        Methodvalue: '2'
    },
    {
        MethodvalueName: 'PROFILE_TYPE',
        MethodName: 'Success Profile',
        Methodvalue: '1'
    }
];


export const getMetadataResult = {
    'metadata': [
        {
            'name': 'SEARCH_SUCCESS_PROFILES',
            'value': 'SEARCH_SUCCESS_PROFILES',
            'searchOn': [
                {
                    'name': 'FUNCTIONS',
                    'value': 'Functions',
                    'options': [
                        {
                            'id': 'AB',
                            'value': 'Academic Medical',
                            'name': 'AB'
                        },
                        {
                            'id': 'F0138222',
                            'value': '21-4-22',
                            'name': 'F0138222'
                        }
                    ]
                },
                {
                    'name': 'GRADES',
                    'value': 'Grades',
                    'options': [
                        {
                            'id': '4',
                            'value': 'Reference Level 04',
                            'name': '4'
                        },
                        {
                            'id': '5',
                            'value': 'Reference Level 05',
                            'name': '5'
                        }
                    ]
                },
                {
                    'name': 'LANGUAGES',
                    'value': 'Languages',
                    'options': [
                        {
                            'id': 'Dutch',
                            'value': 'nl',
                            'name': 'Dutch'
                        },
                        {
                            'id': 'English',
                            'value': 'en',
                            'name': 'English'
                        }
                    ]
                },
                {
                    'name': 'LEVELS',
                    'value': 'Levels',
                    'options': [
                        {
                            'id': '2',
                            'value': 'Senior Executive',
                            'name': '2'
                        }
                    ]
                },
                {
                    'name': 'PROFILE_TYPES',
                    'value': 'Profile types',
                    'options': [
                        {
                            'id': 'Job Description',
                            'value': '2',
                            'name': 'Job Description'
                        },
                        {
                            'id': 'Success Profile',
                            'value': '1',
                            'name': 'Success Profile'
                        }
                    ]
                }
            ]
        }
    ]
};

export const getMetadataEmptyResult = {
    'metadata': [
        { 'name': 'SEARCH_SUCCESS_PROFILES',
        'searchOn': [],
        'value': 'SEARCH_SUCCESS_PROFILES' }
    ]
};