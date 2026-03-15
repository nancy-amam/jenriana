import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/** Build a valid RFC "from" address. SMTP requires an email; MAIL_FROM can be "Name" or "email@domain.com" or "Name <email@domain.com>". */
function getFromAddress(): string {
  const mailFrom = (process.env.MAIL_FROM || "").trim();
  const smtpUser = (process.env.SMTP_USER || "").trim();
  const defaultEmail = smtpUser || "noreply@example.com";
  if (!mailFrom) return defaultEmail;
  if (mailFrom.includes("@")) return mailFrom;
  return `${mailFrom} <${smtpUser || "noreply@example.com"}>`;
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const from = getFromAddress();
  if (!from || !from.includes("@")) {
    throw new Error("Email from address is invalid: set MAIL_FROM (e.g. 'Your App' or 'noreply@domain.com') and SMTP_USER in .env");
  }

  const res = await mailer.sendMail({
    from,
    to,
    subject,
    html,
  });
  return res;
}
