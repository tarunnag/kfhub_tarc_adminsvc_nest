import { Logger } from '@nestjs/common';
import { KfException } from '@kf-products-core/kfhub_svc_lib';
import { KfExceptionCodes as ec } from '../kfthm-exception-codes.enum';

export class Oopser {
    private readonly logger: Logger;

    constructor(scope: string) {
        this.logger = new Logger(scope);
    }

    throwError(...input: any[]): void {
        const message = input.map((i) => (i instanceof Error ? i.message : JSON.stringify(i))).join(', ');
        this.logger.error(message);
        throw new KfException(message, 500, ec.INTERNAL_SERVER_ERROR);
    }

    logError(...input: any[]): string {
        const message = input.map((i) => (i instanceof Error ? i.message : JSON.stringify(i))).join(', ');
        this.logger.error(message);
        return message;
    }
}
