import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { KfStringToNumberTransformer } from '@kf-products-core/kfhub_svc_lib';

@Entity('ProfileUploadFromEmpPayData', { database: 'SuccessProfile' })
export class KfThmInsertDataEntity {
    @PrimaryColumn({ name: 'ProfileUploadFromEmpPayDataID' })
    ProfileUploadFromEmpPayDataID: number;

    @Column({ name: 'ProfileRecordID', transformer: [KfStringToNumberTransformer] })
    ProfileRecordID: number;

    @Column({ name: 'CountryID', transformer: [KfStringToNumberTransformer] })
    CountryID: number;

    @Column({ name: 'CompanyID', transformer: [KfStringToNumberTransformer] })
    CompanyID: number;

    @Column({ name: 'CompanyOrgCode' })
    CompanyOrgCode: string;

    @Column({ name: 'CompanyName' })
    CompanyName: string;

    @Column({ name: 'ClientJobCode' })
    ClientJobCode: string;

    @Column({ name: 'HideInProfileManager' })
    HideInProfileManager: number;

    @Column({ name: 'ClientFamily' })
    ClientFamily: string;

    @Column({ name: 'ReferenceLevel', transformer: [KfStringToNumberTransformer] })
    ReferenceLevel: number;

    @Column({ name: 'JobCode' })
    JobCode: string;

    @Column({ name: 'KFFamilyCode' })
    KFFamilyCode: string;

    @Column({ name: 'KFSubfamilyCode' })
    KFSubfamilyCode: string;

    @Column({ name: 'ClientJobtitle' })
    ClientJobtitle: string;

    @Column({ name: 'ClientJobSummary' })
    ClientJobSummary: string;

    @Column({ name: 'MappedSPClientJobID', transformer: [KfStringToNumberTransformer] })
    MappedSPClientJobID: number;

    @Column({ name: 'CreatedOn' })
    CreatedOn: Date;

    @Column({ name: 'CreateBy', transformer: [KfStringToNumberTransformer] })
    CreateBy: number;

    @Column({ name: 'ClientJobID', transformer: [KfStringToNumberTransformer] })
    ClientJobID: number;

    @Column({ name: 'BICProfileJRTDetailID' })
    BICProfileJRTDetailID: string;

    @Column({ name: 'ArchitectJobFlag' })
    ArchitectJobFlag: string;

    @Column({ name: 'ArchitectJobCode' })
    ArchitectJobCode: string;

    @Column({ name: 'BenchMarkFlag' })
    BenchMarkFlag: string;

    @Column({ name: 'CustomProfileID' })
    CustomProfileID: string;

    @Column({name: 'LCID'})
    LCID: string;
}
