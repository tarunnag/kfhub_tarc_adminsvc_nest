import { Injectable } from '@nestjs/common';
import { KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { Common } from '../../common/common.interface';
import { getManager } from 'typeorm';

@Injectable()
export class KfThmPushDataService {
    /*
        TODO :

            re-factor service logic and database query

    */
    async getPushData(query: Common.Query.DefaultProps, body: Common.Query.PushData) {
        try {
            const inputQuery = `
            SuccessProfile.dbo.LoadThUploadedProfiles ${+body.uploadClientId}, '${body.fileUUID}'
        `;
            return await getManager().query(inputQuery);
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }
}
