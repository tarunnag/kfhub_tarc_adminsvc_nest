import { KfArchJobTitlesStagingRepository } from './kfarch-job-titles-staging.repository';

import * as typeorm from 'typeorm';
jest.mock('typeorm', () => {
    const actual = jest.requireActual('typeorm');
    return {
        ...actual,
    };
});

describe('KfArchJobTitlesStagingRepository', () => {
    const mockInsertQuery = jest.fn();
    const mockDeleteQuery = jest.fn();
    const mockQueryBuilder = jest.fn().mockReturnValue({
        insert: () => ({
            into: () => ({
                values: () => ({
                    execute: mockInsertQuery,
                }),
            }),
        }),
        delete: () => ({
            from: () => ({
                where: () => ({
                    execute: mockDeleteQuery,
                }),
            }),
        }),
    });
    (typeorm as any).getConnection = jest.fn().mockReturnValue({
        createQueryBuilder: mockQueryBuilder,
    });

    let repo: KfArchJobTitlesStagingRepository;

    beforeEach(() => {
        repo = new KfArchJobTitlesStagingRepository();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('insertBulkData', () => {
        test('should insert data without errors', async () => {
            mockInsertQuery.mockResolvedValue({});

            let err = null;

            try {
                await repo.insertBulkData('mock-task-uuid', [{ title: 'mock-job-title', architectJobFlag: 0 }]);
            } catch (e) {
                err = e;
            }

            expect(err).toEqual(null);
        });

        test('should throw an error if bulk insert fails', async () => {
            mockInsertQuery.mockRejectedValue('mock-bulk-insert-error');

            let err;

            try {
                await repo.insertBulkData('mock-task-uuid', [{ title: 'mock-job-title', architectJobFlag: 1 }]);
            } catch (e) {
                err = e;
            }

            expect(err).toBeDefined();
        });
    });

    describe('deleteBulk', () => {
        test('should delete data without errors', async () => {
            mockDeleteQuery.mockResolvedValue({});

            let err = null;

            try {
                await repo.deleteBulk('mock-task-uuid');
            } catch (e) {
                err = e;
            }

            expect(err).toEqual(null);
        });

        test('should throw an error if bulk delete fails', async () => {
            mockDeleteQuery.mockRejectedValue('some mock error');

            let err = null;

            try {
                await repo.deleteBulk('mock-task-uuid');
            } catch (e) {
                err = e;
            }

            expect(err).not.toEqual(null);
        });
    });
});
