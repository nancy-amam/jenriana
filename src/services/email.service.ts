import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const from = process.env.MAIL_FROM || "noreply@example.com";

  const res = await mailer.sendMail({
    from,
    to,
    subject,
    html,
  });
  console.log("Email Sent ");
  return res;
}
