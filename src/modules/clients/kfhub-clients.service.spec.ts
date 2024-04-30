import { KfThmClientsService } from './kfthm-clients.service';
import { Test, TestingModule } from '@nestjs/testing';

import * as typeorm from 'typeorm';
jest.mock('typeorm', () => {
    const actual = jest.requireActual('typeorm');
    return {
        ...actual,
    };
});

describe('KfThmClientsService', () => {
    let clientsService: KfThmClientsService;
    let module: TestingModule;

    const typeormQuery = jest.fn();
    (typeorm as any).getManager = jest.fn().mockReturnValue({
        query: typeormQuery,
    });

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [KfThmClientsService],
        }).compile();
        clientsService = module.get<KfThmClientsService>(KfThmClientsService);
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('clientList', () => {
        test('should return clients list', async () => {
            typeormQuery.mockResolvedValue([
                {
                    TotalCount: 1,
                    test: 'test-data',
                },
            ]);

            const query: any = {
                pageIndex: 1,
                pageSize: 20,
                searchString: '',
            };

            const res = await clientsService.clientList(query);

            expect(res).toEqual({
                clientInfo: [
                    {
                        TotalCount: 1,
                        test: 'test-data',
                    },
                ],
                paging: {
                    pageIndex: 1,
                    pageSize: 20,
                    totalPages: 1,
                    totalResultRecords: 1,
                },
            });
        });

/*
        test('should return only first page of total 2 pages of clients entries', async () => {
            typeormQuery.mockReturnValue([
                {
                    TotalCount: 20,
                    test: 'test-data',
                },
            ]);

            const query: any = {
                pageIndex: 0,
                pageSize: 10,
                searchString: '',
            };

            const res = await clientsService.clientList(query);

            expect(res).toEqual({
                clientInfo: [
                    {
                        TotalCount: 20,
                        test: 'test-data',
                    },
                ],
                paging: {
                    pageIndex: 0,
                    pageSize: 10,
                    totalPages: 2,
                    totalResultRecords: 20,
                },
            });
        });
*/

        test('should throw error when query has failed', async () => {
            typeormQuery.mockRejectedValue('Failed');

            let err: Error;

            try {
                await clientsService.clientList({
                    pageIndex: 1,
                    pageSize: 20,
                    searchString: '',
                });
            } catch (e) {
                err = e;
            }

            expect(err).toBeDefined();
        });
    });
});
