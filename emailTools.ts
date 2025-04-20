import nodemailer from 'nodemailer';
import { z } from 'zod';

// Zod schema for email validation
const emailSchema = z.string().email();

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;

if (!smtpUser) {
    throw new Error('SMTP_USER is not set in .env file.');
}

if (!smtpPass) {
    throw new Error('SMTP_PASS is not set in .env file.');
}

if (!smtpHost) {
    throw new Error('SMTP_HOST is not set in .env file.');
}

if (!smtpPort) {
    throw new Error('SMTP_PORT is not set in .env file.');
}

// Function to send an email
export async function sendEmail(to: string, subject: string, body: string): Promise<string> {
    try {
        emailSchema.parse(to);

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: true, // true for 465, false for other ports
            auth: {
                user: smtpUser, // generated ethereal user
                pass: smtpPass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: smtpUser, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: body, // plain text body
            html: `<p>${body}</p>`, // html body
        });

        console.log("Message sent: %s", info.messageId);

        return `Email sent successfully. Message ID: ${info.messageId}`;

    } catch (error: any) {
        console.error('Error sending email:', error);
        return `Could not send email. ${error.message}`;
    }
}