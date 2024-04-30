import { Module } from '@nestjs/common';
import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';
import { KfThmSuccessprofileController } from './kfthm-successprofile.controller';
import { KfThmSuccessprofileService } from './kfthm-successprofile.service';
import { SpMssqlService } from './kfthm-successprofile-mssql.service';

@Module({
    imports: [KfThmSuccessprofileModule],
    providers: [KfThmSuccessprofileService, KfConfigService, SpMssqlService],
    controllers: [KfThmSuccessprofileController],
})
export class KfThmSuccessprofileModule {}
