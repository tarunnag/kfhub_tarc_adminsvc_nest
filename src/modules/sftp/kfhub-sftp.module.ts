import { Module } from '@nestjs/common';
import { KfHubSftpClientService } from './kfhub-sftp-client.service';

@Module({
    providers: [KfHubSftpClientService],
    exports: [KfHubSftpClientService],
})
export class KfHubSftpModule {}
