import { Test, TestingModule } from '@nestjs/testing';
import { KfException, KfHttpsService } from '@kf-products-core/kfhub_svc_lib';
import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { KfThmWorkdayService } from './kfthm-workday.service';
import { KfThmWorkdayPublishingStatusRepository } from './kfthm-workday.repository';
import { KfThmWorkdayStagingDBService } from './kfthm-workday-staging-db.service';
import { KfThmWorkdayEnums as WorkdayEnums } from './kfthm-workday.enums';
import { KfThmWorkdayInterface as WorkdayInterfaces } from './kfthm-workday.interface';

jest.mock('./kfthm-workday.utils');
import { s3 } from './kfthm-workday.utils';

import * as typeorm from 'typeorm';
jest.mock('typeorm', () => {
    const actual = jest.requireActual('typeorm');
    return {
        ...actual,
    };
});

describe('KfThmWorkdayService', () => {
    let s: KfThmWorkdayService;
    let repo: KfThmWorkdayPublishingStatusRepository;
    let stagingDB: KfThmWorkdayStagingDBService;
    let http: KfHttpsService;
    let module: TestingModule;

    const typeormQuery = jest.fn();
    (typeorm as any).getManager = jest.fn().mockReturnValue({
        query: typeormQuery,
    });

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [KfThmWorkdayService, KfThmWorkdayPublishingStatusRepository, KfThmWorkdayStagingDBService, KfHttpsService],
        }).compile();

        s = module.get<KfThmWorkdayService>(KfThmWorkdayService);
        repo = module.get<KfThmWorkdayPublishingStatusRepository>(KfThmWorkdayPublishingStatusRepository);
        stagingDB = module.get<KfThmWorkdayStagingDBService>(KfThmWorkdayStagingDBService);
        http = module.get<KfHttpsService>(KfHttpsService);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('generateUUID', () => {
        test('should generate uuid v4', () => {
            const uuid = s.generateUUID();
            expect(uuid.length).toEqual(36);
        });
    });

    describe('isValidStatus', () => {
        test('should return true on valid status', () => {
            expect(s.isValidStatus(WorkdayEnums.DownloadStatus.PROCESS_STARTED)).toEqual(true);
            expect(s.isValidStatus(WorkdayEnums.DownloadStatus.UNKNOWN_ERROR)).toEqual(true);

            expect(s.isValidStatus(WorkdayEnums.UploadStatus.AWAITNG_UPLOAD)).toEqual(true);
            expect(s.isValidStatus(WorkdayEnums.UploadStatus.SUCCESS)).toEqual(true);
            expect(s.isValidStatus(WorkdayEnums.UploadStatus.DB_STAGING_TABLE_ERROR)).toEqual(true);
        });

        test('should return false on invalid status', () => {
            expect(s.isValidStatus(123123)).toEqual(false);
            expect(s.isValidStatus('something' as any)).toEqual(false);
        });
    });

    describe('getExportJsonS3Key', () => {
        test('should return S3 object key', () => {
            const date = new Date();
            date.setUTCFullYear(2021);
            date.setUTCMonth(4);
            date.setUTCDate(2);
            date.setUTCHours(3);
            date.setUTCMinutes(4);
            date.setUTCSeconds(5);
            date.setUTCMilliseconds(6);

            const k = s.getExportJsonS3Key(111, 'mock-uuid', date);

            const expectedTs = Math.round(date.valueOf() / 1000);
            expect(k).toEqual(`workday-integration/111/mock-uuid/file-export/${expectedTs}_export.json`);
        });
    });

    describe('getUploadExcelS3Key', () => {
        test('should return S3 object key', () => {
            const date = new Date();
            date.setUTCFullYear(2031);
            date.setUTCMonth(5);
            date.setUTCDate(6);
            date.setUTCHours(7);
            date.setUTCMinutes(8);
            date.setUTCSeconds(9);
            date.setUTCMilliseconds(10);

            const k = s.getUploadExcelS3Key(333, 'mock-uuid', date);

            const expectedTs = Math.round(date.valueOf() / 1000);
            expect(k).toEqual(`workday-integration/333/mock-uuid/file-upload/${expectedTs}_upload.xlsx`);
        });
    });

    describe('getDownloadExcelS3Key', () => {
        test('should return S3 object key', () => {
            const date = new Date();

            const k = s.getDownloadExcelS3Key(111, 'mock-uuid', date);

            expect(k).toEqual(`workday-integration/111/mock-uuid/file-download/Workday_Export_111.xlsx`);
        });
    });

    describe('getValidationErrorsS3Key', () => {
        test('should return S3 object key', () => {
            const date = new Date();

            const k = s.getValidationErrorsS3Key(111, 'mock-uuid', date);

            expect(k).toEqual(`workday-integration/111/mock-uuid/file-upload/Workday_Import_Errors_111.xlsx`);
        });
    });

    describe('getParsedUploadS3Key', () => {
        test('should return S3 object key', () => {
            const date = new Date();
            date.setUTCFullYear(2050);
            date.setUTCMonth(0);
            date.setUTCDate(3);
            date.setUTCHours(4);
            date.setUTCMinutes(5);
            date.setUTCSeconds(6);
            date.setUTCMilliseconds(7);

            const k = s.getParsedUploadS3Key(111, 'mock-uuid', date);

            const expectedTs = Math.round(date.valueOf() / 1000);
            expect(k).toEqual(`workday-integration/111/mock-uuid/file-parsed/${expectedTs}_parsed.json`);
        });
    });

    describe('createDownloadTask', () => {
        test('should return download task status', async () => {
            typeormQuery.mockResolvedValue([
                {
                    ClientJobID: 1111,
                    JobName: 'Test Job Name',
                    JobCode: null,
                    JobProfileName: null,
                    EffectiveDate: null,
                    LastPublishedDate: null,
                    ScheduleIntegration: null,
                    '': 'mock-emtpy-attribute',
                },
            ]);

            (s3.putObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve();
                },
            });
            jest.spyOn(repo, 'createStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({ CreatedOnUTC: new Date() } as any);
            jest.spyOn(repo, 'updateStatus').mockResolvedValue({} as any);

            const r = await s.createDownloadTask(123);

            expect(r.uuid).toBeDefined();
            expect(r.status).toEqual(WorkdayEnums.DownloadStatus.ASSEMBLING_DATA);
        });

        test('should handle error while inserting new status', async () => {
            jest.spyOn(repo, 'createStatus').mockRejectedValue(false);

            let e: KfException;
            try {
                await s.createDownloadTask(123);
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.CREATE_STATUS_FAILED);
        });

        test('should handle error while inserting new status', async () => {
            jest.spyOn(repo, 'createStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockRejectedValue(false);

            let e: KfException;
            try {
                await s.createDownloadTask(123);
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.GET_STATUS_METADATA_BY_UUID_FAILED);
        });

        test('should handle error while fetching workday items from DB', async () => {
            jest.spyOn(repo, 'createStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({} as any);

            typeormQuery.mockRejectedValue('mock-exception');

            let e: KfException;
            try {
                await s.createDownloadTask(123);
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.INTERNAL_SERVER_ERROR);
        });

        test('should handle error when saving workday items on S3', async () => {
            typeormQuery.mockResolvedValue([
                {
                    ClientJobID: 1111,
                    JobName: 'Test Job Name',
                    JobCode: null,
                    JobProfileName: null,
                    EffectiveDate: null,
                    LastPublishedDate: null,
                    ScheduleIntegration: null,
                    '': 'mock-emtpy-attribute',
                },
            ]);

            (s3.putObject as any).mockReturnValue({
                promise: () => {
                    return Promise.reject('mock-s3-exception');
                },
            });
            jest.spyOn(repo, 'createStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({ CreatedOnUTC: new Date() } as any);
            jest.spyOn(repo, 'updateStatus').mockResolvedValue({} as any);

            let e: KfException;
            try {
                await s.createDownloadTask(123);
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.AWS_IO_CALL_FAILED);
        });

        test('should handle error when updating status', async () => {
            typeormQuery.mockResolvedValue([
                {
                    ClientJobID: 1111,
                    JobName: 'Test Job Name',
                    JobCode: null,
                    JobProfileName: null,
                    EffectiveDate: null,
                    LastPublishedDate: null,
                    ScheduleIntegration: null,
                    '': 'mock-emtpy-attribute',
                },
            ]);

            (s3.putObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve();
                },
            });
            jest.spyOn(repo, 'createStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({ CreatedOnUTC: new Date() } as any);
            jest.spyOn(repo, 'updateStatus').mockRejectedValue('mock-exception-on-updating-status');

            let e;
            try {
                await s.createDownloadTask(123);
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.UPDATE_STATUS_BY_UUID_FAILED);
        });
    });

    describe('createUploadTask', () => {
        test('should return task uuid and presigned url', async () => {
            (s3.createBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve(true);
                },
            });
            (s3.getSignedUrlPromise as any).mockResolvedValue('mock-s3-presigned-url');
            (s3.putObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve();
                },
            });
            jest.spyOn(repo, 'createStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({ CreatedOnUTC: new Date() } as any);

            typeormQuery.mockResolvedValue([
                {
                    ClientJobID: 1111,
                    JobName: 'Test Job Name',
                    JobCode: null,
                    JobProfileName: null,
                    EffectiveDate: null,
                    LastPublishedDate: null,
                    ScheduleIntegration: null,
                    '': 'mock-emtpy-attribute',
                },
            ]);

            const r = await s.createUploadTask(123);

            expect(r.uuid).toBeDefined();
            expect(r.url).toEqual('mock-s3-presigned-url');
        });

        test('should handle error when checking S3 bucket status', async () => {
            (s3.createBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.reject('mock-s3-exception');
                },
            });

            let e;
            try {
                await s.createUploadTask(123);
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.AWS_IO_CALL_FAILED);
        });

        test('should handle error when setting up upload task in DB', async () => {
            (s3.createBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve(true);
                },
            });
            jest.spyOn(repo, 'createStatus').mockRejectedValue('mock-db-exception');

            let e;
            try {
                await s.createUploadTask(123);
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.CREATE_STATUS_FAILED);
        });

        test('should handle error when getting meta for newly created status in DB', async () => {
            (s3.createBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve(true);
                },
            });
            jest.spyOn(repo, 'createStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockRejectedValue('mock-db-select-exception');

            let e;
            try {
                await s.createUploadTask(123);
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.GET_STATUS_METADATA_BY_UUID_FAILED);
        });

        test('should handle error when fetching Workday data from DB', async () => {
            (s3.createBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve(true);
                },
            });
            jest.spyOn(repo, 'createStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({ CreatedOnUTC: new Date() } as any);

            typeormQuery.mockRejectedValue('mock-db-workday-proc-exception');

            let e;
            try {
                await s.createUploadTask(123);
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.INTERNAL_SERVER_ERROR);
        });

        test('should handle error when saving Workday data on S3', async () => {
            (s3.createBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve(true);
                },
            });
            (s3.putObject as any).mockReturnValue({
                promise: () => {
                    return Promise.reject('mock-exception');
                },
            });
            jest.spyOn(repo, 'createStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({ CreatedOnUTC: new Date() } as any);

            typeormQuery.mockResolvedValue([
                {
                    ClientJobID: 1111,
                    JobName: 'Test Job Name',
                    JobCode: null,
                    JobProfileName: null,
                    EffectiveDate: null,
                    LastPublishedDate: null,
                    ScheduleIntegration: null,
                    '': 'mock-emtpy-attribute',
                },
            ]);

            let e;
            try {
                await s.createUploadTask(123);
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.AWS_IO_CALL_FAILED);
        });

        test('should handle error when generating presigned S3 url for uploading', async () => {
            (s3.createBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve(true);
                },
            });
            (s3.getSignedUrlPromise as any).mockRejectedValue('mock-s3-presigned-url-exception');
            (s3.putObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve();
                },
            });
            jest.spyOn(repo, 'createStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({ CreatedOnUTC: new Date() } as any);

            typeormQuery.mockResolvedValue([
                {
                    ClientJobID: 1111,
                    JobName: 'Test Job Name',
                    JobCode: null,
                    JobProfileName: null,
                    EffectiveDate: null,
                    LastPublishedDate: null,
                    ScheduleIntegration: null,
                    '': 'mock-emtpy-attribute',
                },
            ]);

            let e;
            try {
                await s.createUploadTask(123);
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.AWS_IO_CALL_FAILED);
        });
    });

    describe('updateStatus', () => {
        test('should update status without errors', async () => {
            jest.spyOn(repo, 'updateStatus').mockResolvedValue({} as any);
            let err;
            try {
                await s.updateStatus('mock-uuid', 123);
            } catch (e) {
                err = e;
            }

            expect(err).toBeUndefined();
        });

        test('should handle DB error when updating', async () => {
            jest.spyOn(repo, 'updateStatus').mockRejectedValue('mock-db-exception');
            let err;
            try {
                await s.updateStatus('mock-uuid', 123);
            } catch (e) {
                err = e;
            }

            expect(err.getStatus()).toEqual(500);
            expect(err.getExceptionCode()).toEqual(ec.UPDATE_STATUS_BY_UUID_FAILED);
        });
    });

    describe('getStatus', () => {
        test('should get status without errors', async () => {
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                TaskStatus: 123,
                TaskType: WorkdayEnums.TaskType.UPLOAD,
            } as any);

            const status = await s.getStatus('mock-uuid');

            expect(status).toEqual({
                status: 123,
                uuid: 'mock-uuid',
            });
        });

        test('should return status and presigned url for completed download task', async () => {
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                TaskType: WorkdayEnums.TaskType.DOWNLOAD,
                TaskStatus: WorkdayEnums.DownloadStatus.SUCCESS,
                CreatedBy: 1234,
                CreatedOnUTC: new Date(),
            } as any);
            (s3.getSignedUrlPromise as any).mockResolvedValue('mock-presigned-s3-key');

            const status = await s.getStatus('mock-uuid');

            expect(status).toEqual({
                status: WorkdayEnums.DownloadStatus.SUCCESS,
                uuid: 'mock-uuid',
                url: 'mock-presigned-s3-key',
            });
        });

        test('should handle error when failing to generate presigned url for completed download task', async () => {
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                TaskType: WorkdayEnums.TaskType.DOWNLOAD,
                TaskStatus: WorkdayEnums.DownloadStatus.SUCCESS,
                CreatedBy: 1234,
                CreatedOnUTC: new Date(),
            } as any);
            (s3.getSignedUrlPromise as any).mockRejectedValue('mock-s3-exception');

            let e;
            try {
                await s.getStatus('mock-uuid');
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.AWS_IO_CALL_FAILED);
        });

        test('should return status and presigned url for excel validation errors file', async () => {
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                TaskType: WorkdayEnums.TaskType.UPLOAD,
                TaskStatus: WorkdayEnums.UploadStatus.VALIDATION_ERROR,
                CreatedBy: 1234,
                CreatedOnUTC: new Date(),
            } as any);
            (s3.getSignedUrlPromise as any).mockResolvedValue('mock-error-file-key');

            const status = await s.getStatus('mock-uuid');

            expect(status).toEqual({
                status: WorkdayEnums.UploadStatus.VALIDATION_ERROR,
                uuid: 'mock-uuid',
                url: 'mock-error-file-key',
            });
        });

        test('should handle erro when failing to get presigned url for excel validation errors file', async () => {
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                TaskType: WorkdayEnums.TaskType.UPLOAD,
                TaskStatus: WorkdayEnums.UploadStatus.VALIDATION_ERROR,
                CreatedBy: 1234,
                CreatedOnUTC: new Date(),
            } as any);
            (s3.getSignedUrlPromise as any).mockRejectedValue('mock-s3-exception');

            let e;
            try {
                await s.getStatus('mock-uuid');
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.AWS_IO_CALL_FAILED);
        });

        test('should handle DB error when fetching status from DB', async () => {
            jest.spyOn(repo, 'getMetadata').mockRejectedValue('mock-db-exception');

            let err: KfException;
            try {
                await s.getStatus('mock-uuid');
            } catch (e) {
                err = e;
            }

            expect(err.getStatus()).toEqual(500);
            expect(err.getExceptionCode()).toEqual(ec.GET_STATUS_METADATA_BY_UUID_FAILED);
        });
    });

    describe('isBucketExist', () => {
        test('should return true bucket exists', async () => {
            (s3.headBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve();
                },
            });

            const r = await s.isBucketExist('mock-bucket');

            expect(r).toEqual(true);
        });

        test('should return false if bucket does not exist', async () => {
            (s3.headBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.reject();
                },
            });

            const r = await s.isBucketExist('mock-bucket');

            expect(r).toEqual(false);
        });
    });

    describe('createBucketIfNotExist', () => {
        test('should create bucket if it does not exist', async () => {
            (s3.headBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.reject();
                },
            });
            (s3.createBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve(true);
                },
            });

            const r = await s.createBucketIfNotExist('mock-bucket');
            expect(r).toEqual(true);
        });

        test('should not create bucket if it already exist', async () => {
            (s3.headBucket as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve();
                },
            });

            let err;
            try {
                await s.createBucketIfNotExist('mock-bucket');
            } catch (e) {
                err = e;
            }

            expect(err).toBeUndefined();
        });
    });

    describe('signedUrlForUpload', () => {
        test('should return signed url for upload on S3', async () => {
            (s3.getSignedUrlPromise as any).mockResolvedValue('mock-presigned-upload-s3-key');

            const r = await s.signedUrlForUpload('mock-bucket', 'mock-s3-key', 30_000, 'mock-content-type');
            expect(r).toEqual('mock-presigned-upload-s3-key');
        });
    });

    describe('signedUrlForDownload', () => {
        test('should return signed url for downloading from S3', async () => {
            (s3.getSignedUrlPromise as any).mockResolvedValue('mock-presigned-download-s3-key');

            const r = await s.signedUrlForDownload('mock-bucket', 'mock-s3-key', 30_000);
            expect(r).toEqual('mock-presigned-download-s3-key');
        });
    });

    describe('publish', () => {
        test('should successfully publish to Workday staging tables', async () => {
            jest.spyOn(http, 'get').mockResolvedValue({ userid: '54321' });
            (s3.getObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve({
                        Body: JSON.stringify([
                            {
                                ClientID: 123,
                                SuccessProfileID: 1,
                                SuccessProfileName: 'mock-sp-name',
                                JobCode: 'mock-job-code',
                                JobProfileName: 'mock-job-name',
                                EffectiveDate: '5/6/2021',
                                LastPublishedDate: '1/1/2021',
                                ScheduleIntegration: 'Yes',
                            },
                        ]),
                    });
                },
            });
            jest.spyOn(repo, 'updateStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                CreatedOnUTC: new Date(),
                TaskType: WorkdayEnums.TaskType.UPLOAD,
                TaskStatus: WorkdayEnums.UploadStatus.JSON_READY,
            } as any);

            jest.spyOn(stagingDB, 'insertPostToWorkdayStatus').mockResolvedValue(123);
            jest.spyOn(stagingDB, 'insertPostToWorkday').mockResolvedValue({} as any);
            jest.spyOn(stagingDB, 'callLoadToWorkdayStagingProc').mockResolvedValue({} as any);

            const mockPayload: WorkdayInterfaces.PushDataBody = {
                fileUUID: 'mock-uuid',
                clientId: 12345,
                ts: Math.round((Date.now() + 1000) / 1000),
            };
            const r = await s.publish(mockPayload, 'mock-token');

            expect(r.status).toEqual(WorkdayEnums.UploadStatus.SUCCESS);
            expect(r.uuid).toEqual('mock-uuid');
        });

        test('should successfully publish to Workday staging tables', async () => {
            jest.spyOn(http, 'get').mockResolvedValue({ userid: '54321' });
            (s3.getObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve({
                        Body: JSON.stringify([
                            {
                                ClientID: 123,
                                SuccessProfileID: 1,
                                SuccessProfileName: 'mock-sp-name',
                                JobCode: 'mock-job-code',
                                JobProfileName: 'mock-job-name',
                                EffectiveDate: '5/6/2021',
                                LastPublishedDate: '1/1/2021',
                                ScheduleIntegration: 'Yes',
                            },
                        ]),
                    });
                },
            });
            jest.spyOn(repo, 'updateStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                CreatedOnUTC: new Date(),
                TaskType: WorkdayEnums.TaskType.UPLOAD,
                TaskStatus: WorkdayEnums.UploadStatus.JSON_READY,
            } as any);

            jest.spyOn(stagingDB, 'insertPostToWorkdayStatus').mockResolvedValue(123);
            jest.spyOn(stagingDB, 'insertPostToWorkday').mockResolvedValue({} as any);
            jest.spyOn(stagingDB, 'callLoadToWorkdayStagingProc').mockResolvedValue({} as any);

            jest.spyOn(s, 'updateStatus').mockImplementation(() => {
                throw new Error('Error');
            });

            const mockPayload: WorkdayInterfaces.PushDataBody = {
                fileUUID: 'mock-uuid',
                clientId: 12345,
                ts: Math.round((Date.now() + 1000) / 1000),
            };

            let e;
            try {
                const r = await s.publish(mockPayload, 'mock-token');
            } catch (err) {
                e = err;
            }

            expect(e).toBeDefined();
        });

        test('should return error if authtoken is not present', async () => {
            const mockPayload: WorkdayInterfaces.PushDataBody = {
                fileUUID: 'mock-uuid',
                clientId: 12345,
                ts: Math.round((Date.now() - 1000) / 1000),
            };

            let e;
            try {
                await s.publish(mockPayload, undefined);
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(400);
            expect(e.getExceptionCode()).toEqual(ec.INPUT_VALIDATION_FAILED);
        });

        test('should return error when ts is in the past', async () => {
            const mockPayload: WorkdayInterfaces.PushDataBody = {
                fileUUID: 'mock-uuid',
                clientId: 12345,
                ts: Math.round((Date.now() - 1000) / 1000),
            };

            let e;
            try {
                await s.publish(mockPayload, 'mock-token');
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(400);
            expect(e.getExceptionCode()).toEqual(ec.INPUT_VALIDATION_FAILED);
        });

        test('should return error if failed to get user id for provided auth token', async () => {
            jest.spyOn(http, 'get').mockResolvedValue({});

            const mockPayload: WorkdayInterfaces.PushDataBody = {
                fileUUID: 'mock-uuid',
                clientId: 12345,
                ts: Math.round((Date.now() + 1000) / 1000),
            };

            let e;
            try {
                await s.publish(mockPayload, 'mock-token');
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.INTERNAL_SERVER_ERROR);
        });

        test('should return error when task type is not upload', async () => {
            jest.spyOn(http, 'get').mockResolvedValue({ userid: '54321' });

            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                CreatedOnUTC: new Date(),
                TaskType: WorkdayEnums.TaskType.DOWNLOAD,
                TaskStatus: WorkdayEnums.UploadStatus.JSON_READY,
            } as any);

            const mockPayload: WorkdayInterfaces.PushDataBody = {
                fileUUID: 'mock-uuid',
                clientId: 12345,
                ts: Math.round((Date.now() + 1000) / 1000),
            };

            let e;
            try {
                await s.publish(mockPayload, 'mock-token');
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(400);
            expect(e.getExceptionCode()).toEqual(ec.WORKDAY_INVALID_STATUS_ERR);
        });

        test('should return error when task status is not JSON_READY', async () => {
            jest.spyOn(http, 'get').mockResolvedValue({ userid: '54321' });

            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                CreatedOnUTC: new Date(),
                TaskType: WorkdayEnums.TaskType.UPLOAD,
                TaskStatus: WorkdayEnums.UploadStatus.JSON_GENERATION_STARTED,
            } as any);

            const mockPayload: WorkdayInterfaces.PushDataBody = {
                fileUUID: 'mock-uuid',
                clientId: 12345,
                ts: Math.round((Date.now() + 1000) / 1000),
            };

            let e;
            try {
                await s.publish(mockPayload, 'mock-token');
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(400);
            expect(e.getExceptionCode()).toEqual(ec.WORKDAY_INVALID_STATUS_ERR);
        });

        test('should handle error when reading from S3', async () => {
            jest.spyOn(http, 'get').mockResolvedValue({ userid: '54321' });

            (s3.getObject as any).mockReturnValue({
                promise: () => {
                    return Promise.reject({});
                },
            });
            jest.spyOn(repo, 'updateStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                CreatedOnUTC: new Date(),
                TaskType: WorkdayEnums.TaskType.UPLOAD,
                TaskStatus: WorkdayEnums.UploadStatus.JSON_READY,
            } as any);

            const mockPayload: WorkdayInterfaces.PushDataBody = {
                fileUUID: 'mock-uuid',
                clientId: 12345,
                ts: Math.round((Date.now() + 1000) / 1000),
            };

            let e;
            try {
                await s.publish(mockPayload, 'mock-token');
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.AWS_IO_CALL_FAILED);
            expect(repo.updateStatus).toHaveBeenCalledWith('mock-uuid', WorkdayEnums.UploadStatus.UNKNOWN_ERROR);
        });

        test('should handle error when failed to parse data read from S3', async () => {
            jest.spyOn(http, 'get').mockResolvedValue({ userid: '54321' });

            (s3.getObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve({
                        Body: () => {}, // non parsable value
                    });
                },
            });
            jest.spyOn(repo, 'updateStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                CreatedOnUTC: new Date(),
                TaskType: WorkdayEnums.TaskType.UPLOAD,
                TaskStatus: WorkdayEnums.UploadStatus.JSON_READY,
            } as any);

            const mockPayload: WorkdayInterfaces.PushDataBody = {
                fileUUID: 'mock-uuid',
                clientId: 12345,
                ts: Math.round((Date.now() + 1000) / 1000),
            };

            let e;
            try {
                await s.publish(mockPayload, 'mock-token');
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.INTERNAL_SERVER_ERROR);
            expect(repo.updateStatus).toHaveBeenCalledWith('mock-uuid', WorkdayEnums.UploadStatus.UNKNOWN_ERROR);
        });

        test('should handle error when inserting Workday staging status', async () => {
            jest.spyOn(http, 'get').mockResolvedValue({ userid: '54321' });

            (s3.getObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve({
                        Body: JSON.stringify([
                            {
                                ClientID: 123,
                                SuccessProfileID: 1,
                                SuccessProfileName: 'mock-sp-name',
                                JobCode: 'mock-job-code',
                                JobProfileName: 'mock-job-name',
                                EffectiveDate: '5/6/2021',
                                LastPublishedDate: '1/1/2021',
                                ScheduleIntegration: 'Yes',
                            },
                        ]),
                    });
                },
            });
            jest.spyOn(repo, 'updateStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                CreatedOnUTC: new Date(),
                TaskType: WorkdayEnums.TaskType.UPLOAD,
                TaskStatus: WorkdayEnums.UploadStatus.JSON_READY,
            } as any);

            jest.spyOn(stagingDB, 'insertPostToWorkdayStatus').mockRejectedValue('mock-staging-insert-exception');

            const mockPayload: WorkdayInterfaces.PushDataBody = {
                fileUUID: 'mock-uuid',
                clientId: 12345,
                ts: Math.round((Date.now() + 1000) / 1000),
            };

            let e;
            try {
                await s.publish(mockPayload, 'mock-token');
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.INTERNAL_SERVER_ERROR);
            expect(repo.updateStatus).toHaveBeenCalledWith('mock-uuid', WorkdayEnums.UploadStatus.DB_STAGING_TABLE_ERROR);
        });

        test('should handle error when inserting rows into staging table', async () => {
            jest.spyOn(http, 'get').mockResolvedValue({ userid: '54321' });

            (s3.getObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve({
                        Body: JSON.stringify([
                            {
                                ClientID: 123,
                                SuccessProfileID: 1,
                                SuccessProfileName: 'mock-sp-name',
                                JobCode: 'mock-job-code',
                                JobProfileName: 'mock-job-name',
                                EffectiveDate: '5/6/2021',
                                LastPublishedDate: '1/1/2021',
                                ScheduleIntegration: 'Yes',
                            },
                        ]),
                    });
                },
            });
            jest.spyOn(repo, 'updateStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                CreatedOnUTC: new Date(),
                TaskType: WorkdayEnums.TaskType.UPLOAD,
                TaskStatus: WorkdayEnums.UploadStatus.JSON_READY,
            } as any);

            jest.spyOn(stagingDB, 'insertPostToWorkdayStatus').mockResolvedValue(123);
            jest.spyOn(stagingDB, 'insertPostToWorkday').mockRejectedValue('mock-instert-row-exception');

            const mockPayload: WorkdayInterfaces.PushDataBody = {
                fileUUID: 'mock-uuid',
                clientId: 12345,
                ts: Math.round((Date.now() + 1000) / 1000),
            };

            let e;
            try {
                await s.publish(mockPayload, 'mock-token');
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.INTERNAL_SERVER_ERROR);
            expect(repo.updateStatus).toHaveBeenCalledWith('mock-uuid', WorkdayEnums.UploadStatus.DB_STAGING_TABLE_ERROR);
        });

        test('should handle error when calling workday staging stored proc', async () => {
            jest.spyOn(http, 'get').mockResolvedValue({ userid: '54321' });

            (s3.getObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve({
                        Body: JSON.stringify([
                            {
                                ClientID: 123,
                                SuccessProfileID: 1,
                                SuccessProfileName: 'mock-sp-name',
                                JobCode: 'mock-job-code',
                                JobProfileName: 'mock-job-name',
                                EffectiveDate: '5/6/2021',
                                LastPublishedDate: '1/1/2021',
                                ScheduleIntegration: 'Yes',
                            },
                        ]),
                    });
                },
            });
            jest.spyOn(repo, 'updateStatus').mockResolvedValue({} as any);
            jest.spyOn(repo, 'getMetadata').mockResolvedValue({
                CreatedOnUTC: new Date(),
                TaskType: WorkdayEnums.TaskType.UPLOAD,
                TaskStatus: WorkdayEnums.UploadStatus.JSON_READY,
            } as any);

            jest.spyOn(stagingDB, 'insertPostToWorkdayStatus').mockResolvedValue(123);
            jest.spyOn(stagingDB, 'insertPostToWorkday').mockResolvedValue({} as any);
            jest.spyOn(stagingDB, 'callLoadToWorkdayStagingProc').mockRejectedValue('mock-stored-proc-exception');

            const mockPayload: WorkdayInterfaces.PushDataBody = {
                fileUUID: 'mock-uuid',
                clientId: 12345,
                ts: Math.round((Date.now() + 1000) / 1000),
            };

            let e;
            try {
                await s.publish(mockPayload, 'mock-token');
            } catch (err) {
                e = err;
            }

            expect(e.getStatus()).toEqual(500);
            expect(e.getExceptionCode()).toEqual(ec.INTERNAL_SERVER_ERROR);
            expect(repo.updateStatus).toHaveBeenCalledWith('mock-uuid', WorkdayEnums.UploadStatus.DB_STAGING_TABLE_ERROR);
        });

        test('should throw an error while reading data from S3 when data.Body doesn`t exist', async () => {
            jest.spyOn(http, 'get').mockResolvedValue({ userid: '54321' });

            (s3.getObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve({});
                },
            });

            const s3Key = 's3Key';

            let e;
            try {
                await s.readDataFromS3(s3Key);
            } catch (err) {
                e = err;
            }

            expect(e).toBeDefined();
        });
    });
});
