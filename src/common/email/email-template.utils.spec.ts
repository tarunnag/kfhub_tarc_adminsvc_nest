import { Test, TestingModule } from '@nestjs/testing';
import { KfEmailTemplate } from './email-template.utils';
import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';

describe('emailTemplateUtils', () => {
    let emailTemplate: KfEmailTemplate;
    let configService: KfConfigService;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [KfEmailTemplate, KfConfigService],
        }).compile();
        emailTemplate = module.get<KfEmailTemplate>(KfEmailTemplate);
        configService = module.get<KfConfigService>(KfConfigService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('htmlTemplate', () => {
        test('should return html template', async () => {
            const data = {
                timeOfDownload: '11:00',
                projectName: 'temp',
                clientName: 'clientTemp',
                requestorEmail: 'abc@KornFerry.com',
                reasonforExport: 'work',
                language: 'en',
                fileName: 'fileName',
                loggedInUserEmail: 1,
            };

            jest.spyOn(emailTemplate, 'createBlocks').mockReturnValueOnce('Time of download' + data.timeOfDownload);

            jest.spyOn(emailTemplate, 'createEmailBlock').mockReturnValueOnce('Requestor Email' + data.requestorEmail + data.requestorEmail);

            jest.spyOn(emailTemplate, 'createLastBlock').mockReturnValueOnce('Downloaded By' + data.loggedInUserEmail);

            const res = emailTemplate.htmlTemplate(data);

            expect(res.includes('Time of download')).toBeTruthy();
            expect(res.includes(data.timeOfDownload)).toBeTruthy();
            expect(res.includes('Project Name')).toBeTruthy();
            expect(res.includes(data.projectName)).toBeTruthy();
            expect(res.includes('Client Name')).toBeTruthy();
            expect(res.includes(data.clientName)).toBeTruthy();
            expect(res.includes('Requestor Email')).toBeTruthy();
            expect(res.includes(data.requestorEmail)).toBeTruthy();
            expect(res.includes('Requestor Reason')).toBeTruthy();
            expect(res.includes(data.reasonforExport)).toBeTruthy();
            expect(res.includes('Language')).toBeTruthy();
            expect(res.includes(data.language)).toBeTruthy();
            expect(res.includes('File Name')).toBeTruthy();
            expect(res.includes(data.fileName)).toBeTruthy();
            expect(res.includes('Downloaded By')).toBeTruthy();
            expect(res.includes(data.loggedInUserEmail.toString())).toBeTruthy();
        });
    });

    describe('subject', () => {
        test('should return formed subject of email', () => {
            const clientName = 'temp';
            const res = emailTemplate.subject(clientName);
            expect(res).toEqual(`Notification ${configService.get('APP_ENV')}: Talent Hub Custom SP and JD Export Downloaded for ${clientName}`);
        });
    });
});
