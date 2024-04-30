import { Injectable, Logger } from '@nestjs/common';
import * as Client from 'ssh2-sftp-client';

@Injectable()
export class KfHubSftpClientService {
    private sftpClient = new Client();
    private logger = new Logger('SftpClientService');

    public async put(buffer: Buffer, config: Client.ConnectOptions, to: string): Promise<void> {
        this.logger.log(`Try to put data to ${to}`);
        return this.sftpClient
            .connect(config)
            .then(() => this.sftpClient.mkdir(to.split('/').slice(0, -1).join('/'), true))
            .then(() => this.sftpClient.put(buffer, `${to}`))
            .then(() => this.sftpClient.end())
            .catch((err) => {
                this.logger.log(err);
                throw new Error(err.message);
            });
    }

    public pathFiller(path: string, params: any = {}): string {
        const date = new Date().toISOString().replace('T', '_').replace(/:/g, '-').substr(0, 19);
        let filledPath = path;
        params = { ...params, date };

        [...Object.keys(params)].forEach((key) => {
            const regexp = new RegExp(`{${key}}`, 'ig');
            filledPath = filledPath.replace(regexp, params[key]);
        });

        return filledPath;
    }
}
