import * as ExcelJS from 'exceljs';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Logger } from '@nestjs/common';
import { KfException } from '@kf-products-core/kfhub_svc_lib';
import { KfExceptionCodes as ec } from '../../../kfthm-exception-codes.enum';
import { CellColors } from '../statistics.excel.const';
import { CellNotes } from './statistics.excel.interface';

export class StatisticsExcelHelper {
    private readonly logger = new Logger('ExcelHelperTools');

    public textColor: string = CellColors.white;
    public bgColor: string = CellColors.header;
    public borderColor: string = CellColors.white;
    private defalutFont: string = 'Arial';
    private defaultFontSize: number = 11;

    generateHeader(wb: ExcelJS.Workbook, ws: ExcelJS.Worksheet, title: string): void {
        try {

            const imagePath = join(__dirname, '../', 'res', 'logo.png');
            const imageBuffer = readFileSync(imagePath);
            
            const color = 'FFFFFF';
            const logoId = wb.addImage({
                buffer: imageBuffer,
                extension: 'png',
            });

            this.setRowColor(ws.getRow(1), this.bgColor);

            const cellB1 = ws.getCell('B1');
            cellB1.value = title;
            cellB1.alignment = { vertical: 'middle', horizontal: 'left' };

            this.fillBackground(ws, ['B1'], ['left'], true);
            ws.getRow(1).height = 50;

            ws.addImage(logoId, {
                tl: { col: 0.2, row: 0.75 },
                ext: { width: 172, height: 34 },
            });
        } catch (e) {
            this.logger.error(e, 'Error in generatingHeders');
            throw new KfException(e.message, 500, ec.INTERNAL_SERVER_ERROR);
        }
    }

    fillBackground(ws: ExcelJS.Worksheet, cells: string[], borderType: string[], bold: boolean): void {
        cells.map((cell) => {
            const cellRef = ws.getCell(cell);
            this.setCellColor(cellRef, this.bgColor);
            this.setCellFontColor(cellRef, this.textColor, bold);
            this.setBorderColor(cellRef, this.borderColor, borderType);
        });
    }

    setCellNotes(ws: ExcelJS.Worksheet, cellNotes: CellNotes, userName: string = null): void {
        for (const cellRef in cellNotes) {
            if (Object.prototype.hasOwnProperty.call(cellNotes, cellRef)) {
                ws.getCell(cellRef).note = {
                    texts: [...(userName ? [{ font: { bold: true }, text: `${userName}:\n` }] : []), { text: cellNotes[cellRef] }],
                };
            }
        }
    }

    setCellFontColor(cellRef: ExcelJS.Cell, color: string, bold: boolean): void {
        cellRef.font = {
            size: this.defaultFontSize,
            color: { argb: color },
            name: this.defalutFont,
            bold,
        };
    }

    setCellColor(cellRef: ExcelJS.Cell, color: string): void {
        cellRef.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
            bgColor: { argb: color },
        };
    }

    setRowColor(rowRef: ExcelJS.Row, color: string): void {
        rowRef.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
            bgColor: { argb: color },
        };
    }

    setBorderColor(cellRef: ExcelJS.Cell, color: string, borderType: string[]): void {
        borderType.map((type) => {
            cellRef.border = {
                ...cellRef.border,
                ...(type === 'top' ? { top: { style: 'thin', color: { argb: color } } } : {}),
                ...(type === 'left' ? { left: { style: 'thin', color: { argb: color } } } : {}),
                ...(type === 'bottom' ? { bottom: { style: 'thin', color: { argb: color } } } : {}),
                ...(type === 'right' ? { right: { style: 'thin', color: { argb: color } } } : {}),
                ...(type === 'all'
                    ? {
                          top: { style: 'thin', color: { argb: color } },
                          left: { style: 'thin', color: { argb: color } },
                          bottom: { style: 'thin', color: { argb: color } },
                          right: { style: 'thin', color: { argb: color } },
                      }
                    : {}),
            };
        });
    }

    getBgColor(value: number | string) {
        if (!isNaN(+value)) {
            return +value ? CellColors.non_zero_color : CellColors.zero_color;
        }
        return CellColors.white;
    }

    getAlignment(value: number | string) {
        const data = value.toString().replace(/-/g, '');
        if (isNaN(+data)) {
            return 'left';
        }
        return 'right';
    }

    generateCells(columnLength: number, startColumn: number, row: number): string[] {
        // @ts-ignore
        return ([...Array(columnLength).keys()] || []).map((value: number, index: number) => String.fromCharCode(64 + startColumn + index) + row);
    }
}
