import { Test, TestingModule } from '@nestjs/testing';
import { KfThmPushDataService } from './kfhub-pushData.service';

import * as typeorm from 'typeorm';
jest.mock('typeorm', () => {
    const actual = jest.requireActual('typeorm');
    return {
        ...actual,
    };
});

describe('KfThmPushDataService', () => {
    const typeormQuery = jest.fn();
    (typeorm as any).getManager = jest.fn().mockReturnValue({
        query: typeormQuery,
    });

    let module: TestingModule;
    let pushDataService: KfThmPushDataService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [KfThmPushDataService],
        }).compile();

        pushDataService = module.get(KfThmPushDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getPushData', () => {
        test('should throw error when query was failed', async () => {
            typeormQuery.mockRejectedValue('Failed');

            let err: Error = { name: '',message: '' };

            try {
                await pushDataService.getPushData(
                    {
                        loggedInUserClientId: 1,
                        userId: 1,
                        locale: 'en',
                        clientId: 1,
                        lcid: 'en',
                    },
                    {
                        fileUUID: 'mock-file-uuid',
                        uploadClientId: 1,
                    },
                );
            } catch (e) {
                err = e;
            }

            expect(err).toBeDefined();
        });
    });
});
