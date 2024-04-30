import { Injectable } from '@nestjs/common';
import { KfHealthCheckOptionsService } from '@kf-products-core/kfhub_svc_lib';
import { HealthIndicatorFunction, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class KfThmHealthCheckOptionsService extends KfHealthCheckOptionsService {
    getTypeOrmHealthIndicatorFunctions(typeOrmHealthIndicator: TypeOrmHealthIndicator): HealthIndicatorFunction[] {
        return [];
    }
}
