import { KfArchClientJobDBService } from './kfarch-clientjob-db.service';

import * as typeorm from 'typeorm';
jest.mock('typeorm', () => {
    const actual = jest.requireActual('typeorm');
    return {
        ...actual,
    };
});

describe('KfArchClientJobDBService', () => {
    const mockTypeormEscapeQueryWithParams = jest.fn();
    const mockTypeormQuery = jest.fn();
    (typeorm as any).getConnection = jest.fn().mockReturnValue({
        driver: {
            escapeQueryWithParameters: mockTypeormEscapeQueryWithParams,
        },
    });
    (typeorm as any).getManager = jest.fn().mockReturnValue({
        query: mockTypeormQuery,
    });

    let s: KfArchClientJobDBService;

    beforeEach(() => {
        s = new KfArchClientJobDBService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('checkExistingJobTitlesForClient', () => {
        test('should query db without errors', async () => {
            mockTypeormEscapeQueryWithParams.mockReturnValueOnce([]);

            const existingJobsForClient = [
                {
                    title: 'test job title',
                },
            ];

            mockTypeormQuery.mockResolvedValueOnce(existingJobsForClient);

            const res = await s.checkExistingJobTitlesForClient(123, 'mock-task-uuid');
            expect(res).toEqual(existingJobsForClient);
        });
    });

    describe('selectClientJobsMainInfo', () => {
        test('should query db without errors', async () => {
            //arrange
            const dBResponse = [
                {
                    JobID: 123,
                    'Success Profile/Job Description': 'qwerty',
                    JRTDetailID: 'qwerty',
                    'Job Name': 'qwerty',
                    Description: 'qwerty',
                    JobFamilyID: 'qwerty',
                    JobFamilyName: 'qwerty',
                    JobSubFamilyID: 'qwerty',
                    JobSubFamilyName: 'qwerty',
                    ReferenceLevel: 'qwerty',
                    'Level Name': 'qwerty',
                    'Sub Level Name': 'qwerty',
                    'Created On': 'qwerty',
                    'Created By': 'qwerty',
                    'Modified On': 'qwerty',
                    'Modified By': 'qwerty',
                    ShortProfile: 'qwerty',
                    BICProfileName: 'qwerty',
                },
            ];
            const expectedResult = [
                {
                    jobID: 123,
                    successProfileOrJobDescription: 'qwerty',
                    jRTDetailID: 'qwerty',
                    jobName: 'qwerty',
                    description: 'qwerty',
                    jobFamilyID: 'qwerty',
                    jobFamilyName: 'qwerty',
                    jobSubFamilyID: 'qwerty',
                    jobSubFamilyName: 'qwerty',
                    referenceLevel: 'qwerty',
                    levelName: 'qwerty',
                    subLevelName: 'qwerty',
                    createdOn: 'qwerty',
                    createdBy: 'qwerty',
                    modifiedOn: 'qwerty',
                    modifiedBy: 'qwerty',
                    shortProfile: 'qwerty',
                    bICProfileName: 'qwerty',
                },
            ];
            mockTypeormQuery.mockResolvedValueOnce(dBResponse);
            const clientId = 123,
                locale = 'en';
            //act
            const res = await s.selectClientJobsMainInfo(clientId, locale);
            //assert
            expect(res).toEqual(expectedResult);
        });
    });

    describe('selectIsClientWorkingConditionsEnabled', () => {
        test('selectIsClientWorkingConditionsEnabled should return true if query result Enabled: 1', async () => {
            //arrange
            const dBResponse = [
                {
                    Enabled: 1,
                },
            ];
            mockTypeormQuery.mockResolvedValueOnce(dBResponse);
            const clientId = 123;
            //act
            const res = await s.selectIsClientWorkingConditionsEnabled(clientId);
            //assert
            expect(res).toEqual(true);
        });
        test('selectIsClientWorkingConditionsEnabled should return false if query result Enabled: 0', async () => {
            //arrange
            const dBResponse = [
                {
                    Enabled: 0,
                },
            ];
            mockTypeormQuery.mockResolvedValueOnce(dBResponse);
            const clientId = 123;
            //act
            const res = await s.selectIsClientWorkingConditionsEnabled(clientId);
            //assert
            expect(res).toEqual(false);
        });
        test('selectIsClientWorkingConditionsEnabled should return false if query result empty', async () => {
            //arrange
            const dBResponse = [];
            mockTypeormQuery.mockResolvedValueOnce(dBResponse);
            const clientId = 123;
            //act
            const res = await s.selectIsClientWorkingConditionsEnabled(clientId);
            //assert
            expect(res).toEqual(false);
        });
        test('selectIsClientWorkingConditionsEnabled should throw error', async () => {
            //arrange
            mockTypeormQuery.mockRejectedValueOnce(new Error('db error'));
            const clientId = 123;
            //act
            let err;
            try {
                await s.selectIsClientWorkingConditionsEnabled(clientId);
            } catch (e) {
                err = e;
            }
            //assert
            expect(err).toBeDefined();
        });
    });
});
