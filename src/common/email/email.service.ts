import { KfEmailUtil } from './email.utils';
import { KF_SMTP_CONFIG, KF_SOURCE_EMAIL } from './email-smtp.config';
import { KfEmailTemplate } from './email-template.utils';
import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';

const PROJECT_NAME = 'Admin - TH Management Profiles Export';

@Injectable()
export class KfEmailService {
    emailUtil = new KfEmailUtil(KF_SMTP_CONFIG);
    transporter = this.emailUtil.mailTransporter();

    constructor(private templateUtil: KfEmailTemplate, private configService: KfConfigService) {}

    async KfSendEmail(payload: {
        clientName: string;
        fileName: any;
        requestorEmail: any;
        reasonforExport: any;
        language: any;
        loggedInUserClientId: any;
        loggedInUserEmail: any;
    }): Promise<void> {
        const FROM = `"Talent Hub Portal" <${KF_SOURCE_EMAIL}>`;

        const SUBJECT = this.templateUtil.subject(payload.clientName);

        const currentTime = moment();

        const template = {
            timeOfDownload: currentTime.format('l') + ' ' + currentTime.format('LTS'),
            projectName: PROJECT_NAME,
            clientName: payload.clientName,
            fileName: payload.fileName,
            requestorEmail: payload.requestorEmail,
            reasonforExport: payload.reasonforExport,
            language: payload.language,
            loggedInUserClientId: payload.loggedInUserClientId,
            loggedInUserEmail: payload.loggedInUserEmail,
        };

        await this.transporter.sendMail({
            from: FROM,

            /**
             *
             *  PROFILE_EXPORT_EMAIL_TO=ipsum@kornferry.com,lorem@kornferry.com
             *  No space in between seperated by ","
             *
             */

            to: this.configService.get('PROFILE_EXPORT_EMAIL_TO').split(','),
            subject: SUBJECT,
            html: this.templateUtil.htmlTemplate(template),
        });
    }
}
