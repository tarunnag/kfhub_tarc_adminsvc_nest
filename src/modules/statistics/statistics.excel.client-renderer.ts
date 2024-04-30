import * as ExcelJS from 'exceljs';
import { Injectable, Logger } from '@nestjs/common';
import { StatisticsExcelHelper } from './excelJs/statistics.excel.helper';
import { ClientGeneralInformationTitles, ClientOverviewSheetCellNotes, ClientUsageSheetCellNotes, CellColors } from './statistics.excel.const';
import {
    ClientOverviewColumns,
    ClientOverviewSubscriptionTitles,
    ClientOverviewUserDetailsTitles,
    CommonTitles,
    ContentType,
    UsageSheetColumns,
    UsageSheetInterviewGuidesCreated,
    UsageSheetNumberOfSPs,
    UsageTotalNumberOfLogs,
    UsageTotalNumberOfLogsSubscriptions,
} from './statistics.const';
import { ClientStatistics, ClientStatisticsRenderer, CustomObject } from './statistics.interface';

@Injectable()
export class ClientStatisticsExcelRenderer implements ClientStatisticsRenderer {
    readonly contentType = ContentType.EXCEL;

    private readonly logger = new Logger('ClientStatisticsExcelRender');

    constructor(private excelHelper: StatisticsExcelHelper) {}

    async render(clientStats: ClientStatistics): Promise<Buffer> {
        const wb = new ExcelJS.Workbook();
        const clientOverviewSheet = wb.addWorksheet('Client Overview');
        const usageBreakDownSheet = wb.addWorksheet('Usage Log');

        this.excelHelper.bgColor = CellColors.header;
        this.excelHelper.textColor = CellColors.white;
        this.excelHelper.borderColor = CellColors.white;

        await this.generateClientOverviewSheet(wb, clientStats, clientOverviewSheet);

        await this.generateClientUsageSheet(wb, clientStats, usageBreakDownSheet);
        await this.setClientColumnLayout(clientOverviewSheet);

        this.excelHelper.setCellNotes(clientOverviewSheet, ClientOverviewSheetCellNotes);

        return wb.xlsx.writeBuffer() as Promise<Buffer>;
    }

    private async generateClientOverviewSheet(wb: ExcelJS.Workbook, clientStats: ClientStatistics, ws: ExcelJS.Worksheet): Promise<void> {
        this.excelHelper.generateHeader(wb, ws, 'Account Overview');
        ws.mergeCells('A2:F2');
        const cellA2 = ws.getCell('A2');
        cellA2.alignment = { vertical: 'middle', horizontal: 'center' };
        cellA2.value = CommonTitles.GENERAL_INFORMATION;

        this.excelHelper.fillBackground(ws, ['A2'], ['all'], true);
        this.generalInfoTable(ws, clientStats);

        // Table 1
        const table1StartRow = 15;
        ws.mergeCells(`A${table1StartRow - 1}:E${table1StartRow - 1}`);
        const cellA13 = ws.getCell(`A${table1StartRow - 1}`);
        this.excelHelper.fillBackground(ws, [`A${table1StartRow - 1}`], ['bottom'], true);
        cellA13.alignment = { vertical: 'middle', horizontal: 'center' };
        cellA13.value = ClientOverviewColumns.SUBSCRIPTION_INFORMATION;
        if (!clientStats.GENERAL_INFORMATION.length) {
            clientStats.GENERAL_INFORMATION = [
                {
                    ClientName: null,
                    SAPClientID: null,
                    ClientID: null,
                    ServerLocation: '',
                    StartDate: '',
                    Expirationdate: null,
                    TotalUsers: null,
                    CustomSPCount: null,
                    CustomResp: null,
                    CustomComp: null,
                    CustomSkills: null,
                    HasJobProperties: null,
                    HasCustomGrades: null,
                    TotalActiveClients: null,
                    EditedResps: null,
                    EditedComps: null,
                    EditedSkills: null,
                    NoOfSPDownloads: null,
                    NoOfJDDownloads: null,
                    NoOfKFAJobDownloads: null,
                    NoOfPMMatrixPageDownloads: null,
                    NoOfKFAMatrixPageDownloads: null,
                    NoOfKFAListPageDownloads: null,
                    NoOfIGDownloads: null,
                    NoOfKFAArchiveJobs: null,
                },
            ];
        }
        if (!clientStats.SUBSCRIPTION_INFORMATION.length) {
            clientStats.SUBSCRIPTION_INFORMATION = [
                {
                    EngagementNumber: null,
                    MaterialCode: null,
                    ProductName: null,
                    StartDate: null,
                    ExpirationDate: null,
                },
            ];
        }
        if (!clientStats.USER_DETAILS.length) {
            clientStats.USER_DETAILS = [
                {
                    Email: null,
                    FirstName: null,
                    LastName: null,
                    UserRole: null,
                    PrimaryTeam: null,
                    NofOfLogins: null,
                    LastLoggeddate: null,
                },
            ];
        }
        if (!clientStats.PM_KFA_VIEWS.length) {
            clientStats.PM_KFA_VIEWS = [
                {
                    Email: null,
                    PMViewLog: null,
                    PMDownloadLog: null,
                    KFAViewLog: null,
                    KFADownloadLog: null,
                },
            ];
        }
        if (!clientStats.PM_KFA_12_MONTHS_VIEW_DOWNLOADS.length) {
            clientStats.PM_KFA_12_MONTHS_VIEW_DOWNLOADS = [
                {
                    MonthDate: null,
                    PMViewLog: null,
                    PMDownloadLog: null,
                    KFAViewLog: null,
                    KFADownloadLog: null,
                },
            ];
        }
        if (!clientStats.SP_12_MONTHS_VIEW_DOWNLOADS.length) {
            clientStats.SP_12_MONTHS_VIEW_DOWNLOADS = [
                {
                    MonthDate: null,
                    CustomSPCreatedCount: null,
                    CustomSPModifiedCount: null,
                },
            ];
        }
        if (!clientStats.IG_12_MONTHS_VIEW_DOWNLOADS.length) {
            clientStats.IG_12_MONTHS_VIEW_DOWNLOADS = [
                {
                    MonthDate: null,
                    CustomIGDownloads: null,
                },
            ];
        }
        this.generateClientTable(ws, 'Subscription Information', clientStats.SUBSCRIPTION_INFORMATION, ClientOverviewSubscriptionTitles, table1StartRow, 1);

        // Table 2
        const startRow = clientStats.SUBSCRIPTION_INFORMATION.length + table1StartRow + 3;
        const tableTitle = ClientOverviewColumns.USER_DETAILS;
        this.excelHelper.fillBackground(ws, this.excelHelper.generateCells(Object.keys(ClientOverviewUserDetailsTitles).length, 1, startRow), ['bottom'], true);
        ws.mergeCells(`A${startRow}:G${startRow}`);
        const cellRef = ws.getCell(`A${startRow}`);
        cellRef.alignment = { vertical: 'middle', horizontal: 'center' };
        cellRef.value = tableTitle;
        this.generateClientTable(
            ws,
            'User Details',
            clientStats.USER_DETAILS,
            ClientOverviewUserDetailsTitles,
            clientStats.SUBSCRIPTION_INFORMATION.length + table1StartRow + 4,
            1,
        );
    }

    private async generalInfoTable(ws: ExcelJS.Worksheet, generalInfo: ClientStatistics): Promise<void> {
        const general_information = generalInfo.GENERAL_INFORMATION[0];

        const values: Record<string, string | number> = {
            B3: general_information.ClientName,
            B4: general_information.SAPClientID,
            B5: general_information.ClientID,
            B6: general_information.ServerLocation,
            B7: general_information.StartDate,
            B8: general_information.Expirationdate,
            B9: general_information.TotalUsers,
            B10: general_information.TotalActiveClients,
            B11: general_information.CustomSPCount,
            D3: general_information.CustomComp,
            D4: general_information.CustomResp,
            D5: general_information.CustomSkills,
            D6: general_information.EditedComps,
            D7: general_information.EditedResps,
            D8: general_information.EditedSkills,
            D9: general_information.HasJobProperties,
            D10: general_information.HasCustomGrades,
            D11: new Date().toLocaleDateString('en-GB'),
            // D7: general_information.TotalActiveClients,
            // D11: general_information.NoOfSPDownloads,
            // F3: general_information.NoOfJDDownloads,
            // F4: general_information.NoOfKFAJobDownloads,
            F3: general_information.NoOfPMMatrixPageDownloads,
            F4: general_information.NoOfKFAMatrixPageDownloads,
            F5: general_information.NoOfKFAListPageDownloads,
            // F8: general_information.NoOfIGDownloads,
            F6: general_information.NoOfKFAArchiveJobs,
        };
        for (const cell in ClientGeneralInformationTitles) {
            const label = ClientGeneralInformationTitles[cell];
            const cellObject: ExcelJS.Cell = ws.getCell(cell);
            cellObject.value = label;
        }

        for (const cell in values) {
            const cellObject: ExcelJS.Cell = ws.getCell(cell);
            cellObject.value = values[cell];
            cellObject.alignment = { indent: 1, vertical: 'middle', horizontal: 'left', wrapText: true };
        }

        const labelCells = Object.keys(ClientGeneralInformationTitles);
        this.excelHelper.fillBackground(ws, labelCells, ['all'], false);
    }

    private async setClientUsageSheetLayout(ws: ExcelJS.Worksheet): Promise<void> {
        const columnWidths = [30, 50, 25, 20, 20, 20];
        for (let i = 1; i <= columnWidths.length; i++) {
            const column = ws.getColumn(i);
            column.width = columnWidths[i - 1];
        }
    }

    private async generateClientUsageSheet(wb: ExcelJS.Workbook, clientStats: ClientStatistics, ws: ExcelJS.Worksheet): Promise<void> {
        try {
            const viewLogStartColumn = 2;
            let table1StartRow = 4;
            this.excelHelper.generateHeader(wb, ws, 'Usage BreakDown');

            // Table 1
            ws.mergeCells(`B${table1StartRow}:C${table1StartRow}`);
            const cellB4 = ws.getCell(`B${table1StartRow}`);
            this.excelHelper.textColor = CellColors.black;
            this.excelHelper.borderColor = CellColors.black;
            cellB4.value = UsageSheetColumns.TOTAL_VIEW_DOWNLOAD_LOG_TITLE;
            this.excelHelper.bgColor = CellColors.title;
            this.excelHelper.fillBackground(ws, [`B${table1StartRow}`], ['bottom'], true);
            this.excelHelper.setCellNotes(ws, ClientUsageSheetCellNotes);
            const titleCells = this.excelHelper.generateCells(3, 4, table1StartRow);
            this.excelHelper.borderColor = CellColors.title;
            this.excelHelper.fillBackground(ws, titleCells, ['all'], true);
            this.setClientUsageSheetLayout(ws);

            this.excelHelper.borderColor = CellColors.black;

            this.generateClientTable(ws, 'PM KFA Views', clientStats.PM_KFA_VIEWS, UsageTotalNumberOfLogs, ++table1StartRow, viewLogStartColumn, true, true);

            //Table 2
            this.excelHelper.bgColor = CellColors.title;
            this.excelHelper.borderColor = CellColors.black;
            const skipRowsTable2 = table1StartRow + clientStats.PM_KFA_VIEWS.length + 4;

            const table2LabelCell = ws.getCell(`B${skipRowsTable2}`);
            table2LabelCell.value = UsageSheetColumns.VIEW_DOWNLOAD_LOG_TABLE_TITLE;
            table2LabelCell.font = { bold: true };
            this.generateCellsAndFillColor(ws, viewLogStartColumn, skipRowsTable2, Object.keys(UsageTotalNumberOfLogsSubscriptions).length);
            this.generateClientTable(
                ws,
                'PM KFA 12 Monsths View Downloads',
                clientStats.PM_KFA_12_MONTHS_VIEW_DOWNLOADS,
                UsageTotalNumberOfLogsSubscriptions,
                skipRowsTable2 + 1,
                viewLogStartColumn,
                true,
                true,
            );

            // Table 3
            this.excelHelper.bgColor = CellColors.title;
            this.excelHelper.borderColor = CellColors.black;
            const skipRowsTable3 = skipRowsTable2 + clientStats.PM_KFA_12_MONTHS_VIEW_DOWNLOADS.length + table1StartRow;
            const table3LabelCell = ws.getCell(`B${skipRowsTable3}`);
            table3LabelCell.value = UsageSheetColumns.SP_CREATION_TABLE_TITLE;
            this.generateCellsAndFillColor(ws, viewLogStartColumn, skipRowsTable3, Object.keys(UsageSheetNumberOfSPs).length);
            this.generateClientTable(
                ws,
                'SP 12 Months View Downloads',
                clientStats.SP_12_MONTHS_VIEW_DOWNLOADS,
                UsageSheetNumberOfSPs,
                skipRowsTable3 + 1,
                viewLogStartColumn,
                true,
                true,
            );
            // Table 4
            const skipRowsTable4 = skipRowsTable3 + clientStats.SP_12_MONTHS_VIEW_DOWNLOADS.length + table1StartRow;
            this.excelHelper.bgColor = CellColors.title;
            this.excelHelper.borderColor = CellColors.black;
            const table4LabelCell = ws.getCell(`B${skipRowsTable4}`);
            table4LabelCell.value = UsageSheetColumns.NUMBER_OF_INTERVIEW_GUIDES;
            this.generateCellsAndFillColor(ws, viewLogStartColumn, skipRowsTable4, Object.keys(UsageSheetInterviewGuidesCreated).length);
            this.generateClientTable(
                ws,
                'IG 12 Months View Downloads',
                clientStats.IG_12_MONTHS_VIEW_DOWNLOADS,
                UsageSheetInterviewGuidesCreated,
                skipRowsTable4 + 1,
                viewLogStartColumn,
                true,
                true,
            );
        } catch (e) {
            this.logger.error(e, 'Error in generateClientUsageSheet');
            throw e;
        }
    }

    private async setClientColumnLayout(ws: ExcelJS.Worksheet): Promise<void> {
        ws.getColumn(1).width = 40;
        ws.getColumn(2).width = 30;
        ws.getColumn(3).width = 40;
        ws.getColumn(4).width = 30;
        ws.getColumn(5).width = 30;
        ws.getColumn(6).width = 30;
        ws.getColumn(7).width = 30;
    }

    private generateClientTable(
        ws: ExcelJS.Worksheet,
        tableName: string,
        clientInformation: any[],
        columnTitles: any,
        startRow: number,
        startColumn: number,
        haveTotal: boolean = false,
        requireCellColors: boolean = false,
    ): void {
        try {
            const totalValues = ['Total'];
            const tableColumns = Object.keys(clientInformation[0]).map((key) => ({ name: columnTitles[key] }));
            const tableRows = clientInformation.map((row) => Object.values(row));
            for (let col = startColumn, i = 0; col < startColumn + tableColumns.length; col++, i++) {
                const columnName = String.fromCharCode(64 + col) + startRow;
                const cell = ws.getCell(columnName);
                cell.value = tableColumns[i].name;
                cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                this.excelHelper.fillBackground(ws, [columnName], ['bottom'], true);
            }
            tableRows.forEach((data: string[], primaryIndex: number) => {
                data.forEach((value: string, secondaryIndex: number) => {
                    value = value === null ? '' : value;
                    const columnName = String.fromCharCode(64 + startColumn + secondaryIndex) + (startRow + primaryIndex + 1);
                    const cellRef = ws.getCell(columnName);
                    cellRef.value = value;
                    cellRef.alignment = { vertical: 'middle', horizontal: this.excelHelper.getAlignment(value), wrapText: true };
                    if (requireCellColors) {
                        this.excelHelper.bgColor = this.excelHelper.getBgColor(value);
                        if (this.excelHelper.bgColor !== CellColors.white) {
                            this.excelHelper.fillBackground(ws, [columnName], ['none'], +value ? true : false);
                        } else {
                            this.excelHelper.borderColor = CellColors.gray_border;
                            this.excelHelper.fillBackground(ws, [columnName], ['bottom'], +value ? true : false);
                        }
                    }
                    if (secondaryIndex && !isNaN(+value)) {
                        totalValues[secondaryIndex] = (totalValues[secondaryIndex] || 0) + value;
                    }
                });
            });
            if (haveTotal) {
                totalValues.forEach((value, index) => {
                    const columnName = String.fromCharCode(64 + startColumn + index) + (startRow + tableRows.length + 1);
                    ws.getCell(columnName).value = value;
                    this.excelHelper.bgColor = CellColors.total;
                    this.excelHelper.fillBackground(ws, [columnName], ['none'], true);
                });
            }
        } catch (e) {
            this.logger.error(e, `Error in generating ${tableName} table`);
            throw e;
        }
    }
    private generateCellsAndFillColor(ws: ExcelJS.Worksheet, startColumn: number, row: number, tableColumns: number): void {
        const cells = this.excelHelper.generateCells(tableColumns, startColumn, row);
        this.excelHelper.fillBackground(ws, cells, ['bottom'], true);
    }
}
