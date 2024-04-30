import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';
import { Test, TestingModule } from '@nestjs/testing';
import { KfException } from '@kf-products-core/kfhub_svc_lib';
import { KfThmSuccessprofileService } from './kfthm-successprofile.service';
import { SpMssqlService } from './kfthm-successprofile-mssql.service';
import { spQuery, metadataQuery, thPortalProfiles, preferedLanguages, getSpDataResult, getSpDataEmptyResult, metadata, getMetadataResult, getMetadataEmptyResult } from './kfthm-successprofile.fixture';

describe('KfThmSuccessprofileService', () => {
    let module: TestingModule;
    let spService: KfThmSuccessprofileService;
    const getThPortalProfilesMock = jest.fn();
    const getThPortalMetadataMock = jest.fn();
    const getClientPreferedLanguageMock = jest.fn();

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [
                KfThmSuccessprofileService,
                KfConfigService,
                { provide: SpMssqlService, useValue: {getThPortalProfiles: getThPortalProfilesMock, 
                    getClientPreferedLanguage: getClientPreferedLanguageMock,
                    getThPortalMetadata: getThPortalMetadataMock
                }},
            ],
        }).compile();

        spService = module.get(KfThmSuccessprofileService);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    describe('getSuccessProfilesData', () => {
        test('should map SP data from db correctly', async () => {
            // Arrange
            getThPortalProfilesMock.mockResolvedValueOnce(thPortalProfiles);
            getClientPreferedLanguageMock.mockResolvedValueOnce(preferedLanguages);
            // Act
            const result = await spService.getSuccessProfilesData(spQuery);

            // Assert
            expect(result).toEqual(getSpDataResult);
        });
        test('should map metadata from db correctly', async () => {
            // Arrange
            getThPortalMetadataMock.mockResolvedValueOnce(metadata);

            // Act
            const result = await spService.getSuccessProfilesData(metadataQuery);

            // Assert
            expect(result).toEqual(getMetadataResult);
        });
        test('should return empty result if no SP data in DB', async () => {
            // Arrange
            getThPortalProfilesMock.mockResolvedValueOnce([]);
            getClientPreferedLanguageMock.mockResolvedValueOnce([]);
            // Act
            const result = await spService.getSuccessProfilesData(spQuery);

            // Assert
            expect(result).toEqual(getSpDataEmptyResult);
        });
        test('should return empty result if no Metadata data in DB', async () => {
            // Arrange
            getThPortalMetadataMock.mockResolvedValueOnce([]);

            // Act
            const result = await spService.getSuccessProfilesData(metadataQuery);

            // Assert
            expect(result).toEqual(getMetadataEmptyResult);
        });
        test('query parsing should not fail on incorrect params', async () => {
            // Arrange
            getThPortalProfilesMock.mockResolvedValueOnce(thPortalProfiles);
            getClientPreferedLanguageMock.mockResolvedValueOnce(preferedLanguages);

            // Act
            const resultF = await spService.getSuccessProfilesData(Object.assign(spQuery,{sortBy: 'incorrect'}, {sortColumn: 'incorrect'}));

            // Assert
            expect(resultF).toBeDefined();
        });
        test('should throw KfException on error', async () => {
            // Arrange
            getThPortalProfilesMock.mockImplementationOnce(()=> {throw new Error()});

            // Act
            const resultF = spService.getSuccessProfilesData(spQuery);

            // Assert
            await expect(resultF).rejects.toThrowError(KfException);
        });
    });
});
