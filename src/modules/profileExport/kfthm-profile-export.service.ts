import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { Common } from '../../common/common.interface';
import {
    GradeSet,
    JEScoreNames,
    JEScoreTypes,
    JEScoresColumnNames,
    JobForKFATemplate,
    JobProperty,
    KfThmDbResponse,
    KfThmProfileEnum,
    KfThmProfileExportRequestDTO,
    KfaJEScore,
    KfaJobsColumKeys,
    KfaJobsColumNames,
    KfaJobsForExcel,
    KfaSource,
    PropValues,
} from './kfthm-profile-export.interface';
import { KfThmProfileExportRepository } from './kfthm-profile-export.repository';
import * as XLSX from '@sheet/core';
import { getJobDatasUrl, s3 } from '../../common/common.utils';
import { KfThmSignUrlUtils } from '../signUrl/kfthm-signUrl.util';
import { KfEmailService } from '../../common/email/email.service';
import * as moment from 'moment';
import { HEADERS_COLOR } from './kfthm-profile-export.const';

const s3Utils = new KfThmSignUrlUtils();
@Injectable()
export class KfThmProfileExportService {
    excludeProps = ['grade', 'shortProfile', 'benchmarkIndicator', 'hideInPM', 'totalPoints', 'overallRationale'];

    constructor(private db: KfThmProfileExportRepository, private emailService: KfEmailService) {}

    async profileExport(query: Common.Query.DefaultProps, body: KfThmProfileExportRequestDTO, token: string): Promise<{ url: string }> {
        await this.db.createClientExport({
            ClientID: body.selectedClientId,
            RequestorEmail: body.requestorEmail,
            ReasonforExport: body.reasonforExport,
            LCID: body.lcid,
            AuthToken: token,
            GeneratedBy: query.userId,
            GeneratedOn: new Date().toISOString(),
        });

        const date = moment().format('YYYYMMDD');
        const fileName = `${body.clientName}- Custom SP & JD Export - ${date} -  ${body.lcid}.xlsx`;
        const excel = await this.createExcel(body.selectedClientId, body.lcid, token);
        const s3Result = await this.storeExcelInS3(excel, fileName);
        const url = await s3Utils.signedUrlForDownload(Common.Enum.BUCKET, s3Result.Key, Common.Enum.BucketDetails.EXPIRES);

        this.emailService.KfSendEmail({ ...body, fileName, ...query }).catch((err) => null);
        return { url };
    }

    async createExcel(selectedClientId: number, lcid: string, authToken: string): Promise<any | never> {
        const wb = XLSX.utils.book_new();
        const dbResponse: KfThmDbResponse = {};

        const [successProfiles, responsibilities, tasks, behavComps, techComps, tools, education, generalExps, managerialExps, traits, drivers, jobsResponse] =
            await Promise.all([
                this.db.getCustomSuccessProfiles(selectedClientId, lcid),
                this.db.getResponsibilities(selectedClientId, lcid),
                this.db.getTasks(selectedClientId, lcid),
                this.db.getBehavioralSkills(selectedClientId, lcid),
                this.db.getTechnicalCompetencies(selectedClientId, lcid),
                this.db.getTools(selectedClientId, lcid),
                this.db.getEducation(selectedClientId, lcid),
                this.db.getGeneralExps(selectedClientId, lcid),
                this.db.getManagerialExps(selectedClientId, lcid),
                this.db.getTraits(selectedClientId, lcid),
                this.db.getDrivers(selectedClientId, lcid),
                this.getJobsData(selectedClientId, authToken, lcid),
            ]);
        const [
            successProfilesSheet,
            responsibilitiesSheet,
            tasksSheet,
            behavCompsSheet,
            techCompsSheet,
            toolsSheet,
            educationSheet,
            generalExpsSheet,
            managerialExpsSheet,
            traitsSheet,
            driversSheet,
        ] = await Promise.all([
            this.convertToSheet(successProfiles),
            this.convertToSheet(responsibilities),
            this.convertToSheet(tasks),
            this.convertToSheet(behavComps),
            this.convertToSheet(techComps),
            this.convertToSheet(tools),
            this.convertToSheet(education),
            this.convertToSheet(generalExps),
            this.convertToSheet(managerialExps),
            this.convertToSheet(traits),
            this.convertToSheet(drivers),
        ]);

        XLSX.utils.book_append_sheet(wb, successProfilesSheet, 'Success Profiles');
        await this.creteKFAJobsSheet(wb, jobsResponse);
        XLSX.utils.book_append_sheet(wb, responsibilitiesSheet, 'Responsibilities');
        XLSX.utils.book_append_sheet(wb, tasksSheet, 'Tasks');
        XLSX.utils.book_append_sheet(wb, behavCompsSheet, 'Behavioral Comps');
        XLSX.utils.book_append_sheet(wb, techCompsSheet, 'Skills');
        XLSX.utils.book_append_sheet(wb, toolsSheet, 'Tools');
        XLSX.utils.book_append_sheet(wb, educationSheet, 'Education');
        XLSX.utils.book_append_sheet(wb, generalExpsSheet, 'General Exp');
        XLSX.utils.book_append_sheet(wb, managerialExpsSheet, 'Managerial Exp');
        XLSX.utils.book_append_sheet(wb, traitsSheet, 'Traits');
        XLSX.utils.book_append_sheet(wb, driversSheet, 'Drivers');

        if (!dbResponse) {
            throw new Error('Empty workbook');
        }
        return this.tranformWorkbookIntoExcel(wb);
    }

    async creteKFAJobsSheet(wb: XLSX.WorkBook, jobsResponse: JobForKFATemplate[]) {
        if (jobsResponse?.length) {
            const ws = XLSX.utils.aoa_to_sheet([]);
            const kfaJobs = this.mapJobsData(jobsResponse);
            this.addKFAHeaderRow(kfaJobs, ws);
            kfaJobs.data.forEach((dataRow, index) => {
                this.addKFADataRow(index + 2, kfaJobs, dataRow, ws);
            });
            const range = Math.max(...kfaJobs.data.map((job) => Object.keys(job).length));
            ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: kfaJobs.data.length + 1, c: range } });
            XLSX.utils.book_append_sheet(wb, ws, 'Architect Properties');
        }
    }

    addKFAJobCell(ws: XLSX.WorkSheet, cellRef: string, value: {}, style: {}) {
        const cellValue = typeof value === 'number' ? value.toString() : value;
        const cell = { v: cellValue, t: 's', s: style };
        ws[cellRef] = cell;

        if (typeof value === 'string' && value.includes(',')) {
            const dropdownValues = value.split(',').map((item) => item.trim());
            ws[cellRef].s = ws[cellRef].s || {};
            ws[cellRef].s.dataValidation = {
                type: 'list',
                allowBlank: true,
                showDropDown: true,
                formula1: '"' + dropdownValues.join(',') + '"',
            };
        }
    }

    addKFAHeaderRow(jsonData: KfaJobsForExcel, ws: XLSX.WorkSheet) {
        let colIndex = 0;
        let colWidths = [];
        const border = {
            top: { style: 'thin', color: { auto: 1 } },
            right: { style: 'thin', color: { auto: 1 } },
            bottom: { style: 'thin', color: { auto: 1 } },
            left: { style: 'thin', color: { auto: 1 } },
        };
        const alignment = { horizontal: 'center', vertical: 'center' };
        const headerStyle = {
            font: { bold: true, sz: 12 },
            alignment,
            border,
        };

        const groupingHeaderStyle = {
            font: { bold: false, sz: 10 },
            alignment,
            border,
        };

        for (const key in jsonData.columnNames) {
            const value = jsonData.columnNames[key];

            if (Array.isArray(value)) {
                const arrayData = value[0];
                const arrayLength = Object.keys(arrayData).length - 1;

                ws['!merges'] = ws['!merges'] || [];
                ws['!merges'].push({ s: { r: 0, c: colIndex }, e: { r: 0, c: colIndex + arrayLength - 1 } });
                this.addKFAJobCell(ws, XLSX.utils.encode_cell({ r: 0, c: colIndex }), arrayData.name, headerStyle);

                // Add sub-headers
                Object.keys(arrayData).forEach((subKey) => {
                    if (subKey !== 'name') {
                        this.addKFAJobCell(ws, XLSX.utils.encode_cell({ r: 1, c: colIndex }), arrayData[subKey], groupingHeaderStyle);
                        colWidths[colIndex] = 10;
                        colIndex++;
                    }
                });
            } else {
                // Merge for regular headers
                ws['!merges'] = ws['!merges'] || [];
                ws['!merges'].push({ s: { r: 0, c: colIndex }, e: { r: 1, c: colIndex } });
                this.addKFAJobCell(ws, XLSX.utils.encode_cell({ r: 0, c: colIndex }), value, headerStyle);
                colWidths[colIndex] = Math.max(value.toString().length + 1, colWidths[colIndex] || 0);
                colIndex++;
            }
        }
        ws['!cols'] = colWidths.map((width) => ({ wch: width }));
        ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: 1, c: colIndex - 1 } });

        this.styleKFACells(ws);
    }

    addKFADataRow(rowIndex: number, jsonData: KfaJobsForExcel, dataRow: any, ws: XLSX.WorkSheet) {
        let dataColIndex = 0;
        for (const key in jsonData.columnNames) {
            if (Array.isArray(jsonData.columnNames[key])) {
                const subHeaders = jsonData.columnNames[key][0];
                Object.keys(subHeaders).forEach((subKey) => {
                    if (subKey !== 'name') {
                        const subHeaderValue = dataRow[subKey] || '';
                        this.addKFAJobCell(ws, XLSX.utils.encode_cell({ r: rowIndex, c: dataColIndex }), subHeaderValue, {});
                        dataColIndex++;
                    }
                });
            } else {
                const cellValue = dataRow[key] || '';
                this.addKFAJobCell(ws, XLSX.utils.encode_cell({ r: rowIndex, c: dataColIndex }), cellValue, {});
                dataColIndex++;
            }
        }
    }

    styleKFACells(ws: XLSX.WorkSheet) {
        const range = XLSX.utils.decode_range(ws['!ref']);
        const rowRange = XLSX.utils.encode_range({ c: range.s.c, r: 0 }, { c: range.e.c, r: 0 });
        XLSX.utils.sheet_set_range_style(ws, range, {
            alignment: {
                horizontal: 'center',
                vertical: 'center',
                wrapText: true,
            },
            fgColor: { rgb: HEADERS_COLOR },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
            left: { style: 'thin' },
            top: { style: 'thin' },
            incol: { style: 'thin' },
        });

        XLSX.utils.sheet_set_range_style(ws, rowRange, {
            fgColor: { rgb: HEADERS_COLOR },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
            left: { style: 'thin' },
            top: { style: 'thin' },
            incol: { style: 'thin' },
            alignment: { horizontal: 'center' },
            bold: true,
        });
    }

    convertToSheet(entries: any): XLSX.WorkSheet {
        let ws = XLSX.utils.json_to_sheet(entries);
        if (ws === null) {
            /*
             *
             * Writes only headers to worksheet when empty response ([]) from database
             *
             */
            const row = Object.keys(entries.columns);
            ws = XLSX.utils.aoa_to_sheet([row]);
        }
        this.styleColumns(entries, ws);
        this.styleCells(ws);
        return ws;
    }

    styleColumns(data: {}[], ws: XLSX.WorkSheet) {
        if (!data?.length) {
            return null;
        }
        const row = data[0];
        const styles = [];
        for (const key in row) {
            switch (key.trimEnd()) {
                case KfThmProfileEnum.DESCRIPTION:
                case KfThmProfileEnum.DESCRIPTION:
                case KfThmProfileEnum.RESPONSIBILITY_DESCRIPTION:
                case KfThmProfileEnum.BEHAVIORAL_COMPETENCY_DESCRIPTION:
                case KfThmProfileEnum.TECHNICAL_COMPETENCY_DESCRIPTION:
                case KfThmProfileEnum.SKILL_DESCRIPTION:
                case KfThmProfileEnum.EDUCATION_DESCRIPTION:
                case KfThmProfileEnum.SKILL_COMPONENTS:
                    styles.push({ width: 60 });
                    break;
                case KfThmProfileEnum.JOB_CODE:
                case KfThmProfileEnum.JOB_ID:
                case KfThmProfileEnum.JRT_DETAIL_ID:
                case KfThmProfileEnum.JOB_FAMILY_ID:
                case KfThmProfileEnum.JOB_SUBFAMILY_ID:
                case KfThmProfileEnum.REFERENCE_LEVEL:
                case KfThmProfileEnum.KF_LEVEL_CODE:
                case KfThmProfileEnum.CREATED_ON:
                case KfThmProfileEnum.MODIFIED_ON:
                case KfThmProfileEnum.MODIFIED_ON:
                case KfThmProfileEnum.SHORT_PROFILE:
                case KfThmProfileEnum.UNIQUE_ID:
                case KfThmProfileEnum.LEVEL:
                case KfThmProfileEnum.IMPORTANT:
                case KfThmProfileEnum.TYPE:
                case KfThmProfileEnum.TASK_ORDER:
                case KfThmProfileEnum.TOOL_ORDER:
                case KfThmProfileEnum.EXAMPLE_ORDER:
                    styles.push({ width: 17 });
                    break;
                default:
                    styles.push({ width: 30 });
                    break;
            }
        }
        ws['!cols'] = styles;
    }

    styleCells(ws: XLSX.WorkSheet) {
        const range = XLSX.utils.decode_range(ws['!ref']);
        XLSX.utils.sheet_set_range_style(ws, range, {
            alignment: {
                vertical: 'top',
                wrapText: true,
            },
        });
        const rowRange = XLSX.utils.encode_range({ c: range.s.c, r: 0 }, { c: range.e.c, r: 0 });
        XLSX.utils.sheet_set_range_style(ws, rowRange, {
            fgColor: { rgb: HEADERS_COLOR },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
            left: { style: 'thin' },
            top: { style: 'thin' },
            incol: { style: 'thin' },
            alignment: { horizontal: 'center' },
            bold: true,
        });
    }

    tranformWorkbookIntoExcel(wb): any {
        return XLSX.write(wb, {
            cellStyles: true,
            bookSST: true,
            bookType: 'xlsx',
            type: 'buffer',
            compression: false,
        });
    }

    async storeExcelInS3(excel, fileName) {
        await s3Utils.createBucketIfNotExist(Common.Enum.BUCKET);
        return await s3
            .upload({
                Bucket: Common.Enum.BUCKET,
                Key: `${Common.Enum.BucketDetails.THM}/ProfileExports/${fileName}`,
                ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ACL: 'private',
                Body: excel,
            })
            .promise();
    }

    private async makeGetRequest<T>(uri: string, authToken: string): Promise<JobForKFATemplate[]> {
        try {
            const headers = { authToken };
            const axios = Axios.create({ headers });
            const response = await axios.get(uri);
            return response.data.data.jobs;
        } catch (e) {
            throw new Error('Get KFA Jobs APi failed.');
        }
    }

    private mapJobsData(jobs: JobForKFATemplate[]): KfaJobsForExcel {
        const mappedJobs = [];
        (jobs || []).map((job: JobForKFATemplate) => {
            const datesInfo = this.getCreatedDatesInfo(job.source);
            mappedJobs.push({
                ...{
                    jobId: job.id,
                    jobTitle: job.title,
                    jobCode: job.jobCode,
                    function: job.familyName,
                    subFunction: job.subFamilyName,
                    valueStreamName: job?.valueStreamName,
                    roleTypeName: job?.roleTypeName,
                },
                totalPoints: job?.totalPoints?.toString() || 0,
                gradeSet: job.grade.standardHayGrade,
                grade: job.grade.customGrades.gradeSetName,
                isGradeOverriddenByJE: job.isGradeOverriddenByJE ? PropValues.YES : PropValues.NO,
                shortProfile: job.shortProfile.value,
                overallRationale: job.overallRationale,
                ...this.generateJEScoresData(job.jeScores),
                benchmarkIndicator: job.benchmarkIndicator ? PropValues.YES : PropValues.NO,
                hiddenInProfileManager: job.hideInPM ? PropValues.YES : PropValues.NO,
                ...this.generateDynamicProperties(job.JobProperties),
                createdDate: this.formatDate(datesInfo.createdDate),
                createdBy: datesInfo.createdBy,
                lastUpdateDate: this.formatDate(datesInfo.lastUpdateDate),
                lastUpdatedBy: datesInfo.lastUpdatedBy,
            });
        });
        const combinedJobProperties = [];
        for (const job of jobs || []) {
            for (const property of job.JobProperties || []) {
                if (property && !combinedJobProperties.find((obj) => obj.code === property.code)) {
                    combinedJobProperties.push(property);
                }
            }
        }
        let columnNames = {};
        if (jobs.length) {
            jobs[0].JobProperties = combinedJobProperties;
            columnNames = this.generateKfaColumnNames(jobs[0]);
        }
        return {
            columnNames,
            data: mappedJobs,
        };
    }

    private getCreatedDatesInfo(data: KfaSource[]): { [key: string]: string } {
        const created = data.find((ele: KfaSource) => ele.type === JEScoreTypes.CREATED_BY);
        const updated = data.find((ele: KfaSource) => ele.type === JEScoreTypes.LAST_MODIFIED_BY);
        return {
            createdDate: created.effectiveDateTime,
            createdBy: this.getFullName(created),
            lastUpdateDate: updated.effectiveDateTime,
            lastUpdatedBy: this.getFullName(updated),
        };
    }

    private getFullName(data: KfaSource): string {
        return `${data.firstName} ${data.lastName}`;
    }

    private generateJEScoresData(jeScore: KfaJEScore[]): { [key: string]: string } {
        const scoreObjects = {};
        for (const item of jeScore || []) {
            Object.keys(JEScoresColumnNames[item.jeScoreType] || {})
                .filter((key) => key !== 'name')
                .forEach((key: string, i: number) => {
                    let value;
                    if (key.includes('Points')) {
                        value = item.points ? String(item.points) : '';
                    } else if (key.includes('Rationale')) {
                        value = item.rationaleDescription;
                    } else {
                        value = item.options[i]?.code || '';
                    }
                    scoreObjects[key] = value;
                });

            if (!scoreObjects.hasOwnProperty('wcPointsTotal') && item.jeScoreType === JEScoreTypes.WORKING_CONDITIONS) {
                scoreObjects['wcPointsTotal'] = '';
            }
        }
        return scoreObjects;
    }

    private generateDynamicProperties(jobProperties: JobProperty[]) {
        const props = {};
        (jobProperties || []).forEach((property: JobProperty) => {
            props[property.code] = property.props.map((prop: any) => prop.name).join('~');
        });
        return props;
    }

    private generateKfaColumnNames(job: JobForKFATemplate) {
        const columns = {};
        Object.keys(job).map((property: string) => {
            if (KfaJobsColumKeys[property] && this.excludeProps.indexOf(property) < 0) {
                columns[KfaJobsColumKeys[property]] = KfaJobsColumNames[KfaJobsColumKeys[property]];
            }
        });
        (job.jeScores || []).map((scores: KfaJEScore) => {
            columns[JEScoreNames[scores.jeScoreType]] = [JEScoresColumnNames[scores.jeScoreType]];
        });
        columns[KfaJobsColumKeys.totalPoints] = KfaJobsColumNames[KfaJobsColumKeys.totalPoints];
        columns[KfaJobsColumKeys.gradeSet] = KfaJobsColumNames[KfaJobsColumKeys.gradeSet];
        columns[KfaJobsColumKeys.grade] = KfaJobsColumNames[KfaJobsColumKeys.grade];
        delete columns[KfaJobsColumKeys.isGradeOverriddenByJE];
        columns[KfaJobsColumKeys.isGradeOverriddenByJE] = KfaJobsColumNames[KfaJobsColumKeys.isGradeOverriddenByJE];
        columns[KfaJobsColumKeys.shortProfile] = KfaJobsColumNames[KfaJobsColumKeys.shortProfile];
        columns[KfaJobsColumKeys.overallRationale] = KfaJobsColumNames[KfaJobsColumKeys.overallRationale];
        columns[KfaJobsColumKeys.benchmarkIndicator] = KfaJobsColumNames[KfaJobsColumKeys.benchmarkIndicator];
        job.JobProperties = [
            ...(job.JobProperties || []).filter((prop) => prop.code === KfaJobsColumKeys.manager.toUpperCase()),
            ...(job.JobProperties || []).filter((prop) => prop.code !== KfaJobsColumKeys.manager.toUpperCase()),
        ];
        (job.JobProperties || []).map((jProperty: JobProperty) => {
            columns[jProperty.code] = jProperty.name;
        });
        columns[KfaJobsColumKeys.hideInPM] = KfaJobsColumNames[KfaJobsColumKeys.hideInPM];
        columns[KfaJobsColumKeys.createdDate] = KfaJobsColumNames[KfaJobsColumKeys.createdDate];
        columns[KfaJobsColumKeys.createdBy] = KfaJobsColumNames[KfaJobsColumKeys.createdBy];
        columns[KfaJobsColumKeys.lastUpdateDate] = KfaJobsColumNames[KfaJobsColumKeys.lastUpdateDate];
        columns[KfaJobsColumKeys.lastUpdatedBy] = KfaJobsColumNames[KfaJobsColumKeys.lastUpdatedBy];
        return columns;
    }

    private async getJobsData(clientId: number, authToken: string, lcid: string): Promise<JobForKFATemplate[]> {
        const uri = getJobDatasUrl(clientId, lcid);
        const requestData = await this.makeGetRequest<JobForKFATemplate>(uri, authToken);
        return requestData ? requestData : [];
    }

    private formatDate(time: string): string {
        const date = new Date(+time);
        return date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
    }
}
