import { Module } from '@nestjs/common';
import { KfThmPushDataService } from './kfhub-pushData.service';
import { KfThmPushDataController } from './kfhub-pushData.controller';

@Module({
    imports: [KfThmPushDataModule],
    providers: [KfThmPushDataService],
    controllers: [KfThmPushDataController],
})
export class KfThmPushDataModule {}
