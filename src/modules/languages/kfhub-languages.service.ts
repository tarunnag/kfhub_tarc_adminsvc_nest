import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KfLanguagesEntity } from './kfhub-languages.entity';
import { KfHubLanguagesDTO } from './kfhub-languages.interface';
import { KfHubLanguagesRepository } from './kfhub-languages.repository';

@Injectable()
export class KfHubLanguagesService {
    constructor(@InjectRepository(KfHubLanguagesRepository) private readonly repository: KfHubLanguagesRepository) {}

    async getLanguages(): Promise<KfHubLanguagesDTO[]> {
        return (await this.repository.getLanguages()).map(this.mapEntityToDTO);
    }

    private mapEntityToDTO(entity: KfLanguagesEntity): KfHubLanguagesDTO {
        return { id: entity.LCID, name: entity.LanguageName, cmsId: entity.CMSCode };
    }
}
