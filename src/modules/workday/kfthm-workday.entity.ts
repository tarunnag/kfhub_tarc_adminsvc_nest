import { Entity, Column, PrimaryColumn } from 'typeorm';
import { KfStringToNumberTransformer } from '@kf-products-core/kfhub_svc_lib';

@Entity('WorkdaySPPublishingStatus')
export class KfThmWorkdayPublishingStatusEntity {
    @PrimaryColumn({ name: 'TaskId' })
    TaskId: string;

    @Column({ name: 'TaskStatus', transformer: [KfStringToNumberTransformer] })
    TaskStatus: number;

    @Column({ name: 'TaskType', transformer: [KfStringToNumberTransformer] })
    TaskType: number;

    @Column({ name: 'CreatedOn' })
    CreatedOn: Date;

    @Column({ name: 'CreatedOnUTC' })
    CreatedOnUTC: Date;

    @Column({ name: 'CreatedBy', transformer: [KfStringToNumberTransformer] })
    CreatedBy: number;
}
