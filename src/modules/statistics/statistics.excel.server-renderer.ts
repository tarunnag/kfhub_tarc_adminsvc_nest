import * as ExcelJS from 'exceljs';
import { Injectable, Logger } from '@nestjs/common';
import { StatisticsExcelHelper } from './excelJs/statistics.excel.helper';
import { CellColors, ServerGeneralInformationTitles, ServerSheetCellNotes } from './statistics.excel.const';
import { CommonTitles, ContentType, ServerClientTitles } from './statistics.const';
import { ServerStatistics, ServerStatisticsClientRawData, ServerStatisticsGeneralRawData, ServerStatisticsRenderer } from './statistics.interface';

@Injectable()
export class ServerStatisticsExcelRenderer implements ServerStatisticsRenderer {
    readonly contentType = ContentType.EXCEL;

    private readonly logger = new Logger('ServerStatisticsExcelRender');

    private textColor: string = 'FFFFFF';

    constructor(private excelHelper: StatisticsExcelHelper) {}

    async render(serverStats: ServerStatistics): Promise<Buffer> {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Server Overview');
        this.excelHelper.bgColor = CellColors.header;
        this.excelHelper.textColor = CellColors.white;
        this.excelHelper.borderColor = CellColors.white;
        this.excelHelper.generateHeader(wb, ws, 'Server Overview');
        this.setServerColumnLayout(ws);
        this.generateServerGeneralInfo(ws, serverStats.GENERALINFORMATION[0]);
        this.generateServerClientInfo(ws, serverStats.CLIENTINFORMATION);
        this.excelHelper.setCellNotes(ws, ServerSheetCellNotes);

        return wb.xlsx.writeBuffer() as Promise<Buffer>;
    }

    private generateServerGeneralInfo(ws: ExcelJS.Worksheet, generalInfo: ServerStatisticsGeneralRawData): void {
        try {
            ws.mergeCells('A2:F2');

            const labels = ['A3', 'A4', 'A5', 'A6', 'A7', 'C3', 'C4', 'C5'];
            const cellA2 = ws.getCell('A2');

            cellA2.alignment = { vertical: 'bottom', horizontal: 'center' };
            cellA2.value = CommonTitles.GENERAL_INFORMATION;

            this.excelHelper.fillBackground(ws, ['A2'], ['top'], true);

            labels.forEach((cell) => {
                ws.getCell(cell).value = ServerGeneralInformationTitles[cell];
                ws.getCell(cell).alignment = { vertical: 'bottom', horizontal: 'left', indent: 1 };
                this.excelHelper.setCellFontColor(ws.getCell(cell), 'FFFFFF', false);
            });
            const values = {
                B3: generalInfo.ServerLocation,
                B4: generalInfo.TotalClients,
                B5: generalInfo.TotalActiveClients,
                B6: generalInfo.TotalClientusers,
                B7: generalInfo.TotalActiveClientUsers,
                D3: generalInfo.SubsEnding3Months,
                D4: generalInfo.SubsEnding6Months,
                D5: generalInfo.ReportDate,
            };

            for (const cell in values) {
                const value = values[cell];
                const cellObject = ws.getCell(cell);
                cellObject.value = value;
                cellObject.alignment = { vertical: 'bottom', horizontal: 'left', indent: 1 };
                this.excelHelper.setCellFontColor(ws.getCell(cell), '000000', false);
            }

            this.excelHelper.fillBackground(ws, labels, ['all'], false);
        } catch (e) {
            this.logger.error(e, 'Error in serverGeneralInfoTable');
            throw e;
        }
    }

    private generateServerClientInfo(ws: ExcelJS.Worksheet, clientInformation: ServerStatisticsClientRawData[]): void {
        try {
            ws.getRow(10).height = 50;

            const tableColumns = Object.keys(clientInformation[0]).map((key) => ({ name: ServerClientTitles[key] }));
            const tableRows = clientInformation.map((row) => Object.values(row));
            for (let col = 1; col <= 24; col++) {
                // A1 to X10 columns
                const cell = ws.getCell(10, col);
                const columnName = String.fromCharCode(64 + col) + '10';
                cell.value = tableColumns[col - 1].name;
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                this.excelHelper.fillBackground(ws, [columnName], ['none'], false);
            }

            tableRows.forEach((data: string[], primaryIndex: number) => {
                data.forEach((value: string, secondaryIndex: number) => {
                    const columnName = String.fromCharCode(64 + secondaryIndex + 1) + (11 + primaryIndex);
                    ws.getCell(columnName).value = value;
                    ws.getCell(columnName).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    this.excelHelper.setCellFontColor(ws.getCell(columnName), '000000', false);
                });
            });
        } catch (e) {
            this.logger.error(e, 'Error in generatingServerSheet');
            throw e;
        }
    }

    private setServerColumnLayout(ws: ExcelJS.Worksheet): void {
        const columnWidths = {
            1: 30,
            3: 50,
        };

        for (let col = 1; col <= 24; col++) {
            const column = ws.getColumn(col);
            const width = columnWidths[col] || 20;
            column.width = width;
        }
    }
}
