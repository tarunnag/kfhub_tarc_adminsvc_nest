import { TransformOptions } from 'class-transformer';
import { config, S3 } from 'aws-sdk';
import { lookup } from 'mime-types';
import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';

const configService = new KfConfigService();
const accessKeyId = configService.get('AMAZON_SECRET_KEY');
const secretAccessKey = configService.get('AMAZON_ACCESS_ID');
const region = process.env.AMAZON_REGION;

config.update({
    region,
    accessKeyId,
    secretAccessKey,
});

export const s3 = new S3({ signatureVersion: 'v4', accessKeyId, secretAccessKey, region });

export const toNumber = (textNumber) => parseInt(textNumber, 10);

export const options: TransformOptions = { toClassOnly: true };

export const getMimeType = (filePath: string) => {
    return lookup(filePath);
};
