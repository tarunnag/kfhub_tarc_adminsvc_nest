import { KfThmSignUrlUtils } from './kfthm-signUrl.util';
import * as mimeTypes from 'mime-types';
import * as uuid from 'uuid';
import { s3 } from './../../common/common.utils';
import { Common } from '../../common/common.interface';
import { KfThmSignUrlInterface as Kf } from './kfthm-signUrl.interface';

jest.mock('./../../common/common.utils');

jest.mock('uuid', () => {
    const actual = jest.requireActual('uuid');
    return {
        ...actual,
    };
});

const Stages = Common.Enum.BucketDetails;
const { THM } = Stages;
const { GET_OBJECT, PUT_OBJECT } = Kf.Enum.SignUrl;

describe('KfThmSignUrlUtil', () => {
    let signUrlUtils: KfThmSignUrlUtils;
    beforeEach(async () => {
        signUrlUtils = new KfThmSignUrlUtils();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('validateExtension', () => {
        test('should return file path if file has xls extension', async () => {
            const res = signUrlUtils.validateExtension('mock-file.xls');

            expect(res).toEqual('mock-file.xls');
        });

        test('should return file path if file has xlsx extension', async () => {
            const res = signUrlUtils.validateExtension('mock-file.xlsx');

            expect(res).toEqual('mock-file.xlsx');
        });

        test('should return false if file has no extension', async () => {
            const res = signUrlUtils.validateExtension('mock-file');

            expect(res).toEqual(false);
        });

        test('should return false if file has not xls extension', async () => {
            const res = signUrlUtils.validateExtension('mock-file.doc');

            expect(res).toEqual(false);
        });

        test(`should return false when splitFile's length is 0`, () => {
            const res = signUrlUtils.validateExtension({ split: () => [] } as any);

            expect(res).toEqual(false);
        });

        test('should call lookup with argument and return result', () => {
            const filePath = 'filePath';
            const lookup = jest.spyOn(mimeTypes, 'lookup').mockReturnValueOnce(filePath);

            const res = signUrlUtils.getMimeType(filePath);

            expect(lookup).toHaveBeenCalledWith(filePath);
            expect(res).toEqual(filePath);
        });

        test('should delete Bucket file', async () => {
            const returnValue = {};
            const deleteObjectResult = { promise: () => returnValue } as any;

            const deleteObject = jest.spyOn(s3, 'deleteObject').mockReturnValue(deleteObjectResult);

            const bucket = {};
            const key = 'filePath';
            const res = await signUrlUtils.deleteBucketFile(bucket, key);

            expect(deleteObject).toHaveBeenCalledWith({
                Bucket: bucket,
                Key: key,
            });
            expect(res).toEqual(returnValue);
        });

        test(`should create bucket if doesn't exist`, async () => {
            const bucketExists = true;
            const bucket = 'bucket';
            const bucketExistsResult = jest.spyOn(signUrlUtils, 'bucketExists').mockResolvedValue(bucketExists);
            const res = await signUrlUtils.createBucketIfNotExist(bucket);

            expect(bucketExistsResult).toHaveBeenCalledWith(bucket);

            expect(res).toEqual(undefined);
        });

        test(`should not create bucket if it exists`, async () => {
            const bucketExists = false;
            const bucket = 'bucket';
            const bucketExistsResult = jest.spyOn(signUrlUtils, 'bucketExists').mockResolvedValue(bucketExists);

            const returnValue = {};
            const createBucketResult = { promise: () => returnValue } as any;
            const createBucket = jest.spyOn(s3, 'createBucket').mockReturnValue(createBucketResult);

            const res = await signUrlUtils.createBucketIfNotExist(bucket);

            expect(bucketExistsResult).toHaveBeenCalledWith(bucket);
            expect(createBucket).toHaveBeenCalledWith({ Bucket: bucket });
            expect(res).toEqual(returnValue);
        });

        test('should check existence of bucket and return true', async () => {
            const returnValue = {};
            const headBucketResult = { promise: () => returnValue } as any;

            const headBucket = jest.spyOn(s3, 'headBucket').mockReturnValue(headBucketResult);

            const bucket = 'bucket';

            const res = await signUrlUtils.bucketExists(bucket);

            expect(headBucket).toHaveBeenCalledWith({ Bucket: bucket });
            expect(res).toEqual(true);
        });

        test('should check existence of bucket and return false', async () => {
            const headBucket = jest.spyOn(s3, 'headBucket').mockImplementationOnce(() => {
                throw new Error(`bucket doesn't exist`);
            });

            const bucket = 'bucket';

            const res = await signUrlUtils.bucketExists(bucket);

            expect(headBucket).toHaveBeenCalledWith({ Bucket: bucket });
            expect(res).toEqual(false);
        });

        test('should construct file path when upload flag is false', () => {
            const folder = 'folder';
            const stageSuffix = 'stageSuffix';
            const uploadFolder = THM;
            const query = {
                clientId: 1,
            };

            const uuidv4Value = '1';
            jest.spyOn(uuid, 'v4').mockReturnValue(uuidv4Value);

            const upload = false;
            const clientId = query.clientId ? query.clientId + '/' : '';

            const res = signUrlUtils.constructFilePath(folder, stageSuffix, uploadFolder, query, upload, uuidv4Value);

            expect(res).toEqual({ url: `${uploadFolder}/${clientId}${uuidv4Value}/${folder}/${stageSuffix}`, uuid: uuidv4Value });
        });

        test('should construct file path when upload flag is true', () => {
            const folder = 'folder';
            let stageSuffix = 'stageSuffix';
            const uploadFolder = THM;
            const query = {
                clientId: 1,
            };

            const uuidv4Value = '1';
            const dateNow = 152332;

            jest.spyOn(uuid, 'v4').mockReturnValue(uuidv4Value);

            jest.spyOn(Date, 'now').mockReturnValue(dateNow);

            const upload = true;
            const clientId = query.clientId ? query.clientId + '/' : '';

            const res = signUrlUtils.constructFilePath(folder, stageSuffix, uploadFolder, query, upload, uuidv4Value);
            stageSuffix = dateNow + stageSuffix.toString();

            expect(res).toEqual({ url: `${uploadFolder}/${clientId}${uuidv4Value}/${folder}/${stageSuffix}`, uuid: uuidv4Value });
        });

        test('should return signed url for upload', async () => {
            const urlUpload = 'urlUpload';
            const getSignedUrlPromiseSpy = jest.spyOn(s3, 'getSignedUrlPromise').mockResolvedValue(urlUpload);

            const Bucket = 'bucket';
            const Key = 'key';
            const Expires = 'expires';
            const ContentType = 'contentType';

            const res = await signUrlUtils.signedUrlForUpload(Bucket, Key, Expires, ContentType);

            expect(getSignedUrlPromiseSpy).toHaveBeenCalledWith(PUT_OBJECT, { Bucket, Key, Expires, ContentType, ACL: 'private' });
            expect(res).toEqual(urlUpload);
        });

        test('should return signed url for download', async () => {
            const urlDownload = 'urlUpload';
            const getSignedUrlPromiseSpy = jest.spyOn(s3, 'getSignedUrlPromise').mockResolvedValue(urlDownload);

            const Bucket = 'bucket';
            const Key = 'key';
            const Expires = 'expires';
            const res = await signUrlUtils.signedUrlForDownload(Bucket, Key, Expires);

            expect(getSignedUrlPromiseSpy).toHaveBeenCalledWith(GET_OBJECT, { Bucket, Key, Expires });
            expect(res).toEqual(urlDownload);
        });

        describe('getFullFileName', () => {
            test('should return Stages.THM_GOLDEN_TEMPLATE_XLSX', async () => {
                const res = await signUrlUtils.getFullFileName(
                    {
                        status: '1',
                        fileUUID: 'file-uuid',
                        clientId: 1,
                    },
                    Stages.THM_GOLDEN_TEMPLATE_XLSX,
                    'bucketName',
                );

                expect(res).toEqual(Stages.THM_GOLDEN_TEMPLATE_XLSX);
            });
            test('should return Key from the latest item of Contents', async () => {
                const Contents = [
                    {
                        Key: 's3-test-key',
                    },
                    {
                        Key: 's3-test-key-1',
                    },
                    {
                        Key: 's3-test-key-2',
                    },
                ];

                (s3.listObjectsV2 as any).mockReturnValue({
                    promise: () => {
                        return Promise.resolve({
                            Contents: [...Contents],
                        });
                    },
                });

                const res = await signUrlUtils.getFullFileName(
                    {
                        status: '1',
                        fileUUID: 'file-uuid',
                        clientId: 1,
                    },
                    Stages.KFA_JOB_UPDATE_TEMPLATE,
                    'bucketName',
                );

                expect(res).toEqual(Contents[2].Key);
            });

            test('should throw an error while getting full file name', async () => {
                (s3.listObjectsV2 as any).mockReturnValue({
                    promise: () => {
                        return Promise.resolve({
                            Contents: [],
                        });
                    },
                });

                let err;

                try {
                    await signUrlUtils.getFullFileName(
                        {
                            status: '1',
                            fileUUID: 'file-uuid',
                            clientId: 1,
                        },
                        Stages.KFA_JOB_UPDATE_TEMPLATE,
                        'bucketName',
                    );
                } catch (e) {
                    err = e;
                }

                expect(err).toBeDefined();
            });
        });

        test('should return uuidv4', () => {
            const result = 'res';
            const resultV4 = jest.spyOn(uuid, 'v4').mockReturnValue(result);

            const res = signUrlUtils.key();

            expect(resultV4).toHaveBeenCalled();
            expect(res).toEqual(result);
        });
    });
});
