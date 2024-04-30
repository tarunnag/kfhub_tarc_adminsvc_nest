import { Module } from '@nestjs/common';
import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';
import { RequestFactory } from '../../common/request-factory';

@Module({
    imports: [BannersModule],
    providers: [RequestFactory, KfConfigService, BannersService],
    controllers: [BannersController],
})
export class BannersModule {}
