import { Test, TestingModule } from '@nestjs/testing';
import { KfThmUploadStatusService } from './kfhub-uploadStatus.service';
import { KfThmStatusRepository } from '../status/status.repository';
import { KfThmUploadStatusRepository } from './kfhub-uploadStatus.repository';
import { KfThmSocketsService } from '../../socket/kfthm-socket.service';
import { jsonToExcel, s3 } from './../../common/common.utils';
import { KfThmStatusEntity } from '../status/status.entity';
import { Common } from '../../common/common.interface';
const { BucketDetails, BUCKET } = Common.Enum;

jest.mock('./../../common/common.utils');
class MockLogger {
    log(msg: string) {}
    warn(msg: string) {}
    error(msg: string) {}
}

describe('UploadStatus service', () => {
    let uploadStatusService: KfThmUploadStatusService;
    let statusRepository: KfThmStatusRepository;
    let uploadStatusRepository: KfThmUploadStatusRepository;
    let socketService: KfThmSocketsService;
    let mockLogger: MockLogger = new MockLogger();
    let module: TestingModule;

    mockLogger.log = jest.fn();

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [KfThmUploadStatusService, KfThmStatusRepository, KfThmUploadStatusRepository, KfThmSocketsService],
        }).compile();

        uploadStatusService = module.get<KfThmUploadStatusService>(KfThmUploadStatusService);
        statusRepository = module.get<KfThmStatusRepository>(KfThmStatusRepository);
        uploadStatusRepository = module.get<KfThmUploadStatusRepository>(KfThmUploadStatusRepository);
        socketService = module.get<KfThmSocketsService>(KfThmSocketsService);

        module.useLogger(mockLogger);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getStatus', () => {
        test('should return status', async () => {
            jest.spyOn(statusRepository, 'getMetadata').mockResolvedValue('mock-metadata' as any);

            const result = await uploadStatusService.getStatus({ fileUUID: 'some-test-uuid' });

            expect(result).toEqual('mock-metadata');
        });

        test('should throw error', async () => {
            jest.spyOn(statusRepository, 'getMetadata').mockImplementation(() => {
                throw new Error('mock-error');
            });

            let error: any = {};
            try {
                await uploadStatusService.getStatus({ fileUUID: 'some-test-uuid' });
            } catch (e) {
                error = e;
            }

            expect(error).not.toBeNull();
            expect(error.message).toEqual('mock-error');
        });
    });

    describe('createStatus', () => {
        test('should return fileUUID on success', async () => {
            jest.spyOn(socketService, 'emitToClient').mockReturnValue();
            jest.spyOn(statusRepository, 'updateStatus').mockResolvedValue({} as any);
            jest.spyOn(uploadStatusService, 'getStatus').mockResolvedValueOnce({
                ProfileUploadFromEmpPayDataStatusID: 'ProfileUploadFromEmpPayDataStatusID',
                ProfileUploadStatusID: 1,
                ClientId: 123,
                CreatedOn: new Date(),
                CreateBy: 321,
            } as KfThmStatusEntity);

            const query = { fileUUID: 'test-file-uuid', processStatus: 1 };
            const result = await uploadStatusService.createStatus(query);

            expect(result).toEqual({ fileUUID: 'test-file-uuid' });
        });
/*
        test('should return fileUUID on success if processingStatus is 3', async () => {
            jest.spyOn(socketService, 'emitToClient').mockReturnValue();
            jest.spyOn(statusRepository, 'updateStatus').mockResolvedValue({} as any);
            jest.spyOn(uploadStatusRepository, 'getMapping').mockResolvedValue([{ AssociatedSuccessProfile: 'some-data' }]);
            jest.spyOn(uploadStatusService, 'getStatus').mockResolvedValueOnce({
                ProfileUploadFromEmpPayDataStatusID: 'ProfileUploadFromEmpPayDataStatusID',
                ProfileUploadStatusID: 1,
                CreatedOn: new Date(),
                CreateBy: 321,
            } as KfThmStatusEntity);

            (jsonToExcel as any).mockReturnValue([]);
            (s3.upload as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve();
                },
            });
            const dateNow = Date.now;
            Date.now = jest.fn(() => 1487076708000);

            jest.spyOn(uploadStatusService, 'constructPath').mockReturnValue(`${BucketDetails.THM}/test-file-uuid/${BucketDetails.FILE_MAPPED_SUCCESS}/${Date.now()}${BucketDetails.MAPPED_STATS_XLSX}`);
            const query = { fileUUID: 'test-file-uuid', processStatus: 3 };
            const result = await uploadStatusService.createStatus(query);

            expect(result).toEqual({ fileUUID: 'test-file-uuid' });
            expect(s3.upload).toHaveBeenCalledWith({
                Bucket: BUCKET,
                Key: `${BucketDetails.THM}/test-file-uuid/${BucketDetails.FILE_MAPPED_SUCCESS}/${Date.now()}${BucketDetails.MAPPED_STATS_XLSX}`,
                Body: jsonToExcel([{ AssociatedSuccessProfile: 'some-data' }]),
            });
            Date.now = dateNow;
        });

        test('should return fileUUID if processingStatus is 3 and there are unmapped profiles', async () => {
            jest.spyOn(socketService, 'emitToClient').mockReturnValue();
            jest.spyOn(statusRepository, 'updateStatus').mockResolvedValue({} as any);
            jest.spyOn(uploadStatusRepository, 'getMapping').mockResolvedValue([{ AssociatedSuccessProfile: null, pams_id: 123 }]);
            jest.spyOn(uploadStatusService, 'getStatus').mockResolvedValueOnce({
                ProfileUploadFromEmpPayDataStatusID: 'ProfileUploadFromEmpPayDataStatusID',
                ProfileUploadStatusID: 1,
                ClientId: 123,
                CreatedOn: new Date(),
                CreateBy: 321,
            } as KfThmStatusEntity);

            (jsonToExcel as any).mockReturnValue([]);
            (s3.upload as any).mockReturnValue({
                promise: () => {
                    return Promise.resolve();
                },
            });

            const dateNow = Date.now;
            Date.now = jest.fn(() => 1487076708000);
            jest.spyOn(uploadStatusService, 'constructPath').mockReturnValue(`${BucketDetails.THM}/123/test-file-uuid/${BucketDetails.FILE_MAPPED_FAILED}/${Date.now()}${BucketDetails.MAPPED_STATS_XLSX}`);

            const query = { fileUUID: 'test-file-uuid', processStatus: 3 };
            const result = await uploadStatusService.createStatus(query);

            expect(result).toEqual({ fileUUID: 'test-file-uuid' });
            expect(s3.upload).toHaveBeenCalledWith({
                Bucket: BUCKET,
                Key: `${BucketDetails.THM}/123/test-file-uuid/${BucketDetails.FILE_MAPPED_FAILED}/${Date.now()}${BucketDetails.MAPPED_STATS_XLSX}`,
                Body: jsonToExcel([{ AssociatedSuccessProfile: null }]),
            });
            Date.now = dateNow;
        });
*/
        test('should throw error while creating status', async () => {
            const query = { fileUUID: 'test567', processStatus: 400 };
            jest.spyOn(socketService, 'emitToClient').mockImplementation(() => {
                throw new Error('Error');
            });
            let err;
            try {
                const result = await uploadStatusService.createStatus(query);
            } catch (e) {
                err = e;
            }

            expect(err).toBeDefined();
        });
    });
});
