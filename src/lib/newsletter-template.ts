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
    <td style="padding:22px 16px 10px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;color:#102f45;">
      ${escapeHtml(title)}
    </td>
  </tr>
  <tr>
    <td style="padding:0 8px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${cards
            .slice(0, 3)
            .map(
                (card, index) => `
              <td width="33.33%" valign="top" style="padding:8px;">
                <img src="${safeImage(card.imageUrl)}" alt="${escapeHtml(`${title} ${index + 1}`)}" width="100%" style="display:block;height:180px;object-fit:cover;border-radius:10px;" />
                <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#2d4658;">
                  ${escapeHtml(card.caption)}
                </p>
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
  <body style="margin:0;padding:0;background:#eef3f8;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(content.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f8;padding:20px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:22px 20px;background:#0f6eb7;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
                <img src="${escapeHtml(getFixedLogoUrl())}" alt="Horizonte Viagens" width="220" style="display:block;max-width:100%;height:auto;" />
                <div style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;">Newsletter de ofertas</div>
                <div style="margin-top:8px;font-size:34px;line-height:1.1;font-weight:700;">${escapeHtml(content.agencyName)}</div>
                <div style="margin-top:10px;font-size:14px;line-height:1.5;color:#dcecff;">${escapeHtml(content.preheader)}</div>
              </td>
            </tr>

            ${renderSection("3 Pacotes Nacionais", content.nationalPackages)}
            ${renderSection("3 Pacotes Internacionais", content.internationalPackages)}

            <tr>
              <td style="padding:18px 20px;background:#072d43;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#c8dfef;line-height:1.6;text-align:center;">
                Conteudo atualizado em ${escapeHtml(new Date(content.updatedAt).toLocaleString("pt-BR"))}
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
