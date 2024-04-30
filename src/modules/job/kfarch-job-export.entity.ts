import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('KFAExportJobsTasksMetaData', { database: 'SuccessProfile' })
export class KfArchJobTaskExportStatusEntity {
    @PrimaryColumn({ name: 'TaskGuid' })
    TaskGuid: string;

    @Column({ name: 'TaskStatus' })
    TaskStatus: number;

    @Column({ name: 'CreatedOn' })
    CreatedOn: Date;

    @Column({ name: 'CreatedBy' })
    CreatedBy: number;
}
