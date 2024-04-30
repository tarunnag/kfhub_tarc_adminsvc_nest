import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { KfStringToNumberTransformer } from '@kf-products-core/kfhub_svc_lib';

@Entity('ProfileUploadFromEmpPayDataStatus', { database: 'SuccessProfile' })
export class KfThmStatusEntity {
    @PrimaryGeneratedColumn({ name: 'ProfileUploadFromEmpPayDataID' })
    ProfileUploadFromEmpPayDataID?: number;

    @Column({ name: 'ProfileUploadFromEmpPayDataStatusID' })
    ProfileUploadFromEmpPayDataStatusID: string;

    @Column({ name: 'ProfileUploadStatusID', transformer: [KfStringToNumberTransformer] })
    ProfileUploadStatusID: number;

    @Column({ name: 'ClientId', transformer: [KfStringToNumberTransformer] })
    ClientId: number;

    @Column({ name: 'CreatedOn' })
    CreatedOn: Date;

    @Column({ name: 'CreateBy', transformer: [KfStringToNumberTransformer] })
    CreateBy: number;
}
