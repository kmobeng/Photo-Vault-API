import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const sendEmail = async (options: any) => {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: Number(process.env.EMAIL_PORT),
    secure: false,
  } as SMTPTransport.MailOptions);

  const mailOptions = {
    from: "Photo Vault <noreply@topschedule.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
