import { Test, TestingModule } from '@nestjs/testing';
import { config, S3 } from 'aws-sdk';
import * as xlsx from 'xlsx';
import { jsonToExcel, toNumber, errorGenerator } from './common.utils';
import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';

describe('common utils', () => {
    let module: TestingModule;
    let configService: KfConfigService;
    beforeEach(async () => {
        jest.spyOn(config, 'update').mockImplementation(() => {});
        module = await Test.createTestingModule({
            providers: [KfConfigService],
        }).compile();

        configService = module.get<KfConfigService>(KfConfigService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('jsonToExcel', () => {
        test('should convert json to Excel and return result when there aren`t errors', () => {
            const workSheet: xlsx.WorkSheet = {
                A2: { t: 's', v: '' },
                A1: { t: 's', v: 'column1' },
                '!ref': 'A1:A2',
            };
            const wb = {
                SheetNames: ['row1'],
                Sheets: { row1: { A2: [Object], A1: [Object], '!ref': 'A1:A2' } },
            };
            jest.spyOn(xlsx.utils, 'book_new').mockReturnValueOnce({ SheetNames: [], Sheets: {} });
            jest.spyOn(xlsx.utils, 'json_to_sheet').mockReturnValueOnce(workSheet);
            jest.spyOn(xlsx.utils, 'book_append_sheet').mockImplementationOnce(() => {});

            const result = {
                wb: wb,
                type: 'buffer',
            };

            jest.spyOn(xlsx, 'write').mockReturnValueOnce(result);

            const data = [{ column1: '' }];
            const res = jsonToExcel(data);

            expect(res).toEqual(result);
        });

        test('should convert json to Excel and return result when there are errors', () => {
            const workSheet: xlsx.WorkSheet = {
                A2: { t: 's', v: '' },
                A1: { t: 's', v: 'column1' },
                errors: { error1: 'error' },
                '!ref': 'A1:A2',
            };

            const preWorkSheet = { errors: { error1: 'error' } };
            const Wb = {
                SheetNames: ['row1'],
                Sheets: { row1: { A2: [Object], A1: [Object], '!ref': 'A1:A2' } },
                Custprops: { Warning: 'Warning' },
            };
            jest.spyOn(xlsx.utils, 'book_new').mockReturnValueOnce({ SheetNames: [], Sheets: {} });
            jest.spyOn(xlsx.utils, 'json_to_sheet').mockReturnValueOnce(preWorkSheet).mockReturnValue(workSheet);
            jest.spyOn(xlsx.utils, 'book_append_sheet').mockImplementation(() => {});

            const result = {
                wb: Wb,
                type: 'buffer',
            };
            jest.spyOn(xlsx, 'write').mockReturnValueOnce(result);

            const data = [{ column1: '' }];
            const errors = [{ error1: 'error' }];
            const res = jsonToExcel(data, errors);

            expect(res).toEqual(result);
        });
    });

    describe('toNumber', () => {
        test('should convert a string into a number in decimal base', () => {
            const textNumber = '100';
            const number = 100;

            const res = toNumber(textNumber);

            expect(res).toEqual(number);
        });
    });

    describe('errorGenerator', () => {
        test('should return error object with specified failed property', () => {
            const property = 'property';

            const result = { property: property, constraint: 'isString', message: `${property} must be a string` };
            const res = errorGenerator(property);

            expect(res).toEqual(result);
        });
    });
});
