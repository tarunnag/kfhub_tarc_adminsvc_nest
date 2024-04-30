import { Module } from '@nestjs/common';
import { KfThmUploadStatusController } from './kfhub-uploadStatus.controller';
import { KfThmUploadStatusService } from './kfhub-uploadStatus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KfThmUploadStatusRepository } from './kfhub-uploadStatus.repository';
import { KfThmSocketsService } from '../../socket/kfthm-socket.service';
import { KfThmStatusRepository } from '../status/status.repository';

@Module({
    imports: [TypeOrmModule.forFeature([KfThmUploadStatusRepository, KfThmStatusRepository]), KfThmUploadStatusModule],
    providers: [KfThmUploadStatusService, KfThmSocketsService],
    controllers: [KfThmUploadStatusController],
})
export class KfThmUploadStatusModule {}
