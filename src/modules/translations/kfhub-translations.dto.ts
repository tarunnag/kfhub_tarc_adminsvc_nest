export interface TranslationDTO {
    name: string;
    description: string;
}

export interface TranslationsDTO {
    english: TranslationDTO;
    cms: TranslationDTO;
    deployed: TranslationDTO;
}

export class TranslationsRO {
    english: TranslationDTO;
    cms: TranslationDTO;
    deployed: TranslationDTO;
}
