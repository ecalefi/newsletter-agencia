import { NewsletterContent, PackageImage } from "@/lib/types";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const fallbackImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

const getFixedLogoUrl = (): string => {
  const explicit = process.env.NEWSLETTER_LOGO_URL?.trim();
  if (explicit) {
    return explicit;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim();
  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, "")}/logo-horizonte-viagens.svg`;
  }

  return "/logo-horizonte-viagens.svg";
};

const safeImage = (value: string): string => (value.trim() ? escapeHtml(value) : fallbackImage);

const renderSection = (title: string, cards: PackageImage[]): string => `
  <tr>
    <td style="padding:26px 20px 10px;">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#2a79be;font-weight:700;text-align:center;">
        Promocoes da semana
      </div>
      <div style="margin-top:8px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:30px;line-height:1.15;font-weight:700;color:#12344f;">
        ${escapeHtml(title)}
      </div>
    </td>
  </tr>
  <tr>
    <td style="padding:0 10px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${cards
            .slice(0, 3)
            .map(
              (card, index) => `
              <td width="33.33%" valign="top" style="padding:8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #d6e6f2;border-radius:12px;overflow:hidden;background:#f7fbff;">
                  <tr>
                    <td style="padding:10px 10px 6px;">
                      <div style="display:inline-block;padding:4px 8px;border-radius:999px;background:#e4f1fc;color:#1762a5;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;line-height:1;">
                        Roteiro ${index + 1}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 10px 10px;">
                      <img src="${safeImage(card.imageUrl)}" alt="${escapeHtml(`${title} ${index + 1}`)}" width="100%" style="display:block;height:180px;object-fit:cover;border-radius:10px;" />
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 12px 14px;">
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#1f3c53;">
                        ${escapeHtml(card.caption)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            `,
            )
            .join("\n")}
        </tr>
      </table>
    </td>
  </tr>
`;

export const renderNewsletterHtml = (content: NewsletterContent): string => `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(content.agencyName)}</title>
  </head>
  <body style="margin:0;padding:0;background:#edf4fb;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(content.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#edf4fb;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d8e7f3;">
            <tr>
              <td style="padding:26px 22px;background:linear-gradient(135deg,#0f6eb7 0%,#0a4e8d 100%);color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
                <img src="${escapeHtml(getFixedLogoUrl())}" alt="Horizonte Viagens" width="220" style="display:block;max-width:100%;height:auto;" />
                <div style="margin-top:14px;display:inline-block;padding:6px 10px;border-radius:999px;background:#ffffff1c;font-size:11px;letter-spacing:0.09em;text-transform:uppercase;font-weight:700;">
                  Newsletter semanal
                </div>
                <div style="margin-top:12px;font-size:34px;line-height:1.08;font-weight:700;">${escapeHtml(content.agencyName)}</div>
                <div style="margin-top:10px;font-size:14px;line-height:1.55;color:#d9eefe;max-width:520px;">${escapeHtml(content.preheader)}</div>
              </td>
            </tr>

            ${renderSection("3 Pacotes Nacionais", content.nationalPackages)}
            ${renderSection("3 Pacotes Internacionais", content.internationalPackages)}

            <tr>
              <td style="padding:18px 20px;background:#082d44;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#c8dfef;line-height:1.7;text-align:center;">
                Conteudo atualizado em ${escapeHtml(new Date(content.updatedAt).toLocaleString("pt-BR"))}<br />
                Casa de Viagens | Ofertas sujeitas a disponibilidade
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export const renderNewsletterText = (content: NewsletterContent): string => {
  const lines: string[] = [];
  lines.push(content.agencyName);
  lines.push(content.preheader);
  lines.push("");
  lines.push("3 Pacotes Nacionais:");
  content.nationalPackages.forEach((card, index) => lines.push(`${index + 1}. ${card.caption} - ${card.imageUrl}`));
  lines.push("");
  lines.push("3 Pacotes Internacionais:");
  content.internationalPackages.forEach((card, index) => lines.push(`${index + 1}. ${card.caption} - ${card.imageUrl}`));
  return lines.join("\n");
};
