import { Module } from '@nestjs/common';
import { KfThmClientsController } from './kfthm-clients.controller';
import { KfThmClientsService } from './kfthm-clients.service';

@Module({
    imports: [KfThmClientsModule],
    providers: [KfThmClientsService],
    controllers: [KfThmClientsController],
})
export class KfThmClientsModule {}
