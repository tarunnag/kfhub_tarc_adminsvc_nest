import * as nodemailer from 'nodemailer';

import * as Mail from 'nodemailer/lib/mailer';

export class KfEmailUtil {
    private smtp;

    constructor(smtpConfiguration) {
        this.smtp = smtpConfiguration;
    }

    mailTransporter(): Mail {
        return nodemailer.createTransport(this.smtp);
    }
}
