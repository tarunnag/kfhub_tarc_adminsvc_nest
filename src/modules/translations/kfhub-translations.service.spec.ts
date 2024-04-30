import { KfException, KfHttpsService } from '@kf-products-core/kfhub_svc_lib';
import { Test, TestingModule } from '@nestjs/testing';
import Axios from 'axios';
import { Common } from '../../common/common.interface';
import { CmsConnectionService } from './cms-connection.service';
import { KfHubTranslationsRepository } from './kfhub-translations.repository';
import { KfHubTranslationsService } from './kfhub-translations.service';
import { KfHubUpdateTranslationsService } from './kfhub-update-translations.service';
import * as mockData from './translations-data.mock';

describe('KfHubTranslationsService', () => {
    const getCompetenciesTranslationsSpy = jest.fn();
    const getTraitsDriversTranslationsSpy = jest.fn();
    const getTranslationsSpy = jest.fn();
    const insertToCompetenciesStatusTableSpy = jest.fn();
    const insertToCompetenciesStagingTableSpy = jest.fn();
    const insertToTraitsDriversStatusTableSpy = jest.fn();
    const insertToTraitsDriversStagingTableSpy = jest.fn();
    const updateTranslationsSpy = jest.fn();

    let module: TestingModule;
    let service: KfHubTranslationsService;
    let loggerLog: jest.SpyInstance;
    let loggerError: jest.SpyInstance;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [
                KfHubTranslationsService,
                {
                    provide: CmsConnectionService,
                    useValue: {
                        getCompetenciesTranslations: getCompetenciesTranslationsSpy,
                        getTraitsDriversTranslations: getTraitsDriversTranslationsSpy,
                    },
                },
                { provide: KfHubTranslationsRepository, useValue: { getTranslations: getTranslationsSpy } },
                {
                    provide: KfHubUpdateTranslationsService,
                    useValue: {
                        insertToCompetenciesStatusTable: insertToCompetenciesStatusTableSpy,
                        insertToCompetenciesStagingTable: insertToCompetenciesStagingTableSpy,
                        insertToTraitsDriversStatusTable: insertToTraitsDriversStatusTableSpy,
                        insertToTraitsDriversStagingTable: insertToTraitsDriversStagingTableSpy,
                        updateTranslations: updateTranslationsSpy,
                    },
                },
                KfHttpsService,
            ],
        }).compile();

        service = module.get(KfHubTranslationsService);
        loggerLog = jest.spyOn((service as any).logger, 'log').mockImplementation(() => {});
        loggerError = jest.spyOn((service as any).logger, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    test('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getTranslations', () => {
        test('should return the combined translations', async () => {
            // Arrange
            const categoryId = Common.Query.Categories.TRAITS;
            const languageId = 'de';
            const cmsLanguageId = 'de-DE';
            const query = {
                categoryId,
                languageId,
                cmsLanguageId,
            };
            const cmsTranslations = {};
            const translationsEnResponse = [
                {
                    GlobalCode: 'A',
                    JobSubcategoryName: 'Plans and Aligns',
                    JobSubcategoryDescription: 'Planning and prioritizing work to meet commitments aligned with organizational goals.',
                },
            ];
            const translationsLangResponse = [
                {
                    GlobalCode: 'A',
                    JobSubcategoryName: 'Planen und Ausrichten"',
                    JobSubcategoryDescription:
                        'Arbeit planen und nach Prioritäten ordnen, um Verpflichtungen in Übereinstimmung mit den Unternehmenszielen zu erfüllen',
                },
            ];
            const translationsEn = {
                A: {
                    name: 'Plans and Aligns',
                    descriptions: 'Planning and prioritizing work to meet commitments aligned with organizational goals.',
                },
            };
            const translationsLang = {
                A: {
                    name: 'Planen und Ausrichten',
                    descriptions: 'Arbeit planen und nach Prioritäten ordnen, um Verpflichtungen in Übereinstimmung mit den Unternehmenszielen zu erfüllen',
                },
            };

            const getCMSTranslationsSpy = jest.spyOn(service as any, 'getCMSTranslations').mockResolvedValueOnce(cmsTranslations);
            getTranslationsSpy.mockResolvedValueOnce(translationsEnResponse).mockResolvedValueOnce(translationsLangResponse);
            const getTranslationsMapSpy = jest
                .spyOn(service as any, 'getTranslationsMap')
                .mockReturnValueOnce(translationsEn)
                .mockReturnValueOnce(translationsLang);
            const combined = [];
            const combineTranslationsSpy = jest.spyOn(service as any, 'combineTranslations').mockReturnValueOnce(combined);

            // Act
            const result = await service.getTranslations(query);

            // Assert
            expect(result).toEqual(combined);
            expect(getCMSTranslationsSpy).toHaveBeenCalledWith(cmsLanguageId, categoryId);
            expect(getTranslationsSpy).toHaveBeenCalledWith('en', categoryId);
            expect(getTranslationsSpy).toHaveBeenCalledWith(languageId, categoryId);
            expect(getTranslationsMapSpy).toHaveBeenCalledWith(translationsEnResponse);
            expect(getTranslationsMapSpy).toHaveBeenCalledWith(translationsLangResponse);
            expect(combineTranslationsSpy).toHaveBeenCalledWith(translationsEn, cmsTranslations, translationsLang);
        });
    });

    describe('getTranslationsMap', () => {
        test('should map array to object with GlobalCode property like "key"', () => {
            // Arrange
            const arr = [
                {
                    GlobalCode: 'A',
                    JobSubcategoryName: 'Plans and Aligns',
                    JobSubcategoryDescription: 'Planning and prioritizing work to meet commitments aligned with organizational goals.',
                },
                {
                    GlobalCode: 'B',
                    JobSubcategoryName: 'Builds Effective Teams',
                    JobSubcategoryDescription: 'Building strong-identity teams that apply their diverse skills and perspectives to achieve common goals.',
                },
                {
                    GlobalCode: 'C',
                    JobSubcategoryName: 'Courage',
                    JobSubcategoryDescription: 'Stepping up to address difficult issues, saying what needs to be said.',
                },
            ];

            const obj = {
                a: {
                    name: 'Plans and Aligns',
                    description: 'Planning and prioritizing work to meet commitments aligned with organizational goals.',
                },
                b: {
                    name: 'Builds Effective Teams',
                    description: 'Building strong-identity teams that apply their diverse skills and perspectives to achieve common goals.',
                },
                c: {
                    name: 'Courage',
                    description: 'Stepping up to address difficult issues, saying what needs to be said.',
                },
            };

            // Act
            const result = (service as any).getTranslationsMap(arr);

            // Assert
            expect(result).toEqual(obj);
        });
    });

    describe('getCMSTranslations', () => {
        const lang = 'de-DE';
        const response = { factors: [] };
        const translations = {
            A: {
                name: 'Plans and Aligns',
                description: 'Planning and prioritizing work to meet commitments aligned with organizational goals.',
            },
        };

        [
            {
                category: Common.Query.Categories.COMPETENCIES,
                getMethod: getCompetenciesTranslationsSpy,
                mapMethod: 'getCompetenciesTranslationsFromResponse',
            },
            { category: Common.Query.Categories.TRAITS, getMethod: getTraitsDriversTranslationsSpy, mapMethod: 'getTraitsTranslationsFromResponse' },
            { category: Common.Query.Categories.DRIVERS, getMethod: getTraitsDriversTranslationsSpy, mapMethod: 'getDriversTranslationsFromResponse' },
        ].forEach((item) => {
            test(`should return cms translations by ${item.category}`, async () => {
                // Arrange
                item.getMethod.mockResolvedValueOnce(response);
                const mapSpy = jest.spyOn(service as any, item.mapMethod).mockReturnValueOnce(translations);

                // Act
                const resp = await (service as any).getCMSTranslations(lang, item.category);

                // Assert
                expect(resp).toEqual(translations);
                expect(item.getMethod).toHaveBeenCalledWith(lang);
                expect(mapSpy).toHaveBeenCalledWith(response);
            });
        });
    });

    describe('combineTranslations', () => {
        test('should combine the translations', () => {
            // Arrange
            const english = {
                A: {
                    name: 'Plans and Aligns',
                    description: 'Planning and prioritizing work to meet commitments aligned with organizational goals.',
                },
                B: {
                    name: 'Builds Effective Teams',
                    description: 'Building strong-identity teams that apply their diverse skills and perspectives to achieve common goals.',
                },
            };
            const cms = {
                A: {
                    name: 'Planen und Ausrichten',
                    description: 'Arbeit planen und nach Prioritäten ordnen, um Verpflichtungen in Übereinstimmung mit den Unternehmenszielen zu erfüllen',
                },
                B: {
                    name: 'Effektive Teams aufbauen',
                    description:
                        'Teams mit starker Identität aufbauen, die ihre vielfältigen Fähigkeiten und Perspektiven zum Erreichen gemeinsamer Ziele einsetzen',
                },
            };
            const deployed = {
                A: {
                    name: 'Planen und Ausrichten',
                    description: 'Arbeit planen und nach Prioritäten ordnen, um Verpflichtungen in Übereinstimmung mit den Unternehmenszielen zu erfüllen',
                },
                B: {
                    name: 'Effektive Teams aufbauen',
                    description:
                        'Teams mit starker Identität aufbauen, die ihre vielfältigen Fähigkeiten und Perspektiven zum Erreichen gemeinsamer Ziele einsetzen',
                },
            };
            const expected = [
                {
                    english: {
                        name: 'Plans and Aligns',
                        description: 'Planning and prioritizing work to meet commitments aligned with organizational goals.',
                    },
                    cms: {
                        name: 'Planen und Ausrichten',
                        description: 'Arbeit planen und nach Prioritäten ordnen, um Verpflichtungen in Übereinstimmung mit den Unternehmenszielen zu erfüllen',
                    },
                    deployed: {
                        name: 'Planen und Ausrichten',
                        description: 'Arbeit planen und nach Prioritäten ordnen, um Verpflichtungen in Übereinstimmung mit den Unternehmenszielen zu erfüllen',
                    },
                },
                {
                    english: {
                        name: 'Builds Effective Teams',
                        description: 'Building strong-identity teams that apply their diverse skills and perspectives to achieve common goals.',
                    },
                    cms: {
                        name: 'Effektive Teams aufbauen',
                        description:
                            'Teams mit starker Identität aufbauen, die ihre vielfältigen Fähigkeiten und Perspektiven zum Erreichen gemeinsamer Ziele einsetzen',
                    },
                    deployed: {
                        name: 'Effektive Teams aufbauen',
                        description:
                            'Teams mit starker Identität aufbauen, die ihre vielfältigen Fähigkeiten und Perspektiven zum Erreichen gemeinsamer Ziele einsetzen',
                    },
                },
            ];

            // Act
            const result = (service as any).combineTranslations(english, cms, deployed);

            // Assert
            expect(result).toEqual(expected);
        });
    });

    describe('getCompetenciesTranslationsFromResponse', () => {
        test('should extract competencies translations', () => {
            // Arrange
            const response = {
                factors: [
                    {
                        clusters: [
                            {
                                competencies: [
                                    {
                                        globalCode: 'A',
                                        name: 'a',
                                        description: 'aaaaa',
                                    },
                                    {
                                        globalCode: 'B',
                                        name: 'b',
                                        description: 'bbbbb',
                                    },
                                ],
                            },
                            {
                                competencies: [
                                    {
                                        globalCode: 'C',
                                        name: 'c',
                                        description: 'ccccc',
                                    },
                                    {
                                        globalCode: 'D',
                                        name: 'd',
                                        description: 'ddddd',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        clusters: [
                            {
                                competencies: [
                                    {
                                        globalCode: 'E',
                                        name: 'e',
                                        description: 'eeeee',
                                    },
                                    {
                                        globalCode: 'F',
                                        name: 'f',
                                        description: 'fffff',
                                    },
                                ],
                            },
                            {
                                competencies: [
                                    {
                                        globalCode: 'G',
                                        name: 'g',
                                        description: 'ggggg',
                                    },
                                    {
                                        globalCode: 'H',
                                        name: 'h',
                                        description: 'hhhhh',
                                    },
                                ],
                            },
                            {
                                competencies: [
                                    {
                                        globalCode: 'I',
                                        name: 'i',
                                        description: 'iiiii',
                                    },
                                    {
                                        globalCode: 'J',
                                        name: 'j',
                                        description: 'jjjjj',
                                    },
                                    {
                                        globalCode: 'K',
                                        name: 'k',
                                        description: 'kkkkk',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
            const expected = {
                a: {
                    name: 'a',
                    description: 'aaaaa',
                },
                b: {
                    name: 'b',
                    description: 'bbbbb',
                },
                c: {
                    name: 'c',
                    description: 'ccccc',
                },
                d: {
                    name: 'd',
                    description: 'ddddd',
                },
                e: {
                    name: 'e',
                    description: 'eeeee',
                },
                f: {
                    name: 'f',
                    description: 'fffff',
                },
                g: {
                    name: 'g',
                    description: 'ggggg',
                },
                h: {
                    name: 'h',
                    description: 'hhhhh',
                },
                i: {
                    name: 'i',
                    description: 'iiiii',
                },
                j: {
                    name: 'j',
                    description: 'jjjjj',
                },
                k: {
                    name: 'k',
                    description: 'kkkkk',
                },
            };

            // Act
            const result = (service as any).getCompetenciesTranslationsFromResponse(response);

            // Assert
            expect(result).toEqual(expected);
        });
    });

    describe('getTraitsTranslationsFromResponse', () => {
        test('should map response', () => {
            // Arrange
            const response = {
                sections: {
                    traits: {
                        components: {
                            traitsScores: {
                                content: {
                                    definitions: {
                                        exp: {
                                            cu: {
                                                title: 'Neugier',
                                                definition:
                                                    'Das Ausmaß, in dem eine Person Probleme auf eine neue Weise angeht, Muster in komplexen Informationen erkennt und sich tiefgreifende Kenntnisse aneignet.',
                                                longName: 'NEUGIER (CU)',
                                                abbreviation: 'CU',
                                                globalCode: 'CU',
                                            },
                                            ta: {
                                                title: 'Ambiguitätstoleranz',
                                                definition:
                                                    'Fähigkeit, mit unsicheren, vagen oder widersprüchlichen Informationen umzugehen, die ein klares Verständnis oder eine klare Richtung verhindern.',
                                                longName: 'AMBIGUITÄTSTOLERANZ (TA)',
                                                abbreviation: 'TA',
                                                globalCode: 'TA',
                                            },
                                            ad: {
                                                title: 'Anpassungsfähigkeit',
                                                definition: 'Fähigkeit, mit unerwarteten Änderungen der Richtung oder des Ansatzes gut umgehen zu können.',
                                                longName: 'ANPASSUNGSFÄHIGKEIT (AD)',
                                                abbreviation: 'AD',
                                                globalCode: 'AD',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            };
            const expected = {
                cu: {
                    name: 'Neugier',
                    description:
                        'Das Ausmaß, in dem eine Person Probleme auf eine neue Weise angeht, Muster in komplexen Informationen erkennt und sich tiefgreifende Kenntnisse aneignet.',
                },
                ta: {
                    name: 'Ambiguitätstoleranz',
                    description:
                        'Fähigkeit, mit unsicheren, vagen oder widersprüchlichen Informationen umzugehen, die ein klares Verständnis oder eine klare Richtung verhindern.',
                },
                ad: {
                    name: 'Anpassungsfähigkeit',
                    description: 'Fähigkeit, mit unerwarteten Änderungen der Richtung oder des Ansatzes gut umgehen zu können.',
                },
            };

            // Act
            const result = (service as any).getTraitsTranslationsFromResponse(response);

            // Assert
            expect(result).toEqual(expected);
        });
    });

    describe('getDriversTranslationsFromResponse', () => {
        test('should map response', () => {
            // Arrange
            const response = {
                sections: {
                    drivers: {
                        components: {
                            driversScores: {
                                content: {
                                    definitions: {
                                        chal: {
                                            name: 'Herausforderung',
                                            definition: 'Wird durch Erfolge trotz schwieriger Hindernisse motiviert.',
                                        },
                                        indy: {
                                            name: 'Unabhängigkeit',
                                            definition: 'Arbeitet lieber frei, eigenständig und mit begrenzter Beteiligung anderer.',
                                        },
                                        bala: {
                                            name: 'Balance',
                                            definition:
                                                'Ist motiviert, Arbeits- und Privatleben auf nachhaltige, angenehme und bedeutungsvolle Weise miteinander zu verbinden.',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            };
            const expected = {
                chal: {
                    name: 'Herausforderung',
                    description: 'Wird durch Erfolge trotz schwieriger Hindernisse motiviert.',
                },
                indy: {
                    name: 'Unabhängigkeit',
                    description: 'Arbeitet lieber frei, eigenständig und mit begrenzter Beteiligung anderer.',
                },
                bala: {
                    name: 'Balance',
                    description: 'Ist motiviert, Arbeits- und Privatleben auf nachhaltige, angenehme und bedeutungsvolle Weise miteinander zu verbinden.',
                },
            };

            // Act
            const result = (service as any).getDriversTranslationsFromResponse(response);

            // Assert
            expect(result).toEqual(expected);
        });
    });

    describe('updateTranslations', () => {
        test('should throw KfException if there are no authToken', async () => {
            // Arrange
            let err;

            // Act
            try {
                await service.updateTranslations({} as Common.Query.TranslationProps, '');
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
            expect(err).toBeInstanceOf(KfException);
        });

        test('should throw KfException if getTokenMeta failed', async () => {
            // Arrange
            let err;
            jest.spyOn(service as any, 'getTokenMeta').mockImplementationOnce(() => {
                throw new Error();
            });

            // Act
            try {
                await service.updateTranslations({} as Common.Query.TranslationProps, '123');
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
            expect(err).toBeInstanceOf(KfException);
        });
        [
            { categoryId: Common.Query.Categories.COMPETENCIES, method: 'updateCompetencies' },
            { categoryId: Common.Query.Categories.TRAITS, method: 'updateTraits' },
            { categoryId: Common.Query.Categories.DRIVERS, method: 'updateDrivers' },
        ].forEach((item) => {
            test(`should call ${item.method} if categoryId is ${item.categoryId}`, async () => {
                // Arrange
                const body = {
                    categoryId: item.categoryId,
                    languageId: 'ru',
                    cmsLanguageId: 'ru-RU',
                };
                const spyMethod = jest.spyOn(service as any, item.method).mockResolvedValueOnce(true);
                const userId = 10;
                jest.spyOn(service as any, 'getTokenMeta').mockResolvedValueOnce({ userid: userId });

                // Act
                await service.updateTranslations(body, '123');

                // Assert
                expect(spyMethod).toHaveBeenCalledWith(userId, body.categoryId, body.languageId, body.cmsLanguageId);
            });
        });
    });

    describe('updateCompetencies', () => {
        test('should throw error if getCompetenciesTranslations failed', async () => {
            // Arrange
            const userId = 123;
            const categoryId = Common.Query.Categories.COMPETENCIES;
            const languageId = 'ru';
            const cmsLanguageId = 'ru-RU';
            let err;
            insertToCompetenciesStatusTableSpy.mockResolvedValueOnce({ id: 123, guid: '321' });
            getCompetenciesTranslationsSpy.mockImplementationOnce(() => {
                throw new Error();
            });

            // Act
            try {
                await (service as any).updateCompetencies(userId, categoryId, languageId, cmsLanguageId);
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
            expect(err).toBeInstanceOf(KfException);
        });

        test('should throw error if prepareCompetencesToInsert failed', async () => {
            // Arrange
            const userId = 123;
            const categoryId = Common.Query.Categories.COMPETENCIES;
            const languageId = 'ru';
            const cmsLanguageId = 'ru-RU';
            let err;
            insertToCompetenciesStatusTableSpy.mockResolvedValueOnce({ id: 123, guid: '321' });
            getCompetenciesTranslationsSpy.mockResolvedValueOnce({});
            insertToCompetenciesStagingTableSpy;
            updateTranslationsSpy;
            jest.spyOn(service as any, 'prepareCompetencesToInsert').mockImplementationOnce(() => {
                throw new Error();
            });

            // Act
            try {
                await (service as any).updateCompetencies(userId, categoryId, languageId, cmsLanguageId);
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
            expect(err).toBeInstanceOf(KfException);
        });

        test('should insert to competencies staging table for each translation', async () => {
            // Arrange
            const userId = 123;
            const categoryId = Common.Query.Categories.COMPETENCIES;
            const languageId = 'ru';
            const cmsLanguageId = 'ru-RU';
            const translations = [{ id: 1 }, { id: 2 }, { id: 3 }];
            insertToCompetenciesStatusTableSpy.mockResolvedValueOnce({ id: 123, guid: '321' });
            getCompetenciesTranslationsSpy.mockResolvedValueOnce({});
            jest.spyOn(service as any, 'prepareCompetencesToInsert').mockReturnValueOnce(translations);

            // Act
            await (service as any).updateCompetencies(userId, categoryId, languageId, cmsLanguageId);

            // Assert
            expect(insertToCompetenciesStagingTableSpy).toHaveBeenCalledTimes(translations.length);
            translations.forEach((translation) => {
                expect(insertToCompetenciesStagingTableSpy).toHaveBeenCalledWith(translation);
            });
        });

        test('should update translations after all translations insert in table', async () => {
            // Arrange
            const userId = 123;
            const categoryId = Common.Query.Categories.COMPETENCIES;
            const languageId = 'ru';
            const cmsLanguageId = 'ru-RU';
            const translations = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const guid = 'guid';
            insertToCompetenciesStatusTableSpy.mockResolvedValueOnce({ id: 123, guid });
            getCompetenciesTranslationsSpy.mockResolvedValueOnce({});
            jest.spyOn(service as any, 'prepareCompetencesToInsert').mockReturnValueOnce(translations);

            // Act
            await (service as any).updateCompetencies(userId, categoryId, languageId, cmsLanguageId);

            // Assert
            expect(updateTranslationsSpy).toHaveBeenCalledWith(guid, categoryId, languageId, cmsLanguageId);
        });
    });

    describe('updateDrivers', () => {
        test('should throw error if getTraitsDriversTranslations failed', async () => {
            // Arrange
            const userId = 123;
            const categoryId = Common.Query.Categories.DRIVERS;
            const languageId = 'ru';
            const cmsLanguageId = 'ru-RU';
            let err;
            insertToTraitsDriversStatusTableSpy.mockResolvedValueOnce({ id: 123, guid: '321' });
            getTraitsDriversTranslationsSpy.mockImplementationOnce(() => {
                throw new Error();
            });

            // Act
            try {
                await (service as any).updateDrivers(userId, categoryId, languageId, cmsLanguageId);
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
            expect(err).toBeInstanceOf(KfException);
        });

        test('should throw error if prepareDriversToInsert failed', async () => {
            // Arrange
            const userId = 123;
            const categoryId = Common.Query.Categories.DRIVERS;
            const languageId = 'ru';
            const cmsLanguageId = 'ru-RU';
            let err;
            insertToTraitsDriversStatusTableSpy.mockResolvedValueOnce({ id: 123, guid: '321' });
            getTraitsDriversTranslationsSpy.mockResolvedValueOnce({});
            jest.spyOn(service as any, 'prepareDriversToInsert').mockImplementationOnce(() => {
                throw new Error();
            });

            // Act
            try {
                await (service as any).updateDrivers(userId, categoryId, languageId, cmsLanguageId);
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
            expect(err).toBeInstanceOf(KfException);
        });

        test('should insert to competencies staging table for each translation', async () => {
            // Arrange
            const userId = 123;
            const categoryId = Common.Query.Categories.DRIVERS;
            const languageId = 'ru';
            const cmsLanguageId = 'ru-RU';
            const translations = [{ id: 1 }, { id: 2 }, { id: 3 }];
            insertToTraitsDriversStatusTableSpy.mockResolvedValueOnce({ id: 123, guid: '321' });
            getTraitsDriversTranslationsSpy.mockResolvedValueOnce({});
            jest.spyOn(service as any, 'prepareDriversToInsert').mockReturnValueOnce(translations);
            insertToTraitsDriversStagingTableSpy.mockReset();

            // Act
            await (service as any).updateDrivers(userId, categoryId, languageId, cmsLanguageId);
            // Assert
            expect(insertToTraitsDriversStagingTableSpy).toHaveBeenCalledTimes(translations.length);
            translations.forEach((translation) => {
                expect(insertToTraitsDriversStagingTableSpy).toHaveBeenCalledWith(translation);
            });
        });

        test('should update translations after all translations insert in table', async () => {
            // Arrange
            const userId = 123;
            const categoryId = Common.Query.Categories.DRIVERS;
            const languageId = 'ru';
            const cmsLanguageId = 'ru-RU';
            const translations = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const guid = 'guid';
            insertToTraitsDriversStatusTableSpy.mockResolvedValueOnce({ id: 123, guid });
            getTraitsDriversTranslationsSpy.mockResolvedValueOnce({});
            jest.spyOn(service as any, 'prepareDriversToInsert').mockReturnValueOnce(translations);

            // Act
            await (service as any).updateDrivers(userId, categoryId, languageId, cmsLanguageId);

            // Assert
            expect(updateTranslationsSpy).toHaveBeenCalledWith(guid, categoryId, languageId, cmsLanguageId);
        });
    });

    describe('updateTraits', () => {
        test('should throw error if getTraitsDriversTranslations failed', async () => {
            // Arrange
            const userId = 123;
            const categoryId = Common.Query.Categories.TRAITS;
            const languageId = 'ru';
            const cmsLanguageId = 'ru-RU';
            let err;
            insertToTraitsDriversStatusTableSpy.mockResolvedValueOnce({ id: 123, guid: '321' });
            getTraitsDriversTranslationsSpy.mockImplementationOnce(() => {
                throw new Error();
            });

            // Act
            try {
                await (service as any).updateTraits(userId, categoryId, languageId, cmsLanguageId);
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
            expect(err).toBeInstanceOf(KfException);
        });

        test('should throw error if prepareDriversToInsert failed', async () => {
            // Arrange
            const userId = 123;
            const categoryId = Common.Query.Categories.TRAITS;
            const languageId = 'ru';
            const cmsLanguageId = 'ru-RU';
            let err;
            insertToTraitsDriversStatusTableSpy.mockResolvedValueOnce({ id: 123, guid: '321' });
            getTraitsDriversTranslationsSpy.mockResolvedValueOnce({});
            jest.spyOn(service as any, 'prepareTraitsToInsert').mockImplementationOnce(() => {
                throw new Error();
            });

            // Act
            try {
                await (service as any).updateTraits(userId, categoryId, languageId, cmsLanguageId);
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
            expect(err).toBeInstanceOf(KfException);
        });

        test('should insert to competencies staging table for each translation', async () => {
            // Arrange
            const userId = 123;
            const categoryId = Common.Query.Categories.TRAITS;
            const languageId = 'ru';
            const cmsLanguageId = 'ru-RU';
            const translations = [{ id: 1 }, { id: 2 }, { id: 3 }];
            insertToTraitsDriversStatusTableSpy.mockResolvedValueOnce({ id: 123, guid: '321' });
            getTraitsDriversTranslationsSpy.mockResolvedValueOnce({});
            jest.spyOn(service as any, 'prepareTraitsToInsert').mockReturnValueOnce(translations);
            insertToTraitsDriversStagingTableSpy.mockReset();

            // Act
            await (service as any).updateTraits(userId, categoryId, languageId, cmsLanguageId);

            // Assert
            expect(insertToTraitsDriversStagingTableSpy).toHaveBeenCalledTimes(translations.length);
            translations.forEach((translation) => {
                expect(insertToTraitsDriversStagingTableSpy).toHaveBeenCalledWith(translation);
            });
        });

        test('should update translations after all translations insert in table', async () => {
            // Arrange
            const userId = 123;
            const categoryId = Common.Query.Categories.TRAITS;
            const languageId = 'ru';
            const cmsLanguageId = 'ru-RU';
            const translations = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const guid = 'guid';
            insertToTraitsDriversStatusTableSpy.mockResolvedValueOnce({ id: 123, guid });
            getTraitsDriversTranslationsSpy.mockResolvedValueOnce({});
            jest.spyOn(service as any, 'prepareTraitsToInsert').mockReturnValueOnce(translations);

            // Act
            await (service as any).updateTraits(userId, categoryId, languageId, cmsLanguageId);

            // Assert
            expect(updateTranslationsSpy).toHaveBeenCalledWith(guid, categoryId, languageId, cmsLanguageId);
        });
    });

    describe('getTokenMeta', () => {
        test('should throw error if there are no userid in response', async () => {
            // Arrange
            let err;
            jest.spyOn((service as any).http, 'get').mockResolvedValueOnce({});

            // Act
            try {
                await (service as any).getTokenMeta('');
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
        });

        test('should return result with userid', async () => {
            // Arrange
            const expected = { userid: 'userid' };
            jest.spyOn(Axios as any, 'create').mockImplementationOnce(() => ({
                get: jest.fn(async () => ({ data: expected })),
            }));
            // Act
            const result = await (service as any).getTokenMeta('');

            // Assert
            expect(result).toEqual(expected);
        });
    });

    describe('prepareCompetencesToInsert', () => {
        test('should map factors.clusters.competencies to CompetencesTranslationTableView[]', () => {
            // Act
            const result = (service as any).prepareCompetencesToInsert(mockData.CMSCompetenciesResponse, 'de-DE', 123);

            // Asser
            expect(result).toEqual(mockData.CMSCompetenciesMap);
        });
    });

    describe('prepareTraitsToInsert', () => {
        test('should map sections.traits.components.traitsScores.content.definitions to CTraitsDriverTableView[]', () => {
            // Act
            const result = (service as any).prepareTraitsToInsert(mockData.CMSTestDriversResponse, 'de-DE', 123);

            // Asser
            expect(result).toEqual(mockData.CMSTraitsMap);
        });
    });

    describe('prepareDriversToInsert', () => {
        test('should map sections.drivers.components.driversScores.content.definitions to CTraitsDriverTableView[]', () => {
            // Act
            const result = (service as any).prepareDriversToInsert(mockData.CMSTestDriversResponse, 'de-DE', 123);

            // Asser
            expect(result).toEqual(mockData.CMSDriversMap);
        });
    });
});
