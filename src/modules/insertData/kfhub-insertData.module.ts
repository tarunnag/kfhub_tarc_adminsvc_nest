import { Module } from '@nestjs/common';
import { KfThmInsertDataService } from './kfhub-insertData.service';
import { KfThmInsertDataController } from './kfhub-insertData.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KfThmInsertDataRepository } from './kfhub-insertData.repository';
import { KfThmStatusRepository } from '../status/status.repository';

@Module({
    imports: [TypeOrmModule.forFeature([KfThmInsertDataRepository, KfThmStatusRepository]), KfThmInsertDataModule],
    providers: [KfThmInsertDataService],
    controllers: [KfThmInsertDataController],
})
export class KfThmInsertDataModule {}
