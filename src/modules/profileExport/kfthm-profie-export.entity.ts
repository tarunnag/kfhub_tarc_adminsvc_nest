import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { KfStringToNumberTransformer } from '@kf-products-core/kfhub_svc_lib';

@Entity('ClientCustomSPExport', { database: 'SuccessProfile' })
export class KfThmProfileExportEntity {
    @PrimaryGeneratedColumn({ name: 'ClientCustomSPExportID' })
    ClientCustomSPExportID?: number;

    @Column({ name: 'ClientID', transformer: [KfStringToNumberTransformer] })
    ClientID: number;

    @Column({ name: 'RequestorEmail' })
    RequestorEmail: string;

    @Column({ name: 'ReasonforExport' })
    ReasonforExport: string;

    @Column({ name: 'LCID' })
    LCID: string;

    @Column({ name: 'AuthToken' })
    AuthToken: string;

    @Column({ name: 'GeneratedBy', transformer: [KfStringToNumberTransformer] })
    GeneratedBy: number;

    @Column({ name: 'GeneratedOn' })
    GeneratedOn: string;
}
