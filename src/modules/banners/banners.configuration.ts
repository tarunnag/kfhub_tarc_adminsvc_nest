import { BannersEnvironmentName } from './banners.const';
import { BannerEnvironmentConfiguration, BannerS3Configuration } from './banners.interface';

export const bannersFilePath = 'app/assets/config/banners.json';
export const environmentFilePath = 'app/assets/config/env.json';

export const bannersS3Configuration: { [name: string]: BannerS3Configuration } = {
    [BannersEnvironmentName.DEV]: {
        bucket: 'devproductshub.kornferry.com',
        region: 'us-east-1',
        cloudfrontDistributionId: 'E32BZ52QRKYDU7',
    },
    [BannersEnvironmentName.DEV_INT]: {
        bucket: 'devintproductshub.kornferry.com',
        region: 'us-east-1',
        cloudfrontDistributionId: 'E2MHJT0HWIJ4OY',
    },
    [BannersEnvironmentName.PRETEST]: {
        bucket: 'testproducts.kornferry.com',
        region: 'us-east-1',
        cloudfrontDistributionId: 'E3B3MJATIN1ZZA',
    },
    [BannersEnvironmentName.PRETEST_B]: {
        bucket: 'pretestproductshub.kornferry.com',
        region: 'us-east-1',
        cloudfrontDistributionId: 'E3B3MJATIN1ZZA',
    },
    [BannersEnvironmentName.PROD_CN]: {
        bucket: 'products.kornferry.cn',
        region: 'ap-east-1',
        cloudfrontDistributionId: 'E27R30CD3AZJTB',
    },
    [BannersEnvironmentName.PROD_EU]: {
        bucket: 'products.kornferry.eu',
        region: 'eu-central-1',
        cloudfrontDistributionId: 'E1WRLAW7TUO25C',
    },
    [BannersEnvironmentName.PROD_EU_DR]: {
        bucket: 'products.kornferry.eu',
        region: 'eu-west-1',
        cloudfrontDistributionId: 'E1WRLAW7TUO25C',
    },
    [BannersEnvironmentName.PROD_US]: {
        bucket: 'products.kornferry.com',
        region: 'us-east-1',
        cloudfrontDistributionId: 'E324EFAAGVM8LQ',
    },
    [BannersEnvironmentName.PROD_US_DR]: {
        bucket: 'products.kornferry.com',
        region: 'us-west-2',
        cloudfrontDistributionId: 'E324EFAAGVM8LQ',
    },
    [BannersEnvironmentName.STAGING]: {
        bucket: 'stagingproductshub.kornferry.com',
        region: 'us-east-1',
        cloudfrontDistributionId: 'E2F2VUEIF9EC3Y',
    },
    [BannersEnvironmentName.TEST]: {
        bucket: 'testproductshub.kornferry.com',
        region: 'us-east-1',
        cloudfrontDistributionId: 'E1ZSU4H9HJNJST',
    },
};

const buildS3FileUrl = (environmentName: BannersEnvironmentName, relativePath: string): string =>
    `https://s3.amazonaws.com/${bannersS3Configuration[environmentName].bucket}/${relativePath}`;

const buildPublicS3FileUrl = (environmentName: BannersEnvironmentName, relativePath: string): string =>
    `https://${bannersS3Configuration[environmentName].bucket}/${relativePath}`;

export const bannersConfigurations: { [name: string]: BannerEnvironmentConfiguration } = {
    [BannersEnvironmentName.DEV]: {
        description: 'Dev Environment',
        bannersFileUrl: buildS3FileUrl(BannersEnvironmentName.DEV, bannersFilePath),
        environmentFileUrl: buildS3FileUrl(BannersEnvironmentName.DEV, environmentFilePath),
    },
    [BannersEnvironmentName.DEV_INT]: {
        description: 'Dev-Int Environment',
        bannersFileUrl: buildS3FileUrl(BannersEnvironmentName.DEV_INT, bannersFilePath),
        environmentFileUrl: buildS3FileUrl(BannersEnvironmentName.DEV_INT, environmentFilePath),
    },
    [BannersEnvironmentName.PRETEST]: {
        description: 'Pre-Test Environment',
        bannersFileUrl: buildS3FileUrl(BannersEnvironmentName.PRETEST, bannersFilePath),
        environmentFileUrl: buildS3FileUrl(BannersEnvironmentName.PRETEST, environmentFilePath),
    },
    [BannersEnvironmentName.PRETEST_B]: {
        description: 'Pre-Test Beta Environment',
        bannersFileUrl: buildS3FileUrl(BannersEnvironmentName.PRETEST_B, bannersFilePath),
        environmentFileUrl: buildS3FileUrl(BannersEnvironmentName.PRETEST_B, environmentFilePath),
    },
    [BannersEnvironmentName.TEST]: {
        description: 'Test Environment',
        bannersFileUrl: buildS3FileUrl(BannersEnvironmentName.TEST, bannersFilePath),
        environmentFileUrl: buildS3FileUrl(BannersEnvironmentName.TEST, environmentFilePath),
    },
    [BannersEnvironmentName.STAGING]: {
        description: 'Staging Environment',
        bannersFileUrl: buildS3FileUrl(BannersEnvironmentName.STAGING, bannersFilePath),
        environmentFileUrl: buildS3FileUrl(BannersEnvironmentName.STAGING, environmentFilePath),
    },
    [BannersEnvironmentName.PROD_CN]: {
        description: 'Asian Pacific Region Production',
        additionalNote: 'After saving banners for this environment, you have to reach out to DevOps team to sync changes with real web-server.',
        bannersFileUrl: buildPublicS3FileUrl(BannersEnvironmentName.PROD_CN, bannersFilePath),
        environmentFileUrl: buildPublicS3FileUrl(BannersEnvironmentName.PROD_CN, environmentFilePath),
    },
    [BannersEnvironmentName.PROD_EU]: {
        description: 'European Region Production',
        bannersFileUrl: buildPublicS3FileUrl(BannersEnvironmentName.PROD_EU, bannersFilePath),
        environmentFileUrl: buildPublicS3FileUrl(BannersEnvironmentName.PROD_EU, environmentFilePath),
    },
    [BannersEnvironmentName.PROD_EU_DR]: {
        description: 'European Region Production (DR)',
        bannersFileUrl: buildPublicS3FileUrl(BannersEnvironmentName.PROD_EU_DR, bannersFilePath),
        environmentFileUrl: buildPublicS3FileUrl(BannersEnvironmentName.PROD_EU_DR, environmentFilePath),
    },
    [BannersEnvironmentName.PROD_US]: {
        description: 'US Production',
        bannersFileUrl: buildPublicS3FileUrl(BannersEnvironmentName.PROD_US, bannersFilePath),
        environmentFileUrl: buildPublicS3FileUrl(BannersEnvironmentName.PROD_US, environmentFilePath),
    },
    [BannersEnvironmentName.PROD_US_DR]: {
        description: 'US Production (DR)',
        bannersFileUrl: buildPublicS3FileUrl(BannersEnvironmentName.PROD_US_DR, bannersFilePath),
        environmentFileUrl: buildPublicS3FileUrl(BannersEnvironmentName.PROD_US_DR, environmentFilePath),
    },
};