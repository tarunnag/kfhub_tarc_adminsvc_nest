import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';
import { Test, TestingModule } from '@nestjs/testing';
import { CmsConnectionService } from './cms-connection.service';
import { KfExceptionCodes as ec } from '../../kfthm-exception-codes.enum';

describe('CmsConnectionService', () => {
    const httpGetSpy = jest.fn();
    const httpPostSpy = jest.fn();
    const X_API_KEY = 'X_API_KEY';

    let module: TestingModule;
    let service: CmsConnectionService;
    let loggerLog: jest.SpyInstance;
    let loggerError: jest.SpyInstance;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [
                CmsConnectionService,
                {
                    provide: KfConfigService,
                    useValue: {
                        get: () => X_API_KEY,
                    },
                },
            ],
        }).compile();

        service = module.get(CmsConnectionService);
        loggerLog = jest.spyOn((service as any).logger, 'log').mockImplementation(() => {});
        loggerError = jest.spyOn((service as any).logger, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    test('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getHeaders', () => {
        test('should return headers with token from getToken method', async () => {
            // Arrange
            const token = 'token';
            jest.spyOn(service as any, 'getToken').mockResolvedValueOnce(token);

            // Act
            const result = await (service as any).getHeaders();

            // Assert
            expect(result).toEqual({
                Authorization: token,
                'x-api-key': X_API_KEY,
            });
        });
    });

    describe('getToken', () => {
        test('should return token from response', async () => {
            // Arrange
            const token = 'token';
            const response = {
                success: true,
                token,
            };
            jest.spyOn(service as any, 'postRequest').mockResolvedValueOnce(response);
            httpPostSpy.mockResolvedValueOnce(response);
            // Act
            const result = await (service as any).getToken();

            // Assert
            expect(result).toEqual(token);
        });

        test('should throw an error if getting token failed', async () => {
            // Arrange
            httpPostSpy.mockResolvedValueOnce({
                success: false,
            });
            jest.spyOn(service as any, 'postRequest').mockResolvedValueOnce({
                success: false,
            });
            let err;
            // Act
            try {
                await (service as any).getToken();
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
            expect(loggerError).toHaveBeenCalled();
        });
    });

    ['getCompetenciesTranslations', 'getTraitsDriversTranslations'].forEach((method) => {
        describe(method, () => {
            const headers = {
                Authorization: 'token',
                'x-api-key': X_API_KEY,
            };
            const lang = 'ru-RU';

            beforeEach(() => {
                jest.spyOn(service as any, 'getHeaders').mockResolvedValueOnce(headers);
            });

            test('should return response as is', async () => {
                // Arrange
                const response = {};
                const getSpy = jest.spyOn(service as any, 'getRequest').mockResolvedValueOnce(response);
                // Act
                const result = await service[method](lang);

                // Assert
                expect(loggerLog).toHaveBeenCalled();
                expect(result).toEqual(response);
                expect(getSpy.mock.calls[0][0]).toMatch(new RegExp(`lang=${lang}`));
                expect(getSpy.mock.calls[0][1]).toEqual(headers);
            });

            test('should throw an error is get filed', async () => {
                // Arrange
                let err;
                httpGetSpy.mockImplementationOnce(() => {
                    throw new Error();
                });

                // Act
                try {
                    await service[method](lang);
                } catch (e) {
                    err = e;
                }
                // Assert
                expect(loggerLog).toHaveBeenCalled();
                expect(loggerError).toHaveBeenCalled();
                expect(err).toBeDefined();
                expect(err.getStatus()).toEqual(500);
                expect(err.getExceptionCode()).toEqual(ec.INTERNAL_SERVER_ERROR);
            });
        });
    });
});
