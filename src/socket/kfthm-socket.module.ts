import { Module } from '@nestjs/common';
import { KfThmSocketsGateway } from './kfthm-socket.gateway';
import { KfThmSocketsService } from './kfthm-socket.service';
@Module({
    imports: [],
    providers: [KfThmSocketsGateway, KfThmSocketsService],
    controllers: [],
})
export class KfThmSocketModule {}
