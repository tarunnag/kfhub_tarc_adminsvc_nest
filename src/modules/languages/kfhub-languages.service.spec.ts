import { Test, TestingModule } from '@nestjs/testing';
import { KfHubLanguagesRepository } from './kfhub-languages.repository';
import { KfHubLanguagesService } from './kfhub-languages.service';

describe('KfHubLanguagesService', () => {
    const expected = {
        id: 'ru',
        name: 'Russian',
        cmsId: 'ru-RU',
    };
    const response = {
        LCID: 'ru',
        LanguageName: 'Russian',
        CMSCode: 'ru-RU',
    };
    let module: TestingModule;
    let service: KfHubLanguagesService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [KfHubLanguagesService, KfHubLanguagesRepository],
        }).compile();
    });

    beforeEach(() => {
        service = module.get(KfHubLanguagesService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should be define', () => {
        // Assert
        expect(service).toBeDefined();
    });

    describe('mapEntityToDTO', () => {
        test('should map KfLanguagesEntity to KfHubLanguagesDTO', () => {
            // Act
            const result = (service as any).mapEntityToDTO(response);

            // Assert
            expect(result).toEqual(expected);
        });
    });

    describe('getLanguages', () => {
        test('should return repository.getLanguages and map it', async () => {
            // Arrange
            jest.spyOn((service as any).repository, 'getLanguages').mockResolvedValueOnce([response]);

            // Act
            const result = await service.getLanguages();

            // Assert
            expect(result).toEqual([expected]);
        });
    });
});
