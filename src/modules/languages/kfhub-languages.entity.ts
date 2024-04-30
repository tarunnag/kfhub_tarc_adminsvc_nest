import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('KFLanguages', { database: 'SuccessProfile' })
export class KfLanguagesEntity {
    @PrimaryGeneratedColumn({ name: 'LCID' })
    LCID: string;

    @Column({ name: 'LanguageName' })
    LanguageName: string;

    @Column({ name: 'CMSCode' })
    CMSCode: string;
}
