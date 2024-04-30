import { toNumber, getMimeType } from './kfthm-workday.utils';

describe('Workday utils', () => {
    describe('toNumber', () => {
        test('should convert to number', () => {
            expect(toNumber('10')).toEqual(10);
            expect(toNumber('')).toEqual(NaN);
            expect(toNumber(undefined)).toEqual(NaN);
            expect(toNumber('a10')).toEqual(NaN);
            expect(toNumber('10sdsd')).toEqual(10);
        });
    });

    describe('getMimeType', () => {
        test('should return mime type for specified file type', () => {
            expect(getMimeType('.xlsx')).toEqual('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        });
    });
});
