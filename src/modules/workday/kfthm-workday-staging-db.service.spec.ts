import { KfThmWorkdayInterface as WorkdayInterfaces } from './kfthm-workday.interface';
import { KfThmWorkdayStagingDBService } from './kfthm-workday-staging-db.service';

import * as typeorm from 'typeorm';
jest.mock('typeorm', () => {
    const actual = jest.requireActual('typeorm');
    return {
        ...actual,
    };
});

describe('KfThmWorkdayStagingDBService', () => {
    let s: KfThmWorkdayStagingDBService;

    beforeEach(() => {
        s = new KfThmWorkdayStagingDBService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('insertPostToWorkdayStatus', () => {
        test('should insert workday status successfully', async () => {
            (typeorm as any).getManager = () => ({
                query: () => {
                    return Promise.resolve([
                        {
                            PostKFSuccessProfileToWorkdayID: 12123,
                        },
                    ]);
                },
            });
            (typeorm as any).getConnection = () => ({
                driver: {
                    escapeQueryWithParameters: () => [],
                },
            });

            const statusId = 12123;

            const res = await s.insertPostToWorkdayStatus(123, 'mock-uuid');
            expect(res).toEqual(statusId);
        });

        test('should throw an error when not able to get id of newly inserted status', async () => {
            (typeorm as any).getManager = () => ({
                query: () => {
                    return Promise.resolve([]);
                },
            });
            (typeorm as any).getConnection = () => ({
                driver: {
                    escapeQueryWithParameters: () => [],
                },
            });
            const errMessage = 'Unable to find inserted Workday status row';

            let e;
            try {
                await s.insertPostToWorkdayStatus(123, 'mock-uuid');
            } catch (err) {
                e = err;
            }

            expect(e).toBeDefined();
            expect(e.message).toEqual(errMessage);
        });
    });

    describe('insertPostToWorkday', () => {
        test('should successfully insert to staging table', async () => {
            (typeorm as any).getManager = () => ({
                query: () => {
                    return Promise.resolve([]);
                },
            });
            (typeorm as any).getConnection = () => ({
                driver: {
                    escapeQueryWithParameters: () => [],
                },
            });

            const mockEntry: WorkdayInterfaces.UploadEntry = {
                ClientID: 123,
                EffectiveDate: '1/20/2021',
                JobCode: '',
                JobProfileName: '',
                LastPublishedDate: '',
                ScheduleIntegration: 'Yes',
                SuccessProfileID: 321,
                SuccessProfileName: '',
            };

            let e;
            try {
                await s.insertPostToWorkday(777, 123, 321, new Date(), mockEntry);
            } catch (err) {
                e = err;
            }

            expect(e).toBeUndefined();
        });

        test('should throw error if effective date has unexpected format', async () => {
            (typeorm as any).getManager = () => ({
                query: () => {
                    return Promise.resolve([]);
                },
            });

            const mockEntry: WorkdayInterfaces.UploadEntry = {
                ClientID: 123,
                EffectiveDate: 'unexpected-format',
                JobCode: '',
                JobProfileName: '',
                LastPublishedDate: '',
                ScheduleIntegration: 'Yes',
                SuccessProfileID: 321,
                SuccessProfileName: '',
            };

            const errMessage = 'Unexpected EffectiveDate value: unexpected-format';

            let e;
            try {
                await s.insertPostToWorkday(777, 123, 321, new Date(), mockEntry);
            } catch (err) {
                e = err;
            }

            expect(e).toBeDefined();
            expect(e.message).toEqual(errMessage);
        });
    });

    describe('callLoadToWorkdayStagingProc', () => {
        test('should successfully call stored proc', async () => {
            (typeorm as any).getManager = () => ({
                query: () => {
                    return Promise.resolve([]);
                },
            });
            (typeorm as any).getConnection = () => ({
                driver: {
                    escapeQueryWithParameters: () => [],
                },
            });

            const uuid = 'mock-uuid';

            let e;
            try {
                await s.callLoadToWorkdayStagingProc(uuid);
            } catch (err) {
                e = err;
            }

            expect(e).toBeUndefined();
        });
    });
});
