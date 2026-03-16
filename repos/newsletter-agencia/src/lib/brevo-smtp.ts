import nodemailer from "nodemailer";

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Configure ${name} no .env.local`);
  }
  return value;
};

const getTransporter = () => {
  const host = process.env.BREVO_SMTP_HOST ?? "smtp-relay.brevo.com";
  const port = Number(process.env.BREVO_SMTP_PORT ?? "587");
  const user = getRequiredEnv("BREVO_SMTP_USER");
  const pass = getRequiredEnv("BREVO_SMTP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
  });
};

export interface SmtpRecipient {
  email: string;
  name?: string;
}

export interface SendSmtpPayload {
  subject: string;
  html: string;
  text: string;
  to: SmtpRecipient;
}

export const sendBrevoSmtpMail = async (payload: SendSmtpPayload): Promise<string> => {
  const senderEmail = getRequiredEnv("BREVO_SENDER_EMAIL");
  const senderName = process.env.BREVO_SENDER_NAME ?? "Newsletter";

  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: `${senderName} <${senderEmail}>`,
    to: payload.to.name ? `${payload.to.name} <${payload.to.email}>` : payload.to.email,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    headers: {
      "X-Mailer": "newsletter-agencia",
      "X-Template-Version": "v2",
    },
  });

  return info.messageId;
};
