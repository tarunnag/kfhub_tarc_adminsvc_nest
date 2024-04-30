import { Injectable, Logger } from '@nestjs/common';
import { Clients, EVENTS } from './kfthm-socket.interface';
import { Socket, Server } from 'socket.io';
import { Common } from '../common/common.interface';

let clients: Clients[] = [];
let io: Server;
@Injectable()
export class KfThmSocketsService {
    private logger: Logger = new Logger('websocketService');

    addClient(loggedInUserClientId: number, socketId: string) {
        const index = clients.findIndex((o) => o.loggedInUserClientId === loggedInUserClientId);

        if (index === -1) {
            clients.push({
                loggedInUserClientId,
                socketId,
            });
        } else {
            clients[index].socketId = socketId;
        }

        this.logger.log(`no.of clients:${clients.length}`);
    }

    removeClient(socketId: string) {
        clients = clients.filter((data) => data.socketId !== socketId);

        this.logger.log(`no.of clients:${clients.length}`);
    }

    emitToClient(data: Common.Query.UpsertUploadStatus) {
        const clientSocket = clients.find((o) => o.fileUUID === data.fileUUID);

        if (!clientSocket) {
            return this.logger.log(`no socket is associated with ${data.fileUUID} uuid`);
        }

        const { socketId } = clientSocket;

        io.sockets.sockets[socketId].emit(EVENTS.STATUS, data.processStatus);
    }

    addUuidToClientSocketTable(loggedInUserClientId, uuid) {
        const index = clients.findIndex((o) => o.loggedInUserClientId === +loggedInUserClientId);

        if (index !== -1) {
            clients[index].fileUUID = uuid;

            return this.logger.log(`updated client with uuid`, uuid);
        }

        this.logger.log(`couldn't find client to update with ${loggedInUserClientId}`);
    }

    updateServerInstance(server: Server) {
        io = server;
    }
}
