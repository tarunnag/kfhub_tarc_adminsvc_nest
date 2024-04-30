import { Test, TestingModule } from '@nestjs/testing';
import { KfThmSignUrlService } from './kfthm-signUrl.service';
import { KfThmStatusRepository } from '../status/status.repository';
import { KfThmSocketsService } from '../../socket/kfthm-socket.service';

jest.mock('./../../common/common.utils');
import { s3 } from './../../common/common.utils';

describe('KfThmSignUrlService', () => {
    let signUrlService: KfThmSignUrlService;
    let statusRepository: KfThmStatusRepository;
    let socketService: KfThmSocketsService;
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [KfThmSignUrlService, KfThmSocketsService, KfThmStatusRepository],
        }).compile();

        signUrlService = module.get<KfThmSignUrlService>(KfThmSignUrlService);
        statusRepository = module.get<KfThmStatusRepository>(KfThmStatusRepository);
        socketService = module.get<KfThmSocketsService>(KfThmSocketsService);
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

        test('should return url for statuses 1, 2, 3, 4, 5', async () => {
            for (let status of ['1', '2', '3', '4', '5']) {
                // Arrange
                const getMetadataSpy = jest.spyOn(statusRepository, 'getMetadata').mockResolvedValue({
                    ClientId: 12345,
                } as any);
                const listObjectsV2Spy = jest.spyOn(s3, 'listObjectsV2');

                const query: any = {
                    status,
                    fileUUID: 'test-file-uuid',
                };
                const result = { url: 'mock-signed-url' };

                // Act
                const res = await signUrlService.getSignedUrlForDownload(query);

                // Assert
                expect(res).toEqual(result);
                expect(getMetadataSpy).toHaveBeenCalledWith('test-file-uuid');
                expect(listObjectsV2Spy).toHaveBeenCalledWith({
                    Bucket: expect.anything(),
                    Delimiter: '/',
                    Prefix: 'THManagement/12345/test-file-uuid/file_upload/',
                });
            }
        });

        test('should throw error while trying to get signed url for download', async () => {
            const query: any = { status: '1', fileUUID: 'test-file-uuid' };

            let err;

            try {
                await signUrlService.getSignedUrlForDownload(query);
            } catch (e) {
                err = e;
            }

            expect(err).toBeDefined();
        });
    });

    describe('getSignedUrlForUpload', () => {
        test('should return url', async () => {
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
            (s3.getSignedUrlPromise as any).mockResolvedValue('mock-signed-url');
            jest.spyOn(statusRepository, 'createStatus').mockResolvedValue({} as any);
            jest.spyOn(socketService, 'addUuidToClientSocketTable').mockReturnValue();

            const query: any = {
                loggedInUserClientId: 123,
                userId: 321,
            };

            const resultUrl = 'mock-signed-url';
            const res = await signUrlService.getSignedUrlForUpload(query);

            expect(res.url).toEqual(resultUrl);
            expect(res.uuid).toBeDefined();
        });
    });

    test('should throw error while trying to get signed url for upload', async () => {
        const query: any = {
            loggedInUserClientId: 123,
            userId: 321,
            locale: 'en',
            clientId: 1,
        };

        let err;

        try {
            await signUrlService.getSignedUrlForUpload(query);
        } catch (e) {
            err = e;
        }

        expect(err).toBeDefined();
    });
});
