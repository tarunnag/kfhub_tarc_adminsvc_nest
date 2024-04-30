import { Test, TestingModule } from '@nestjs/testing';
import { KfHubUpdateTranslationsService } from './kfhub-update-translations.service';
import { Common } from '../../common/common.interface';
import * as uuid from 'uuid';
import { KfDbException } from '@kf-products-core/kfhub_svc_lib';

import * as typeorm from 'typeorm';
jest.mock('typeorm', () => {
    const actual = jest.requireActual('typeorm');
    return {
        ...actual,
    };
});
jest.mock('uuid', () => {
    const actual = jest.requireActual('uuid');
    return {
        ...actual,
    };
});

describe('KfHubUpdateTranslationsService', () => {
    let module: TestingModule;
    let service: KfHubUpdateTranslationsService;
    let getManager = jest.fn();
    let getConnection = jest.fn();

    beforeAll(async () => {
        (typeorm as any).getManager = getManager;
        (typeorm as any).getConnection = getConnection;
        module = await Test.createTestingModule({
            providers: [KfHubUpdateTranslationsService],
        }).compile();
        service = module.get(KfHubUpdateTranslationsService);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    test('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getCategory', () => {
        [
            { category: Common.Query.Categories.COMPETENCIES, result: 'BEHAVIORAL_SKILLS' },
            { category: Common.Query.Categories.TRAITS, result: 'TRAITS' },
            { category: Common.Query.Categories.DRIVERS, result: 'DRIVERS' },
        ].forEach((item) => {
            test(`should return ${item.result} if category is ${item.category}`, () => {
                // Assert
                expect((service as any).getCategory(item.category)).toEqual(item.result);
            });
        });

        test('should return an error if category not from Common.Query.Categories.COMPETENCIES', () => {
            // Arrange
            let err;

            // Act
            try {
                (service as any).getCategory('NOT_FROM_ENUM');
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
        });
    });

    describe('generateGUID', () => {
        test('should generate uniq id', () => {
            // Arrange
            const guidList = ['foo', 'bar', 'baz'];
            const guid = 'qaz';
            jest.spyOn(uuid, 'v4').mockReturnValueOnce(guidList[2]).mockReturnValueOnce(guidList[1]).mockReturnValueOnce(guid);

            // Act
            const result = (service as any).generateGUID(guidList);

            // Assert
            expect(result).toEqual(guid);
        });
    });

    ['getTraitsDriversStatusGUID', 'getCompetenciesStatusGUID'].forEach((method) => {
        describe(method, () => {
            test('should return GUID', async () => {
                // Arrange
                const guid = 'qaz';
                jest.spyOn(service as any, 'generateGUID').mockReturnValueOnce(guid);
                getConnection.mockReturnValueOnce({ driver: { escapeQueryWithParameters: jest.fn().mockReturnValueOnce(['foo', 'bar']) } });
                getManager.mockReturnValueOnce({ query: jest.fn().mockResolvedValueOnce(['foo', 'bar']) });

                // Act

                const result = await (service as any)[method]();

                // Assert
                expect(result).toEqual(guid);
            });

            test('should throw KfDbException if query failed', async () => {
                // Arrange
                getConnection.mockReturnValueOnce({ driver: { escapeQueryWithParameters: jest.fn().mockReturnValueOnce(['foo', 'bar']) } });
                getManager.mockReturnValueOnce({
                    query: jest.fn().mockImplementationOnce(() => {
                        throw new Error('message');
                    }),
                });
                let err;

                // Act
                try {
                    await (service as any)[method]();
                } catch (e) {
                    err = e;
                }

                // Assert
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(KfDbException);
            });
        });
    });

    describe('updateTranslations', () => {
        test('should call stored proc with arguments', async () => {
            // Arrange
            const querySpy = jest.fn();
            const GUID: string = 'GUID';
            const category = Common.Query.Categories.COMPETENCIES;
            const LCID: string = 'LCID';
            const CMSLCID: string = 'CMSLCID';
            const escapedQuery = 'escapedQuery';
            const parameters = 'parameters';
            getConnection.mockReturnValueOnce({ driver: { escapeQueryWithParameters: jest.fn().mockReturnValueOnce([escapedQuery, parameters]) } });
            getManager.mockReturnValueOnce({ query: querySpy });

            // Act
            await service.updateTranslations(GUID, category, LCID, CMSLCID);

            // Assert
            expect(querySpy).toHaveBeenCalledWith(escapedQuery, parameters);
        });

        test('should return error if query failed', async () => {
            // Arrange
            const GUID: string = 'GUID';
            const category = Common.Query.Categories.COMPETENCIES;
            const LCID: string = 'LCID';
            const CMSLCID: string = 'CMSLCID';
            const escapedQuery = 'escapedQuery';
            const parameters = 'parameters';
            getConnection.mockReturnValueOnce({ driver: { escapeQueryWithParameters: jest.fn().mockReturnValueOnce([escapedQuery, parameters]) } });
            getManager.mockReturnValueOnce({
                query: jest.fn().mockImplementationOnce(() => {
                    throw new Error('message');
                }),
            });
            let err;

            // Act
            try {
                await service.updateTranslations(GUID, category, LCID, CMSLCID);
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
            expect(err).toBeInstanceOf(KfDbException);
        });
    });

    ['insertToTraitsDriversStagingTable', 'insertToCompetenciesStagingTable'].forEach((method) => {
        describe(method, () => {
            test('should call stored proc with arguments', async () => {
                // Arrange
                const querySpy = jest.fn();
                const translation = {};
                const escapedQuery = 'escapedQuery';
                const parameters = 'parameters';
                getConnection.mockReturnValueOnce({ driver: { escapeQueryWithParameters: jest.fn().mockReturnValueOnce([escapedQuery, parameters]) } });
                getManager.mockReturnValueOnce({ query: querySpy });

                // Act
                await service[method](translation);

                // Assert
                expect(querySpy).toHaveBeenCalledWith(escapedQuery, parameters);
            });

            test('should return error if query failed', async () => {
                // Arrange
                const translation = {};
                const escapedQuery = 'escapedQuery';
                const parameters = 'parameters';
                getConnection.mockReturnValueOnce({ driver: { escapeQueryWithParameters: jest.fn().mockReturnValueOnce([escapedQuery, parameters]) } });
                getManager.mockReturnValueOnce({
                    query: jest.fn().mockImplementationOnce(() => {
                        throw new Error('message');
                    }),
                });
                let err;

                // Act
                try {
                    await service[method](translation);
                } catch (e) {
                    err = e;
                }

                // Assert
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(KfDbException);
            });
        });
    });

    [
        { methodName: 'insertToTraitsDriversStatusTable', guidMethod: 'getTraitsDriversStatusGUID', idProperty: 'TraitsDriversTranslationID' },
        { methodName: 'insertToCompetenciesStatusTable', guidMethod: 'getCompetenciesStatusGUID', idProperty: 'KFLAModelFlatDataLoadID' },
    ].forEach((method) => {
        describe(method.methodName, () => {
            test('should call stored proc with arguments and return id and guid', async () => {
                // Arrange
                const userId = 123;
                const id = 321;
                const guid = 'guid';
                const querySpyInsert = jest.fn();
                const querySpySelect = jest.fn().mockResolvedValueOnce([{ [method.idProperty]: id }]);
                const escapedQueryInsert = 'escapedQueryInsert';
                const parametersInsert = 'parametersInsert';
                const escapedQuerySelect = 'escapedQuerySelect';
                const parametersSelect = 'parametersSelect';
                jest.spyOn(service as any, method.guidMethod).mockResolvedValueOnce(guid);
                getConnection
                    .mockReturnValueOnce({ driver: { escapeQueryWithParameters: jest.fn().mockReturnValueOnce([escapedQueryInsert, parametersInsert]) } })
                    .mockReturnValueOnce({ driver: { escapeQueryWithParameters: jest.fn().mockReturnValueOnce([escapedQuerySelect, parametersSelect]) } });
                getManager.mockReturnValueOnce({ query: querySpyInsert }).mockReturnValueOnce({ query: querySpySelect });

                // Act
                const result = await service[method.methodName](userId);

                // Assert
                expect(querySpyInsert).toHaveBeenCalledWith(escapedQueryInsert, parametersInsert);
                expect(querySpySelect).toHaveBeenCalledWith(escapedQuerySelect, parametersSelect);
                expect(result).toEqual({
                    id,
                    guid,
                });
            });

            test('should return error if query failed', async () => {
                // Arrange
                const userId = 123;
                const id = 321;
                const guid = 'guid';
                const querySpyInsert = jest.fn();
                const querySpySelect = jest.fn().mockImplementationOnce(() => {
                    throw new Error('message');
                });
                const escapedQueryInsert = 'escapedQueryInsert';
                const parametersInsert = 'parametersInsert';
                const escapedQuerySelect = 'escapedQuerySelect';
                const parametersSelect = 'parametersSelect';
                jest.spyOn(service as any, method.guidMethod).mockResolvedValueOnce(guid);
                getConnection
                    .mockReturnValueOnce({ driver: { escapeQueryWithParameters: jest.fn().mockReturnValueOnce([escapedQueryInsert, parametersInsert]) } })
                    .mockReturnValueOnce({ driver: { escapeQueryWithParameters: jest.fn().mockReturnValueOnce([escapedQuerySelect, parametersSelect]) } });
                getManager.mockReturnValueOnce({ query: querySpyInsert }).mockReturnValueOnce({
                    query: querySpySelect,
                });
                let err;

                // Act
                try {
                    await service[method.methodName](userId);
                } catch (e) {
                    err = e;
                }

                // Assert
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(KfDbException);
            });
        });
    });
});
