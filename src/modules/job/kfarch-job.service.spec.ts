import { Test, TestingModule } from '@nestjs/testing';
import { KfArchJobService } from './kfarch-job.service';
import { KfArchInsertDataRepository, KfArchStatusRepository } from './kfarch-job.repository';
import { KfArchClientJobDBService } from './kfarch-clientjob-db.service';
import { KfArchJobTitlesStagingRepository } from './kfarch-job-titles-staging.repository';
import { KfHttpsService } from '@kf-products-core/kfhub_svc_lib';
import { s3 } from './../../common/common.utils';
import * as typeorm from 'typeorm';
import { JobsTitlesForValidation } from './kfarch-job.interface';

jest.mock('./../../common/common.utils');
jest.mock('typeorm', () => {
    const actual = jest.requireActual('typeorm');
    return {
        ...actual,
    };
});

describe('KfArchJobService', () => {
    let jobsService: KfArchJobService;
    let insertDataRepository: KfArchInsertDataRepository;
    let statusRepository: KfArchStatusRepository;
    let jobTitlesStagingRepository: KfArchJobTitlesStagingRepository;
    let clientJobsDBService: KfArchClientJobDBService;
    let httpsService: KfHttpsService;
    let module: TestingModule;

    const typeormQuery = jest.fn();

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [
                KfArchJobService,
                KfArchInsertDataRepository,
                KfArchStatusRepository,
                KfArchJobTitlesStagingRepository,
                KfArchClientJobDBService,
                KfHttpsService,
            ],
        }).compile();

        jobsService = module.get<KfArchJobService>(KfArchJobService);
        insertDataRepository = module.get<KfArchInsertDataRepository>(KfArchInsertDataRepository);
        statusRepository = module.get<KfArchStatusRepository>(KfArchStatusRepository);
        clientJobsDBService = module.get<KfArchClientJobDBService>(KfArchClientJobDBService);
        jobTitlesStagingRepository = module.get<KfArchJobTitlesStagingRepository>(KfArchJobTitlesStagingRepository);
        httpsService = module.get<KfHttpsService>(KfHttpsService);
    });

    beforeEach(() => {
        (typeorm as any).getManager = jest.fn().mockReturnValue({
            query: typeormQuery,
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getSignedUrlForDownload', () => {
        (s3.listObjectsV2 as any).mockReturnValue({
            promise: () => {
                return Promise.resolve({
                    Contents: [
                        {
                            Key: 'test-s3-key',
                        },
                    ],
                });
            },
        });
        (s3.getSignedUrlPromise as any).mockResolvedValue('mock-signed-url');

        test('should return url for status 0, 1, 3, 4', async () => {
            ['0', '1', '3', '4'].forEach(async (status) => {
                const query: any = { status, fileUUID: 'test-file-uuid' };
                const request: any = {};

                const result = { url: 'mock-signed-url' };
                const res = await jobsService.getSignedUrlForDownload(query, request);

                expect(res).toEqual(result);
            });
        });

        test('should throw exception on status 2', async () => {
            const query: any = { status: '2', fileUUID: 'test-file-uuid' };
            const request: any = {};
            let err;

            const errMessage = 'Fatal error, no output file';

            try {
                await jobsService.getSignedUrlForDownload(query, request);
            } catch (e) {
                err = e;
            }

            expect(err).toBeDefined();
            expect(err.message).toEqual(errMessage);
        });

        test('should return jobs list on status 5', async () => {
            const query: any = { status: '5', fileUUID: 'test-file-uuid', clientId: 123 };
            const request: any = {
                headers: {
                    authtoken: 'mock-auth-token',
                },
            };

            jest.spyOn(httpsService, 'post').mockResolvedValue('mock-jobs-list' as any);

            const result = { url: 'mock-jobs-list' };

            const res = await jobsService.getSignedUrlForDownload(query, request);
            expect(res).toBeDefined();
            expect(res).toEqual(result);
        });
    });

    describe('getSignedUrlForUpload', () => {
        test('should return url when called without clientId', async () => {
            (s3.headBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.reject();
                },
            });
            (s3.createBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve();
                },
            });
            const resultUrl = 'mock-signed-url';
            (s3.getSignedUrlPromise as any).mockResolvedValue(resultUrl);
            jest.spyOn(statusRepository, 'createStatus').mockResolvedValue({} as any);

            const query: any = {};

            const s3Object = {
                ACL: 'private',
                ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                Key: expect.anything(),
            };

            const res = await jobsService.getSignedUrlForUpload(query);

            expect(res.url).toEqual(resultUrl);
            expect(res.uuid).toBeDefined();
            expect(s3.getSignedUrlPromise).toHaveBeenCalledWith('putObject', expect.objectContaining(s3Object));
        });

        test('should return url when called with clientId', async () => {
            (s3.headBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.reject();
                },
            });
            (s3.createBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve();
                },
            });
            const resultUrl = 'mock-signed-url';
            (s3.getSignedUrlPromise as any).mockResolvedValue(resultUrl);
            jest.spyOn(statusRepository, 'createStatus').mockResolvedValue({} as any);

            const query: any = { clientId: 123123123 };

            const s3Object = {
                ACL: 'private',
                ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                Key: expect.stringContaining('/123123123/'),
            };

            const res = await jobsService.getSignedUrlForUpload(query);

            expect(res.url).toEqual(resultUrl);
            expect(res.uuid).toBeDefined();
            expect(s3.getSignedUrlPromise).toHaveBeenCalledWith('putObject', expect.objectContaining(s3Object));
        });

        test('should throw an error', async () => {
            (s3.headBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.reject();
                },
            });
            (s3.createBucket as any).mockReturnValue({
                promise: () => {
                    throw new Error();
                },
            });

            const query: any = {};
            let err;
            try {
                await jobsService.getSignedUrlForUpload(query);
            } catch (e) {
                err = e;
            }

            expect(err).toBeDefined();
        });
    });

    describe('getStatus', () => {
        test('should return metadata', async () => {
            jest.spyOn(statusRepository, 'getMetadata').mockResolvedValue('mock-metadata' as any);
            const query: any = {
                fileUUID: 'mock-fileUUID',
            };

            const statusMetadata = 'mock-metadata';

            const res = await jobsService.getStatus(query);
            expect(res).toEqual(statusMetadata);
        });

        test('should throw an error', async () => {
            jest.spyOn(statusRepository, 'getMetadata').mockRejectedValueOnce(new Error('mock-error'));
            const query: any = {
                fileUUID: 'mock-fileUUID',
            };

            const errMessage = 'mock-error';

            let err;
            try {
                await jobsService.getStatus(query);
            } catch (e) {
                err = e;
            }

            expect(err).toBeDefined();
            expect(err.message).toEqual(errMessage);
        });
    });

    describe('createStatus', () => {
        test('should execute without errors', async () => {
            jest.spyOn(statusRepository, 'updateStatus').mockResolvedValue({} as any);
            const query: any = {
                fileUUID: 'mock-fileUUID',
                processStatus: 'mock-status',
            };

            let err;
            try {
                await jobsService.createStatus(query);
            } catch (e) {
                err = e;
            }

            expect(err).not.toBeDefined();
        });
    });

    describe('insertData', () => {
        test('should execute without errors', async () => {
            jest.spyOn(statusRepository, 'getMetadata').mockResolvedValue({
                CreateBy: 'mock-created-by',
                KFArchitectProfilesUpdateID: 'mock-update-id',
            } as any);
            (s3.getObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve({
                        Body: {
                            toString: () => {
                                return '[]';
                            },
                        },
                    });
                },
            });
            jest.spyOn(insertDataRepository, 'insertBulkData').mockResolvedValue({} as any);

            const body: any = {
                fileKey: 'mock-file-key',
                fileUUID: 'mock-file-uuid',
                processStatus: 'mock-status',
            };

            const result = {};

            let err;
            let res;
            try {
                res = await jobsService.insertData(body, {} as any);
            } catch (e) {
                err = e;
            }

            expect(err).not.toBeDefined();
            expect(res).toBeDefined();
            expect(res).toEqual(result);
        });

        test('should throw an error', async () => {
            (s3.getObject as any).mockReturnValue({
                promise: () => {
                    return Promise.reject('mock-rejection');
                },
            });

            const body: any = {
                fileKey: 'mock-file-key',
                fileUUID: 'mock-file-uuid',
                processStatus: 'mock-status',
            };

            let err;
            try {
                await jobsService.insertData(body, {} as any);
            } catch (e) {
                err = e;
            }

            expect(err).toBeDefined();
        });

        test('should split large datasets into batches before inserting', async () => {
            // Generate dummy payload with large number of entries
            const payload: any = [];
            for (let i = 0; i < 25; i++) {
                payload.push({} as any);
            }

            jest.spyOn(statusRepository, 'getMetadata').mockResolvedValue({
                CreateBy: 'mock-created-by',
                KFArchitectProfilesUpdateID: 'mock-update-id',
            } as any);
            (s3.getObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve({
                        Body: {
                            toString: () => {
                                return JSON.stringify(payload);
                            },
                        },
                    });
                },
            });
            const insertBulkDataSpy = jest.spyOn(insertDataRepository, 'insertBulkData').mockResolvedValue({} as any);

            const body: any = {
                fileKey: 'mock-file-key',
                fileUUID: 'mock-file-uuid',
                processStatus: 'mock-status',
            };

            let err;
            let res;
            try {
                res = await jobsService.insertData(body, {} as any);
            } catch (e) {
                err = e;
            }

            expect(err).toBeUndefined();
            expect(res).toBeDefined();
            expect(res).toEqual({});
            // Payload contains 25 entries, batch size is 10 - so total 3 batches
            expect(insertBulkDataSpy).toHaveBeenCalledTimes(3);
        });
    });

/*
    describe('getPushData', () => {
        const query = {
            fileUUID: 'mock-fileUUID',
            uploadClientId: 1,
        };

        const request: any = {
            headers: {
                authtoken: 'mock-auth-token',
            },
        };
        test('should query and return push data', async () => {
            const pushData = 'mock-pushdata';
            typeormQuery.mockResolvedValueOnce(pushData);

            jest.spyOn(jobsService, 'getPushData').mockImplementation((query, request) => Promise.resolve());
        });

        test('should throw an error', async () => {
            typeormQuery.mockRejectedValueOnce('Failed');

            let err: Error | undefined;
            try {
                await jobsService.getPushData(query, request);
            } catch (e) {
                err = e;
            }

            expect(err).toBeUndefined();
        });
    });
*/

    describe('validateJobTitles', () => {
        test('should return true if job titles are emtpry', async () => {
            const res = await jobsService.validateJobTitles({ clientId: 1, jobs: [] });

            expect(res).toEqual({ isValid: true });
        });

        test('should return true if job titles were not found in DB', async () => {
            jest.spyOn(jobTitlesStagingRepository, 'insertBulkData').mockResolvedValueOnce();
            jest.spyOn(jobTitlesStagingRepository, 'deleteBulk').mockResolvedValueOnce();
            jest.spyOn(clientJobsDBService, 'checkExistingJobTitlesForClient').mockResolvedValue([]);

            const res = await jobsService.validateJobTitles({ clientId: 1, jobs: [{ title: 'new job', architectJobFlag: 1 }] });

            expect(res).toEqual({ isValid: true });
        });

        test('should return false and list of duplicate job titles', async () => {
            jest.spyOn(jobTitlesStagingRepository, 'insertBulkData').mockResolvedValueOnce();
            jest.spyOn(jobTitlesStagingRepository, 'deleteBulk').mockResolvedValueOnce();
            jest.spyOn(clientJobsDBService, 'checkExistingJobTitlesForClient').mockResolvedValue([
                {
                    title: 'duplicate!',
                },
            ]);

            const res = await jobsService.validateJobTitles({ clientId: 1, jobs: [{ title: 'duplicate!', architectJobFlag: 1 }] });

            expect(res).toEqual({
                isValid: false,
                duplicateJobTitles: ['duplicate!'],
            });
        });

        test('should try to clean up and throw an error if failing to insert data into staging table', async () => {
            const insertBulkDataSpy = jest.spyOn(jobTitlesStagingRepository, 'insertBulkData').mockRejectedValueOnce('mock-error');
            const deleteBulkSpy = jest.spyOn(jobTitlesStagingRepository, 'deleteBulk').mockResolvedValueOnce();

            let err = undefined;
            try {
                await jobsService.validateJobTitles({ clientId: 1, jobs: [{ title: 'duplicate!', architectJobFlag: 1 }] });
            } catch (e) {
                err = e;
            }

            expect(err).toBeDefined();
            expect(insertBulkDataSpy).toBeCalledTimes(1);
            expect(deleteBulkSpy).toBeCalledTimes(1);
        });

        test('should try to clean up and throw an error if failing everything', async () => {
            const insertBulkDataSpy = jest.spyOn(jobTitlesStagingRepository, 'insertBulkData').mockRejectedValueOnce('mock-error');
            const deleteBulkSpy = jest.spyOn(jobTitlesStagingRepository, 'deleteBulk').mockRejectedValueOnce('mock-delete-error');

            let err = undefined;
            try {
                await jobsService.validateJobTitles({ clientId: 1, jobs: [{ title: 'duplicate!', architectJobFlag: 1 }] });
            } catch (e) {
                err = e;
            }

            expect(err).toBeDefined();
            expect(insertBulkDataSpy).toBeCalledTimes(1);
            expect(deleteBulkSpy).toBeCalledTimes(1);
        });

        test('should throw an error if failed during final clean up operation', async () => {
            const insertBulkDataSpy = jest.spyOn(jobTitlesStagingRepository, 'insertBulkData').mockResolvedValueOnce();
            const deleteBulkSpy = jest.spyOn(jobTitlesStagingRepository, 'deleteBulk').mockRejectedValueOnce('mock-final-bulk-delete-error');

            const checkExistingJobTitlesForClientSpy = jest.spyOn(clientJobsDBService, 'checkExistingJobTitlesForClient').mockResolvedValue([
                {
                    title: 'duplicate!',
                },
            ]);

            let err = undefined;
            try {
                await jobsService.validateJobTitles({ clientId: 1, jobs: [{ title: 'duplicate!', architectJobFlag: 1 }] });
            } catch (e) {
                err = e;
            }

            expect(err).toBeDefined();
            expect(insertBulkDataSpy).toBeCalledTimes(1);
            expect(checkExistingJobTitlesForClientSpy).toBeCalledTimes(1);
            expect(deleteBulkSpy).toBeCalledTimes(1);
        });

        test('should split large payload into several batches when inserting into staging table', async () => {
            const insertBulkDataSpy = jest.spyOn(jobTitlesStagingRepository, 'insertBulkData').mockResolvedValueOnce();
            const deleteBulkSpy = jest.spyOn(jobTitlesStagingRepository, 'deleteBulk').mockResolvedValueOnce();

            const checkExistingJobTitlesForClientSpy = jest.spyOn(clientJobsDBService, 'checkExistingJobTitlesForClient').mockResolvedValue([
                {
                    title: 'duplicate!',
                },
            ]);

            let jobs: JobsTitlesForValidation[] = [];
            for (let idx = 0; idx < 2500; idx++) {
                jobs.push({ title: `mock-job-title-${idx}`, architectJobFlag: 1 });
            }

            let err = undefined;
            try {
                await jobsService.validateJobTitles({ clientId: 1, jobs });
            } catch (e) {
                err = e;
            }

            expect(err).not.toBeDefined();
            // 2500 titles in total -> 3 batches with maximum 1000 titles in each
            expect(insertBulkDataSpy).toBeCalledTimes(3);
            expect(checkExistingJobTitlesForClientSpy).toBeCalledTimes(1);
            expect(deleteBulkSpy).toBeCalledTimes(1);
        });
    });

    describe('getClientJobsMainInfo', () => {
        //arrange
        const mockJobsMain: any = { whatever: 'data' };
        const mockWorkConds = true;
        const response = { clientJobsInfo: mockJobsMain, isWorkingConditionsEnabled: mockWorkConds };
        const clientId = 123,
            locale = 'en';
        let result, err;
        test('should return db data', async () => {
            const spyWorkConds = jest.spyOn(clientJobsDBService, 'selectIsClientWorkingConditionsEnabled').mockResolvedValueOnce(mockWorkConds);
            const spyJobsMain = jest.spyOn(clientJobsDBService, 'selectClientJobsMainInfo').mockResolvedValueOnce(mockJobsMain);
            //act
            try {
                result = await jobsService.getClientJobsMainInfo(clientId, locale);
            } catch (e) {
                err = e;
            }
            //assert
            expect(spyWorkConds).toBeCalledWith(clientId);
            expect(spyJobsMain).toBeCalledWith(clientId, locale);
            expect(result).toEqual(response);
            expect(err).toBeUndefined;
        });
    });
});
