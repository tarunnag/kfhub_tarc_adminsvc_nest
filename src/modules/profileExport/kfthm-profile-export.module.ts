import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KfThmProfileExportController } from './kfthm-profile-export.controller';
import { KfThmProfileExportRepository } from './kfthm-profile-export.repository';
import { KfThmProfileExportService } from './kfthm-profile-export.service';
import { KfEmailService } from '../../common/email/email.service';
import { KfEmailTemplate } from '../../common/email/email-template.utils';

@Module({
    imports: [KfThmProfileExportModule, TypeOrmModule.forFeature([KfThmProfileExportRepository])],
    providers: [KfThmProfileExportService, KfEmailService, KfEmailTemplate],
    controllers: [KfThmProfileExportController],
})
export class KfThmProfileExportModule {}
