import { KfThmStatusRepository } from '../status/status.repository';
import { Injectable } from '@nestjs/common';
import { KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { KfThmSignUrlUtils } from './kfthm-signUrl.util';
import { KfThmSignUrlInterface as Kf } from './kfthm-signUrl.interface';
import { Common } from '../../common/common.interface';
import { KfThmSocketsService } from '../../socket/kfthm-socket.service';
// import { KfaStatusRepository } from '../job/kfarch-job-signUrl.repository';

const { INVALID_FILE_EXTENSION } = Kf.Enum.Error;
const { JOB_PROFILES } = Kf.Enum.ProfilesType;

const Stages = Common.Enum.BucketDetails;
const { BUCKET } = Common.Enum;
const { EXPIRES, FILE_UPLOAD, FILE_VALIDATION, UPLOAD_XLSX, THM } = Stages;

@Injectable()
export class KfThmSignUrlService extends KfThmSignUrlUtils {
    constructor(private socket: KfThmSocketsService, private status: KfThmStatusRepository) {
        super();
    }
    async getSignedUrlForDownload(query: Kf.Query.DownloadFile) {
        try {
            let stage = Stages.FILE_ERROR;

            switch (query.status) {
                case '1':
                    stage = Stages.FILE_UPLOAD;
                    break;
                case '2':
                    stage = Stages.FILE_ERROR;
                    break;
                case '3':
                    stage = Stages.FILE_MAPPED_SUCCESS;
                    break;
                case '4':
                    stage = Stages.FILE_MAPPED_FAILED;
                    break;
                case '5':
                    stage = Stages.THM_GOLDEN_TEMPLATE_XLSX;
                    break;
                // case '6':
                //     stage = Stages.KFA_JOB_UPDATE_TEMPLATE;
                //     break;
            }

            if (stage !== Stages.THM_GOLDEN_TEMPLATE_XLSX) {
                const statusMeta = await this.status.getMetadata(query.fileUUID);
                if (statusMeta.ClientId) {
                    query.clientId = statusMeta.ClientId;
                }
            }

            const queryDownloadFile: Common.Query.DownloadFile = {
                fileUUID: query.fileUUID,
                status: typeof query.status !== 'undefined' ? query.status : '2',
                clientId: typeof query.clientId !== 'undefined' ? query.clientId : 0,
            };

            const key = await this.getFullFileName(queryDownloadFile, stage, BUCKET);

            const url = await this.signedUrlForDownload(BUCKET, key, EXPIRES);
            return { url };
        } catch (error) {
            throw new KfDbException(error.message);
        }
    }

    async getSignedUrlForUpload(query: Kf.Query.UploadSignedUrl): Promise<Kf.Response.UploadSignedUrl> {
        try {
            const contentType = this.getMimeType('.xlsx');

            await this.createBucketIfNotExist(BUCKET);

            const { uuid, url } = this.constructFilePath(FILE_UPLOAD, UPLOAD_XLSX, THM, {
                clientId: query.uploadClientId,
            } as any);

            const endPoint = await this.signedUrlForUpload(BUCKET, url, EXPIRES, contentType);

            await this.status.createStatus(uuid, query.userId, query.uploadClientId, 0);

            this.socket.addUuidToClientSocketTable(query.loggedInUserClientId, uuid);

            return {
                url: endPoint,
                uuid,
            };
        } catch (error) {
            throw new KfDbException(error.message);
        }
    }
}
