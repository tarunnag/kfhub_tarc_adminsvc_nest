import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('KFTranslations', { database: 'SuccessProfile' })
export class KfTranslationsEntity {
    @PrimaryGeneratedColumn({ name: 'JobSubCategoryCde' })
    JobSubCategoryCde: string;

    @Column({ name: 'JobSubcategoryName' })
    JobSubcategoryName: string;

    @Column({ name: 'JobSubcategoryDescription' })
    JobSubcategoryDescription: string;

    @Column({ name: 'GlobalCode' })
    GlobalCode: string;
}
