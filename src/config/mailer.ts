import nodeMailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';

const transporter = nodeMailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false, // use SSL-TLS
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmailNormal = (
  to: string,
  subject: string,
  htmlContent: string
): Promise<SentMessageInfo> => {
  const options = {
    from: process.env.MAIL_USERNAME,
    to: to,
    subject: subject,
    html: htmlContent,
  };
  return transporter.sendMail(options);
};

const sendEmailWithAttachment = (
  to: string,
  subject: string,
  htmlContent: string,
  filename: string,
  path: string
): Promise<SentMessageInfo> => {
  const options = {
    from: process.env.MAIL_USERNAME,
    to: to,
    subject: subject,
    html: htmlContent,
    attachments: [
      {
        filename: filename,
        path: path,
      },
    ],
  };
  return transporter.sendMail(options);
};

export { sendEmailNormal, sendEmailWithAttachment };
