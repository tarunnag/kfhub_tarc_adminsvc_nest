import { Test, TestingModule } from '@nestjs/testing';
import { KfThmInsertDataService } from './kfhub-insertData.service';
import { KfThmInsertDataRepository } from './kfhub-insertData.repository';
import { KfThmStatusRepository } from '../status/status.repository';
import { s3 } from './../../common/common.utils';
import { Common } from '../../common/common.interface';

jest.mock('./../../common/common.utils');

describe('KfThmInsertDataService service', () => {
    let insertDataService: KfThmInsertDataService;
    let insertDataRepository: KfThmInsertDataRepository;
    let statusRepository: KfThmStatusRepository;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [KfThmInsertDataService, KfThmInsertDataRepository, KfThmStatusRepository],
        }).compile();

        insertDataService = module.get<KfThmInsertDataService>(KfThmInsertDataService);
        insertDataRepository = module.get<KfThmInsertDataRepository>(KfThmInsertDataRepository);
        statusRepository = module.get<KfThmStatusRepository>(KfThmStatusRepository);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('insertData', () => {
        test('should insert file', async () => {
            jest.spyOn(statusRepository, 'getMetadata').mockResolvedValue('mock-metadata' as any);
            jest.spyOn(insertDataRepository, 'insertBulkData').mockResolvedValue({} as any);
            jest.spyOn(insertDataService, 'getFile').mockResolvedValueOnce([{}, {}] as any);

            const body: any = {
                fileKey: 'test-file-key',
            };
            const result = {};

            const res = await insertDataService.insertData(body, {} as any);

            expect(res).toEqual(result);
        });

        test('should throw exception when getFile is failed', async () => {
            jest.spyOn(insertDataService, 'getFile').mockRejectedValueOnce('Failed');
            let err;
            try {
                await insertDataService.insertData(
                    {
                        fileKey: 'mock-file-key',
                        fileUUID: 'mock-file-uuid',
                    },
                    {
                        loggedInUserClientId: 1,
                        userId: 1,
                        locale: 'en',
                        clientId: 1,
                        lcid: 'en',
                    },
                );
            } catch (e) {
                err = e;
            }
            expect(err).toBeDefined();
        });
        test('should throw exception when divideInChunks is failed', async () => {
            jest.spyOn(insertDataService, 'getFile').mockResolvedValueOnce([{}, {}] as any);
            jest.spyOn(insertDataService as any, 'divideInChunks').mockReturnValue('Failed');
            let err;
            try {
                await insertDataService.insertData(
                    {
                        fileKey: 'mock-file-key',
                        fileUUID: 'mock-file-uuid',
                    },
                    {
                        loggedInUserClientId: 1,
                        userId: 1,
                        locale: 'en',
                        clientId: 1,
                        lcid: 'en',
                    },
                );
            } catch (e) {
                err = e;
            }
            expect(err).toBeDefined();
        });

        test('should throw exception when getMetadata is failed', async () => {
            jest.spyOn(insertDataService, 'getFile').mockResolvedValueOnce([{}, {}] as any);

            jest.spyOn(statusRepository, 'getMetadata').mockRejectedValueOnce('Failed');
            let err;
            try {
                await insertDataService.insertData(
                    {
                        fileKey: '1',
                        fileUUID: '1',
                    },
                    {
                        loggedInUserClientId: 1,
                        userId: 1,
                        locale: 'en',
                        clientId: 1,
                        lcid: 'en',
                    },
                );
            } catch (e) {
                err = e;
            }
            expect(err).toBeDefined();
        });

        test('should throw exception when insertBulkData is failed', async () => {
            jest.spyOn(insertDataService, 'getFile').mockResolvedValueOnce([{}, {}] as any);

            jest.spyOn(insertDataRepository, 'insertBulkData').mockRejectedValueOnce('Failed');
            let err;
            try {
                await insertDataService.insertData(
                    {
                        fileKey: '1',
                        fileUUID: '1',
                    },
                    {
                        loggedInUserClientId: 1,
                        userId: 1,
                        locale: 'en',
                        clientId: 1,
                        lcid: 'en',
                    },
                );
            } catch (e) {
                err = e;
            }
            expect(err).toBeDefined();
        });
    });
    describe('getFile', () => {
        test('should get file from s3 and parse it to json', async () => {
            (s3.getObject as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve({
                        Body: '[{},{}]',
                    });
                },
            });

            const body: any = {
                fileKey: 'test-file-key',
            };

            const getObjectRequest = {
                Bucket: Common.Enum.BUCKET,
                Key: body.fileKey,
            };

            const result = [{}, {}];

            const res = await insertDataService.getFile(body.fileKey);
            expect(s3.getObject).toHaveBeenCalledWith(getObjectRequest);
            expect(res).toEqual(result);
        });
    });

    describe('divideInChunks', () => {
        test('should insert file when lastElement.length equals to chunkSize', async () => {
            const metadata = 'mock-metadata';
            jest.spyOn(statusRepository, 'getMetadata').mockResolvedValue(metadata as any);
            jest.spyOn(insertDataRepository, 'insertBulkData').mockResolvedValue({} as any);
            const getFileResult = [[]];
            for (let i = 0; i < 100; i++) {
                getFileResult.push([]);
            }
            jest.spyOn(insertDataService, 'getFile').mockResolvedValueOnce(getFileResult as any);

            const body: any = {
                fileKey: 'test-file-key',
            };

            const result = {};
            const res = await insertDataService.insertData(body, {} as any);
            expect(res).toEqual(result);
        });
    });
});
