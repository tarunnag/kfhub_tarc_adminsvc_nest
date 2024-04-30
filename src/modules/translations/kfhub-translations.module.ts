import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsConnectionService } from './cms-connection.service';
import { KfHubTranslationsRepository } from './kfhub-translations.repository';
import { KfHubTranslationsController } from './kfhub-translations.controller';
import { KfHubTranslationsService } from './kfhub-translations.service';
import { KfHubUpdateTranslationsService } from './kfhub-update-translations.service';

@Module({
    imports: [KfHubTranslationsModule, TypeOrmModule.forFeature([KfHubTranslationsRepository])],
    controllers: [KfHubTranslationsController],
    providers: [KfHubTranslationsService, CmsConnectionService, KfHubUpdateTranslationsService],
})
export class KfHubTranslationsModule {}
