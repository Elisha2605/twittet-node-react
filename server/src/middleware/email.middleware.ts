import { emailConfig, sendEmail } from '../../src/config/nodemailer.config';

export const mailError = (err: any, req: any) => {
    emailConfig();
    const mailData = {
        sender: 'System',
        senderMail: 'customertwitter23@gmail.com',
        recipients: ['customertwitter23@gmail.com'],
        subject: 'Error',
        textBody: '',
        htmlBody: `<p>Host: <br>${req.get('host')} <br><br>Request:<br> ${
            req.url
        } <br><br> Error: <br>${err.stack}`,
    };
    sendEmail(mailData);
};
