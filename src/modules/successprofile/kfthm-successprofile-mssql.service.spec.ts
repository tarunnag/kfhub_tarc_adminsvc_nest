import { Test, TestingModule } from '@nestjs/testing';
import { SpMssqlService } from './kfthm-successprofile-mssql.service';
import { KfException } from '@kf-products-core/kfhub_svc_lib';
import { getNumber, getRandomString, getString } from './kfthm-successprofile.fixture';

const ormQueryMock = jest.fn(),
    ormStreamMock = jest.fn();
jest.mock('typeorm', () => {
    const actual = jest.requireActual('typeorm');
    return {
        ...actual,
        __esModule: true,
        getConnection: jest.fn(() => {
            return { createQueryRunner: ()=>({ stream: () => ormStreamMock() }) };
        }),
        getManager: jest.fn(() => {
            return { query: () => ormQueryMock() };
        }),
    };
});

describe('BmService', () => {
    let module: TestingModule;
    let mssqlService: SpMssqlService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [ SpMssqlService ],
        }).compile();

        mssqlService = module.get(SpMssqlService);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    describe('getThPortalProfiles', () => {
        const sqlResponseMock =[{"no business logic should be applied": "should return query result"}];
        const params: [number, string, number, number, string, string, string, string, string, string, string] = 
            [getNumber(), getString(), getNumber(), getNumber(), getString(), getString(), getString(), getString(), getString(), getString(), getString() ]
        test('should return data from db', async () => {
            // Arrange
            ormQueryMock.mockResolvedValue(sqlResponseMock);

            // Act
            const result = await mssqlService.getThPortalProfiles(...params);

            // Assert
            expect(result).toEqual(sqlResponseMock);
        });
        test('should throw KfException on error', async () => {
            // Arrange
            ormQueryMock.mockImplementationOnce(()=> {throw new Error()});

            // Act
            const resultF = mssqlService.getThPortalProfiles(...params);

            // Assert
            await expect(resultF).rejects.toThrowError(KfException);
        });
    });
    describe('getClientPreferedLanguage', () => {
        const sqlResponseMock =[{"no business logic should be applied": "should return query result"}];
        test('should return data from db', async () => {
            // Arrange
            ormQueryMock.mockResolvedValue(sqlResponseMock);

            // Act
            const result = await mssqlService.getClientPreferedLanguage(getNumber());

            // Assert
            expect(result).toEqual(sqlResponseMock);
        });
        test('should throw KfException on error', async () => {
            // Arrange
            ormQueryMock.mockImplementationOnce(()=> {throw new Error()});

            // Act
            const resultF = mssqlService.getClientPreferedLanguage(getNumber());

            // Assert
            await expect(resultF).rejects.toThrowError(KfException);
        });
    });
    describe('getThPortalMetadata', () => {
        const sqlResponseMock =[{"no business logic should be applied": "should return query result"}];
        test('should return data from db', async () => {
            // Arrange
            ormQueryMock.mockResolvedValue(sqlResponseMock);

            // Act
            const result = await mssqlService.getThPortalMetadata(getNumber());

            // Assert
            expect(result).toEqual(sqlResponseMock);
        });
        test('should throw KfException on error', async () => {
            // Arrange
            ormQueryMock.mockImplementationOnce(()=> {throw new Error()});

            // Act
            const resultF = mssqlService.getThPortalMetadata(getNumber());

            // Assert
            await expect(resultF).rejects.toThrowError(KfException);
        });
    });
});
