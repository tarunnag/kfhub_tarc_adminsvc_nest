import { Injectable } from '@nestjs/common';
import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';

const configService = new KfConfigService();
@Injectable()
export class KfEmailTemplate {
    htmlTemplate(data) {
        return `<div lang="EN-US" link="#0563C1" vlink="#954F72">
<div>
    <p class="MsoNormal"><u></u>&nbsp;<u></u></p>
    <div id="m_-6440532931638080332m_-1148681907857334075masthead_root">
        <div id="m_-6440532931638080332m_-1148681907857334075logo">
            <div id="m_-6440532931638080332m_-1148681907857334075logo_top">
                <p class="MsoNormal">
                    <img
                        width="800"
                        height="68"
                        style="width: 8.3333in; height: 0.7083in;"
                        id="m_-6440532931638080332m_-1148681907857334075_x0000_i1025"
                        src="https://ci3.googleusercontent.com/proxy/w_FKbeQHnkzbhQBcvZD7Ir-YybOi7vul23hnl0nZnSHI4EeEHE0OKhMFKqq2vvzy8Vn5gEh5-ArSo85T46vvSWx-xKbEtw=s0-d-e1-ft#https://sfts.kornferry.com/images/KF_Email_logo.jpg"
                        alt="KornFerry®"
                        class="CToWUd"
                    /><u></u><u></u>
                </p>
            </div>
        </div>
    </div>
    <p class="MsoNormal" style="margin-bottom: 12pt;"><u></u>&nbsp;<u></u></p>
    <p>
        <span style="font-size: 9pt; font-family: 'Arial', sans-serif;"
            >This is an automated email from the Secure File Transfer System. A client has downloaded a file that you uploaded for their access. Please see
            details below:<u></u><u></u
        ></span>
    </p>
    <table border="1" cellspacing="1" cellpadding="0" style="border: solid #cccccc 1pt;">
        <tbody>

            ${this.createBlocks('Time of download', data.timeOfDownload)}
            ${this.createBlocks('Project Name', data.projectName)}
            ${this.createBlocks('Client Name', data.clientName)}
            ${this.createEmailBlock('Requestor Email', data.requestorEmail)}
            ${this.createBlocks('Requestor Reason', data.reasonforExport)}
            ${this.createBlocks('Language', data.language)}
            ${this.createBlocks('File Name', data.fileName)}
            ${this.createLastBlock('Downloaded By', data.loggedInUserEmail)}


        </tbody>
    </table>
    <p class="MsoNormal"><u></u>&nbsp;<u></u></p>
    <div class="yj6qo"></div>
    <div class="adL"></div>
</div>
<div class="adL"></div>
</div>
`;
    }

    createBlocks(left, right) {
        return `  <tr>
        <td width="160"  style="
                width: 120pt;
                border-top: none;
                border-left: none;
                border-bottom: solid #cccccc 1pt;
                border-right: solid #cccccc 1pt;
                padding: 3.75pt 3.75pt 3.75pt 3.75pt;
            ">
            <p class="MsoNormal">
                <span style="font-size: 9pt; font-family: 'Arial', sans-serif;">${left}: <u></u><u></u></span>
            </p>
        </td>
        <td width="430" style="width: 322.5pt; border: none; border-bottom: solid #cccccc 1pt; padding: 3.75pt 3.75pt 3.75pt 3.75pt;">
            <p class="MsoNormal">
                <span style="font-size: 9pt; font-family: 'Arial', sans-serif;">${right}<u></u><u></u></span>
            </p>
        </td>
    </tr>`;
    }

    createEmailBlock(left, right) {
        return `<tr>
        <td
            width="160"
            style="
                width: 120pt;
                border-top: none;
                border-left: none;
                border-bottom: solid #cccccc 1pt;
                border-right: solid #cccccc 1pt;
                padding: 3.75pt 3.75pt 3.75pt 3.75pt;
            "
        >
            <p class="MsoNormal">
                <span style="font-size: 9pt; font-family: 'Arial', sans-serif;">${left}: <u></u><u></u></span>
            </p>
        </td>
        <td width="430" style="width: 322.5pt; border: none; border-bottom: solid #cccccc 1pt; padding: 3.75pt 3.75pt 3.75pt 3.75pt;">
            <p class="MsoNormal">
                <span style="font-size: 9pt; font-family: 'Arial', sans-serif;"
                    ><a href="mailto:${right}" target="_blank">${right}</a><u></u><u></u
                ></span>
            </p>
        </td>
    </tr>`;
    }
    createLastBlock(left, right) {
        return `   <tr>
        <td width="160" style="width: 120pt; border: none; border-right: solid #cccccc 1pt; padding: 3.75pt 3.75pt 3.75pt 3.75pt;">
            <p class="MsoNormal">
                <span style="font-size: 9pt; font-family: 'Arial', sans-serif;">${left}: <u></u><u></u></span>
            </p>
        </td>
        <td width="430" style="width: 322.5pt; border: none; padding: 3.75pt 3.75pt 3.75pt 3.75pt;">
            <p class="MsoNormal">
                <span style="font-size: 9pt; font-family: 'Arial', sans-serif;">${right}<u></u><u></u></span>
            </p>
        </td>
    </tr>`;
    }

    subject(clientName: string) {
        return `Notification ${configService.get('APP_ENV')}: Talent Hub Custom SP and JD Export Downloaded for ${clientName}`;
    }
}
