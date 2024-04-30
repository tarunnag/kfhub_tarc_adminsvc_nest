import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KfHubLanguagesController } from './kfhub-languages.controller';
import { KfHubLanguagesRepository } from './kfhub-languages.repository';
import { KfHubLanguagesService } from './kfhub-languages.service';

@Module({
    imports: [KfHubLanguagesModule, TypeOrmModule.forFeature([KfHubLanguagesRepository])],
    controllers: [KfHubLanguagesController],
    providers: [KfHubLanguagesService],
})
export class KfHubLanguagesModule {}
