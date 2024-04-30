import { Test, TestingModule } from '@nestjs/testing';
import { KfThmSocketsGateway } from './kfthm-socket.gateway';
import { KfThmSocketsService } from './kfthm-socket.service';

class MockLogger {
    log(msg: string) {}
    warn(msg: string) {}
    error(msg: string) {}
}

describe('KfThmSocketsGateway', () => {
    let socketGateway: KfThmSocketsGateway;
    let socketsService: KfThmSocketsService;
    let mockLogger: MockLogger = new MockLogger();
    let module: TestingModule;

    mockLogger.log = jest.fn();

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [KfThmSocketsGateway, KfThmSocketsService],
        }).compile();

        socketGateway = module.get<KfThmSocketsGateway>(KfThmSocketsGateway);
        socketsService = module.get<KfThmSocketsService>(KfThmSocketsService);

        module.useLogger(mockLogger);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('afterInit', () => {
        test('should update service instance', () => {
            const mockSocketService: any = {
                updateServerInstance: jest.fn(),
            };
            const s = new KfThmSocketsGateway(mockSocketService);

            s.afterInit({} as any);

            expect(mockLogger.log).toHaveBeenCalledWith('web socket initialized!', 'KfTHMGateway');
            expect(mockSocketService.updateServerInstance).toHaveBeenCalled();
        });
    });

    describe('handleConnection', () => {
        const mockSocketService: any = {
            addClient: jest.fn(),
        };
        const s = new KfThmSocketsGateway(mockSocketService);

        test('should connect and add socket', () => {
            const mockSocket: any = {
                id: 'mock-socket-id',
                handshake: {
                    query: {
                        loggedInUserClientId: '123',
                    },
                },
            };

            s.handleConnection(mockSocket);

            expect(mockLogger.log).toHaveBeenCalledWith('socket connected!', 'mock-socket-id', 'KfTHMGateway');
            expect(mockSocketService.addClient).toHaveBeenCalledWith(123, 'mock-socket-id');
        });

        test('should handle missing loggedInUserClientId', () => {
            const mockSocket: any = {
                id: 'mock-socket-id',
                handshake: {
                    query: {},
                },
            };

            s.handleConnection(mockSocket);

            expect(mockLogger.log).toHaveBeenCalledWith('loggedInUserClientId not passed', 'KfTHMGateway');
            expect(mockSocketService.addClient).not.toHaveBeenCalled();
        });
    });

    describe('handleDisconnect', () => {
        test('should disconnect client', () => {
            const mockSocketService: any = {
                removeClient: jest.fn(),
            };
            const s = new KfThmSocketsGateway(mockSocketService);

            s.handleDisconnect({ id: 'mock-client-id' } as any);

            expect(mockLogger.log).toHaveBeenCalledWith('client disconnected!', 'mock-client-id', 'KfTHMGateway');
            expect(mockSocketService.removeClient).toHaveBeenCalledWith('mock-client-id');
        });
    });
});
