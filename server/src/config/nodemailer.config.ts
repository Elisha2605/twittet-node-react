import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import validator from 'email-validator';

let transporter: Transporter;

export const emailConfig = () => {
    dotenv.config();

    transporter = nodemailer.createTransport({
        service: 'gmail',
        port: parseInt(process.env.MAIL_PORT),
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
};

interface Email {
    sender: string;
    senderMail: string;
    recipients: string[];
    subject: string;
    textBody: string;
    htmlBody?: string;
}

export const sendEmail = async (email: Email): Promise<any> => {
    const validateAddress = [];
    for (const addr of email.recipients) {
        if (validator.validate(addr)) {
            validateAddress.push(addr);
        }
    }
    const info = await transporter.sendMail({
        from: `"${email.sender}" <${email.senderMail}>`,
        to: validateAddress.map((address: string) => address + ','),
        subject: `${email.subject}`,
        text: email.textBody,
        html: email.htmlBody,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    return info;
};
