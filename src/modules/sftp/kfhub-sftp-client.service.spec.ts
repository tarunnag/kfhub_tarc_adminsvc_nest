import { KfHubSftpClientService } from './kfhub-sftp-client.service';
import { Test, TestingModule } from '@nestjs/testing';

const mocks = {
    connect: jest.fn().mockResolvedValue(''),
    mkdir: jest.fn().mockResolvedValue(''),
    put: jest.fn().mockResolvedValue(''),
    end: jest.fn().mockResolvedValue(''),
};

jest.mock('ssh2-sftp-client', () => {
    return jest.fn().mockImplementation(() => {
        return mocks;
    });
});

describe('KfHubSftpClientService', () => {
    let module: TestingModule;
    let service: KfHubSftpClientService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [KfHubSftpClientService],
        }).compile();

        service = module.get(KfHubSftpClientService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('pathFiller', () => {
        test('should replace {date} template phrase by 2021-11-02 12_33_00', () => {
            // Arrange
            const currentDate = new Date('2021-11-02T12:33:00.315Z');
            const realDate = Date;
            global.Date = class extends Date {
                constructor(args) {
                    if (args?.length > 0) {
                        // eslint-disable-next-line constructor-super, no-constructor-return
                        super(args);
                    }

                    // eslint-disable-next-line no-constructor-return
                    return currentDate;
                }
            } as any;

            // Act
            const result = service.pathFiller('/tmp/{date}/test.txt');

            // Assert
            expect(result).toEqual('/tmp/2021-11-02_12-33-00/test.txt');

            // CleanUp
            global.Date = realDate;
        });

        test('should replace {id} and {name} templates by 123 and testName', () => {
            // Act
            const result = service.pathFiller('/tmp/{id}/{name}.txt', { name: 'testName', id: 123, fake: 'should not be used' });

            // Assert
            expect(result).toEqual('/tmp/123/testName.txt');
        });
    });

    describe('put', () => {
        Object.keys(mocks).forEach((method) => {
            test(`should throw error if ${method} failed`, async () => {
                // Arrange
                const implementation = mocks[method];
                mocks[method] = jest.fn().mockImplementationOnce(() => {
                    throw new Error();
                });
                let err;

                // Act
                try {
                    await service.put(Buffer.from('test'), {}, '');
                } catch (e) {
                    err = e;
                }

                // Assert
                expect(err).toBeDefined();

                // CleanUp
                mocks[method] = implementation;
            });
        });

        test('should call sftp methods with parameters', async () => {
            // Arrange
            const buffer = Buffer.from('test');
            const credentials = {
                username: '123',
                password: '321',
            };
            const path = '/a/b/c.d';

            // Act
            await service.put(buffer, credentials, path);

            // Assert
            expect(mocks.connect).toHaveBeenCalledWith(credentials);
            expect(mocks.mkdir).toHaveBeenCalledWith(path.split('/').slice(0, -1).join('/'), true);
            expect(mocks.put).toHaveBeenCalledWith(buffer, path);
            expect(mocks.end).toHaveBeenCalled();
        });
    });
});
