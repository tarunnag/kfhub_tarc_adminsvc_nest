import { Module } from '@nestjs/common';
import { KfThmSignUrlController } from './kfthm-signUrl.controller';
import { KfThmSignUrlService } from './kfthm-signUrl.service';
import { KfThmSocketsService } from '../../socket/kfthm-socket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KfThmStatusRepository } from '../status/status.repository';

@Module({
    imports: [TypeOrmModule.forFeature([KfThmStatusRepository]), KfThmSignUrlModule],
    providers: [KfThmSignUrlService, KfThmSocketsService],
    controllers: [KfThmSignUrlController],
})
export class KfThmSignUrlModule {}
