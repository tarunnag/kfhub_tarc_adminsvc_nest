import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';

const configService = new KfConfigService();

export const KF_SMTP_CONFIG: any = {
    host: configService.get('EMAIL_HOST'),
    port: configService.get('EMAIL_PORT') || 587,
    secure: false,
    // auth: {
    //     user: configService.get('EMAIL_USER'),
    //     pass: configService.get('EMAIL_PASS'),
    // },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
};

export const KF_SOURCE_EMAIL = `thm-nest@kornferry.com`;
