import { s3 } from './../../common/common.utils';
import { InsertDataPost, ParseJsonDataContract } from './kfhub-insertData.interface';
import { Injectable, Logger } from '@nestjs/common';
import { KfDbException } from '@kf-products-core/kfhub_svc_lib';
import { Common } from '../../common/common.interface';
import { KfThmInsertDataRepository } from './kfhub-insertData.repository';
import { KfThmStatusRepository } from '../status/status.repository';

@Injectable()
export class KfThmInsertDataService {
    private logger: Logger = new Logger('KfThmInsertDataService');

    constructor(private repo: KfThmInsertDataRepository, private status: KfThmStatusRepository) {}

    async insertData(body: InsertDataPost, query: Common.Query.DefaultProps) {
        try {
            const file = await this.getFile(body.fileKey);
            this.logger.log('file');
            this.logger.log(file);

            const chunks = this.divideInChunks(file, 10);

            const found = await this.status.getMetadata(body.fileUUID);

            for (const chunk of chunks) {
                await this.repo.insertBulkData(chunk, body, found.CreateBy, found.ProfileUploadFromEmpPayDataID);
            }

            return {};
        } catch ({ message }) {
            throw new KfDbException(message);
        }
    }

    private divideInChunks(file: ParseJsonDataContract[], chunkSize: number) {
        const chunks: ParseJsonDataContract[][] = [];
        let incrementalIndex = 1;
        file.map((o) => {
            o.profileRecordId = incrementalIndex++;
            if (chunks.length === 0) {
                return chunks.push([o]);
            }
            const lastElement = chunks[chunks.length - 1];
            if (lastElement.length === chunkSize) {
                return chunks.push([o]);
            }
            lastElement.push(o);
        });

        return chunks;
    }

    async getFile(key): Promise<ParseJsonDataContract[]> {
        const { Body } = await s3
            .getObject({
                Bucket: Common.Enum.BUCKET,
                Key: key,
            })
            .promise();
        return JSON.parse(Body.toString());
    }
}
