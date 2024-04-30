import { Test, TestingModule } from '@nestjs/testing';
import { KfEmailService } from './email.service';
import { KfEmailTemplate } from './email-template.utils';
import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';
import { KfEmailUtil } from './email.utils';
import { KF_SOURCE_EMAIL } from './email-smtp.config';
import * as moment from 'moment';

describe('KfEmailService', () => {
    let module: TestingModule;
    let templateUtil: KfEmailTemplate;
    let configService: KfConfigService;
    let emailUtil: KfEmailUtil;
    let emailService: KfEmailService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [KfEmailService, KfEmailTemplate, KfConfigService, KfEmailUtil],
        }).compile();
        emailService = module.get<KfEmailService>(KfEmailService);
        templateUtil = module.get<KfEmailTemplate>(KfEmailTemplate);
        emailUtil = module.get<KfEmailUtil>(KfEmailUtil);
        configService = module.get<KfConfigService>(KfConfigService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('KfSendEmail', () => {
        test('should send email', async () => {
            const PROJECT_NAME = 'Admin - TH Management Profiles Export';

            const payload = {
                clientName: 'clientName',
                fileName: 'fileName',
                requestorEmail: 'requestorEmail',
                reasonforExport: 'reasonforExport',
                language: 'en',
                loggedInUserClientId: 1,
                loggedInUserEmail: 'email',
            };

            const sendMailSpy = jest.spyOn(emailService.transporter, 'sendMail').mockResolvedValueOnce({
                promise: () => {
                    return Promise.resolve({
                        Body: {
                            toString: () => {
                                return 'success';
                            },
                        },
                    });
                },
            });
            const htmlTemplateSpy = jest
                .spyOn(templateUtil, 'htmlTemplate')
                .mockReturnValueOnce(`Notification ${configService.get('APP_ENV')}: Talent Hub Custom SP and JD Export Downloaded for ${payload.clientName}`);
            const subjectSpy = jest
                .spyOn(templateUtil, 'subject')
                .mockReturnValueOnce(`Notification ${configService.get('APP_ENV')}: Talent Hub Custom SP and JD Export Downloaded for ${payload.clientName}`);
            jest.spyOn(Date, 'now').mockReturnValue(1631523600000);
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

            const FROM = `"Talent Hub Portal" <${KF_SOURCE_EMAIL}>`;

            const SUBJECT = `Notification ${configService.get('APP_ENV')}: Talent Hub Custom SP and JD Export Downloaded for ${payload.clientName}`;

            const sendMailArg = {
                from: FROM,

                /**
                 *
                 *  PROFILE_EXPORT_EMAIL_TO=ipsum@kornferry.com,lorem@kornferry.com
                 *  No space in between seperated by ","
                 *
                 */

                to: configService.get('PROFILE_EXPORT_EMAIL_TO').split(','),
                subject: SUBJECT,
                html: `Notification ${configService.get('APP_ENV')}: Talent Hub Custom SP and JD Export Downloaded for ${payload.clientName}`,
            };

            await emailService.KfSendEmail(payload);

            expect(subjectSpy).toHaveBeenCalledWith(payload.clientName);
            expect(htmlTemplateSpy).toHaveBeenCalledWith(template);
            expect(sendMailSpy).toHaveBeenCalledWith(sendMailArg);
        });
    });
});
