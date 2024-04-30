import { KfExceptionCodes as ec } from './../../kfthm-exception-codes.enum';
import { lookup } from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { KfThmSignUrlInterface as Kf } from './kfthm-signUrl.interface';
import { KfApiErrorHandler, KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { Common } from '../../common/common.interface';
import { s3 } from '../../common/common.utils';
import { AwsS3Config } from '../job/kfarch-job.enum';
const Stages = Common.Enum.BucketDetails;

const { GET_OBJECT, PUT_OBJECT } = Kf.Enum.SignUrl;
const { XLS, XLSX } = Kf.Enum.Extensions;
const { THM } = Stages;

export class KfThmSignUrlUtils {
    validateExtension(filePath: string) {
        const splitFile = filePath.split('.');

        if (!splitFile.length) {
            return false;
        }

        const extension = splitFile[splitFile.length - 1].toLowerCase();

        switch (extension) {
            case XLS:
                return filePath;
            case XLSX:
                return filePath;
            default:
                return false;
        }
    }

    getMimeType(filePath: string) {
        return lookup(filePath);
    }

    // AWS IO call failed.
    @KfApiErrorHandler(ec.AWS_IO_CALL_FAILED)
    async createBucketIfNotExist(Bucket: string) {
        const condition = await this.bucketExists(Bucket);

        if (!condition) {
            return await s3.createBucket({ Bucket }).promise();
        }
    }

    // AWS IO call failed.
    @KfApiErrorHandler(ec.AWS_IO_CALL_FAILED)
    async deleteBucketFile(Bucket, filePath: string) {
        return await s3
            .deleteObject({
                Bucket,
                Key: filePath,
            })
            .promise();
    }

    // AWS IO call failed.
    @KfApiErrorHandler(ec.AWS_IO_CALL_FAILED)
    async bucketExists(Bucket: string) {
        try {
            await s3.headBucket({ Bucket }).promise();
            return true;
        } catch {
            return false;
        }
    }

    constructFilePath(folder, stageSuffix, uploadFolder = THM, query, upload = true, uuid = this.key()) {
        folder = folder.toString();
        const clientId = query.clientId ? query.clientId + '/' : '';

        if (upload) {
            stageSuffix = Date.now() + stageSuffix.toString();
        }

        const returnObj = { url: `${uploadFolder}/${clientId}${uuid}/${folder}/${stageSuffix}`, uuid };

        return returnObj;
    }

    // AWS IO call failed.
    @KfApiErrorHandler(ec.AWS_IO_CALL_FAILED)
    async signedUrlForUpload(Bucket, Key, Expires, ContentType) {
        return await s3.getSignedUrlPromise(PUT_OBJECT, {
            Bucket,
            Key,
            Expires,
            ContentType,
            ACL: 'private',
        });
    }

    async getFullFileName(query: Common.Query.DownloadFile, stage, bucketName, uploadFolder = Stages.THM) {
        const clientId = query.clientId ? query.clientId + '/' : '';
        if (stage === Stages.THM_GOLDEN_TEMPLATE_XLSX) {
            return Stages.THM_GOLDEN_TEMPLATE_XLSX;
        }

        const params = {
            Bucket: bucketName,
            Delimiter: '/',
            Prefix: `${uploadFolder}/${clientId}${query.fileUUID}/${stage.toString()}/`,
        };

        const result = await s3.listObjectsV2(params).promise();

        if (result.Contents.length) {
            return result.Contents.pop().Key;
        }

        throw new KfDbException(`No file found: ${params.Bucket} ${params.Prefix}`);
    }

    // AWS IO call failed.
    @KfApiErrorHandler(ec.AWS_IO_CALL_FAILED)
    async signedUrlForDownload(Bucket, Key, Expires) {
        return await s3.getSignedUrlPromise(GET_OBJECT, {
            Bucket,
            Key,
            Expires,
        });
    }

    async uploadToS3(params: AWS.S3.PutObjectRequest) {
        params.ACL = AwsS3Config.ACL;
        await s3.putObject(params).promise();
    }

    key() {
        return uuidv4();
    }
}
