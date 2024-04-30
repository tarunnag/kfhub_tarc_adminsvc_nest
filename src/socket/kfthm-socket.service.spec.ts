import { Test, TestingModule } from '@nestjs/testing';
import { KfThmSocketsService } from './kfthm-socket.service';
import { EVENTS } from './kfthm-socket.interface';

class MockLogger {
    log(msg: string) {}
    warn(msg: string) {}
    error(msg: string) {}
}

describe('Socket service', () => {
    let socketsService: KfThmSocketsService;
    let mockLogger: MockLogger = new MockLogger();
    let module: TestingModule;

    mockLogger.log = jest.fn();

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [KfThmSocketsService],
        }).compile();

        socketsService = module.get<KfThmSocketsService>(KfThmSocketsService);

        module.useLogger(mockLogger);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should initialize without errors', () => {
        let ss = null;
        let err = null;

        try {
            ss = new KfThmSocketsService();
        } catch (e) {
            err = e;
        }

        expect(err).toBeNull();
        expect(ss).not.toBeNull();
    });

    test('should add and remove client to empty list of clients', () => {
        socketsService.addClient(1, 'test-socket-id-1');
        expect(mockLogger.log).toHaveBeenCalledWith('no.of clients:1', 'websocketService');

        socketsService.removeClient('test-socket-id-1');
        expect(mockLogger.log).toHaveBeenCalledWith('no.of clients:0', 'websocketService');
    });

    test('should add client to non-empty list of clients', () => {
        socketsService.addClient(1, 'test-socket-id-1');
        expect(mockLogger.log).toHaveBeenCalledWith('no.of clients:1', 'websocketService');

        socketsService.addClient(2, 'test-socket-id-2');
        expect(mockLogger.log).toHaveBeenCalledWith('no.of clients:2', 'websocketService');

        socketsService.removeClient('test-socket-id-1');
        socketsService.removeClient('test-socket-id-2');
        expect(mockLogger.log).toHaveBeenCalledWith('no.of clients:0', 'websocketService');
    });

    test('should update client in the list of clients', () => {
        socketsService.addClient(3, 'test-socket-id-3');
        expect(mockLogger.log).toHaveBeenCalledWith('no.of clients:1', 'websocketService');

        socketsService.addClient(3, 'test-socket-id-3a');
        expect(mockLogger.log).toHaveBeenCalledWith('no.of clients:1', 'websocketService');

        socketsService.removeClient('test-socket-id-3a');
        expect(mockLogger.log).toHaveBeenCalledWith('no.of clients:0', 'websocketService');
    });

    test('should handle emitting event to not-existing client', () => {
        // const ss = new KfThmSocketsService();

        socketsService.emitToClient({ fileUUID: 'non-existing-UUID' } as any);
        expect(mockLogger.log).toHaveBeenCalledWith('no socket is associated with non-existing-UUID uuid', 'websocketService');
    });

    test('should try adding UUID to non-existing client', () => {
        // const ss = new KfThmSocketsService();

        socketsService.addUuidToClientSocketTable(1, 'test-uuid');
        expect(mockLogger.log).toHaveBeenCalledWith("couldn't find client to update with 1", 'websocketService');
    });

    test('should add UUID to connected client', () => {
        // const ss = new KfThmSocketsService();

        socketsService.addClient(1, 'test-socket-id-1');
        expect(mockLogger.log).toHaveBeenCalled();
        socketsService.addUuidToClientSocketTable(1, 'test-uuid');
        expect(mockLogger.log).toHaveBeenCalledWith('updated client with uuid', 'test-uuid', 'websocketService');
        socketsService.removeClient('test-socket-id-1');
    });

    test('should emit event to connected client', () => {
        // const ss = new KfThmSocketsService();

        socketsService.addClient(1, 'test-socket-id-1');

        const mockIOServer = {
            sockets: {
                sockets: {
                    'test-socket-id-1': {
                        emit: jest.fn(),
                    },
                },
            },
        };

        socketsService.updateServerInstance(mockIOServer as any);

        socketsService.addClient(1, 'test-socket-id-1');
        socketsService.addUuidToClientSocketTable(1, 'test-uuid-1');

        socketsService.emitToClient({ fileUUID: 'test-uuid-1', processStatus: 'test-process-status' } as any);
        expect(mockIOServer.sockets.sockets['test-socket-id-1'].emit).toHaveBeenCalledWith(EVENTS.STATUS, 'test-process-status');
    });
});
