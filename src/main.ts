import 'dotenv/config';
import { KfThmApplicationModule } from './kfthm-app.module';
import { KfMain, KfIBootstrapOption } from '@kf-products-core/kfhub_svc_lib';

const option: KfIBootstrapOption = {
    app: {
        name: process.env.APP_NAME || 'Korn Ferry TH-Management API',
        port: +(process.env.APP_PORT || '3000'),
        host: process.env.APP_HOST || 'localhost',
    },
    api: {
        versionUri: process.env.API_VERSION || 'v1',
        endPointUri: process.env.API_ENDPOINT_URI || 'admin',
    },
    swagger: {
        version: process.env.SWAGGERDOC_VERSION || '1.0',
        title: process.env.SWAGGERDOC_TITLE || process.env.APP_NAME || 'KFHUB_THM_SVC_NEST APIs',
        description: process.env.SWAGGERDOC_TITLE || 'APIs setup for the kfhub_thm_svc_nest API App',
        endPointUri: process.env.SWAGGERDOC_ENDPOINT_URI || 'docs',
    },
};

KfMain.bootstrap(KfThmApplicationModule, option);
