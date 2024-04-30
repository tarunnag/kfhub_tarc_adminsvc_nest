import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WsResponse, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger, Next } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { KfThmSocketsService } from './kfthm-socket.service';

@WebSocketGateway()
export class KfThmSocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private service: KfThmSocketsService) {}

    private logger: Logger = new Logger('KfTHMGateway');

    afterInit(server: Server) {
        this.logger.log('web socket initialized!');

        this.service.updateServerInstance(server);
    }

    handleConnection(socket: Socket) {
        const loggedInUserClientId = +socket.handshake.query.loggedInUserClientId;

        if (!loggedInUserClientId) {
            this.logger.log('loggedInUserClientId not passed');
        } else {
            this.logger.log('socket connected!', socket.id);

            this.service.addClient(loggedInUserClientId, socket.id);
        }
    }

    handleDisconnect(client: Socket) {
        this.service.removeClient(client.id);

        this.logger.log('client disconnected!', client.id);
    }
}
