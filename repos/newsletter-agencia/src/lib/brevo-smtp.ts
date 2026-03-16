const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Configure ${name} no .env.local`);
  }
  return value;
};

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const FIXED_SENDER_EMAIL = "promo@casadeviagens.com";

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
  const apiKey = getRequiredEnv("BREVO_API_KEY");
  const senderName = process.env.BREVO_SENDER_NAME ?? "Casa de Viagens";

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: {
        email: FIXED_SENDER_EMAIL,
        name: senderName,
      },
      to: [
        {
          email: payload.to.email,
          name: payload.to.name,
        },
      ],
      subject: payload.subject,
      htmlContent: payload.html,
      textContent: payload.text,
      headers: {
        "X-Mailer": "newsletter-agencia",
        "X-Template-Version": "v2",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo API error ${response.status}: ${errorText.slice(0, 400)}`);
  }

  const result = (await response.json()) as { messageId?: string };
  return result.messageId ?? "brevo-message-id-not-returned";
};
