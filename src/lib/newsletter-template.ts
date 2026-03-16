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

const insuranceBannerImage =
  process.env.NEWSLETTER_INSURANCE_BANNER_IMAGE_URL?.trim() ||
  "https://images.unsplash.com/photo-1529078155058-5d716f45d604?auto=format&fit=crop&w=1400&q=80";
const insuranceBannerCtaUrl =
  process.env.NEWSLETTER_INSURANCE_BANNER_CTA_URL?.trim() ||
  "https://wa.me/556132021245?text=Quero%20cotar%20seguro%20de%20viagem%20internacional";

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
const safeLogo = (contentLogoUrl: string): string => {
  if (contentLogoUrl.trim()) {
    return escapeHtml(contentLogoUrl);
  }

  return escapeHtml(getFixedLogoUrl());
};

const renderHighlightBanner = (content: NewsletterContent): string => `
  <tr>
    <td style="padding:14px 16px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:14px;overflow:hidden;border:1px solid #cfe4f4;background:#eef7ff;">
        <tr>
          <td style="padding:10px 10px 0;">
            <img src="${safeImage(content.highlightBanner.imageUrl)}" alt="${escapeHtml(content.highlightBanner.title)}" width="100%" style="display:block;height:220px;object-fit:cover;border-radius:10px;" />
          </td>
        </tr>
        <tr>
          <td style="padding:14px 16px 16px;font-family:Arial,Helvetica,sans-serif;">
            <div style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#2a79be;font-weight:700;">Oferta destaque</div>
            <div style="margin-top:6px;font-size:24px;line-height:1.2;color:#103a57;font-weight:700;">${escapeHtml(content.highlightBanner.title)}</div>
            <div style="margin-top:8px;font-size:15px;line-height:1.6;color:#274b63;">${escapeHtml(content.highlightBanner.description)}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;

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
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#1f3c53;">
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

const renderInsuranceBanner = (): string => `
  <tr>
    <td style="padding:6px 16px 18px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:14px;overflow:hidden;border:1px solid #f2d7a5;background:#fff8ed;">
        <tr>
          <td style="padding:10px 10px 0;">
            <img src="${safeImage(insuranceBannerImage)}" alt="Seguro de viagem internacional" width="100%" style="display:block;height:180px;object-fit:cover;border-radius:10px;" />
          </td>
        </tr>
        <tr>
          <td style="padding:14px 16px 16px;font-family:Arial,Helvetica,sans-serif;">
            <div style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#b96d00;font-weight:700;">Protecao internacional</div>
            <div style="margin-top:6px;font-size:24px;line-height:1.2;color:#7a4a00;font-weight:700;">Seguro de viagem internacional</div>
            <div style="margin-top:8px;font-size:15px;line-height:1.6;color:#5e4a2d;">Assistencia medica, cobertura para bagagem, suporte 24h e tranquilidade do embarque ao retorno.</div>
            <div style="margin-top:12px;">
              <a href="${escapeHtml(insuranceBannerCtaUrl)}" style="display:inline-block;padding:10px 14px;border-radius:8px;background:#c77700;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;">Solicitar cotacao de seguro</a>
            </div>
          </td>
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
                <div style="display:inline-block;background:#ffffff;border-radius:12px;padding:10px 12px;">
                  <img src="${safeLogo(content.logoUrl)}" alt="Casa de Viagens" width="220" style="display:block;max-width:100%;height:auto;" />
                </div>
                <div style="margin-top:14px;display:inline-block;padding:6px 10px;border-radius:999px;background:#ffffff1c;font-size:11px;letter-spacing:0.09em;text-transform:uppercase;font-weight:700;">
                  Newsletter semanal
                </div>
                <div style="margin-top:12px;font-size:34px;line-height:1.08;font-weight:700;">${escapeHtml(content.agencyName)}</div>
                <div style="margin-top:10px;font-size:14px;line-height:1.55;color:#d9eefe;max-width:520px;">${escapeHtml(content.preheader)}</div>
              </td>
            </tr>

            ${renderHighlightBanner(content)}

            ${renderSection("3 Pacotes Nacionais", content.nationalPackages)}
            ${renderSection("3 Pacotes Internacionais", content.internationalPackages)}
            ${renderInsuranceBanner()}

            <tr>
              <td style="padding:18px 20px;background:#082d44;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#c8dfef;line-height:1.75;text-align:center;">
                Conteudo atualizado em ${escapeHtml(new Date(content.updatedAt).toLocaleString("pt-BR"))}<br /><br />
                Casa Mundo de Viagens e Negocios em Turismo Ltda<br />
                CNPJ: 04.078.769/0001-83<br />
                Cadastur: 070001521000010 Casa de Viagens<br />
                (61) 3202-1245<br />
                carlosvieira@casadeviagens.com.br<br />
                St Setor Comercial Sul Quadra 02 Bloco B, 20 - Sala 911 - Asa Sul<br />
                Brasilia / DF - CEP: 70318-900
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
  lines.push(`Banner: ${content.highlightBanner.title}`);
  lines.push(content.highlightBanner.description);
  lines.push(`Imagem do banner: ${content.highlightBanner.imageUrl}`);
  lines.push("");
  lines.push("3 Pacotes Nacionais:");
  content.nationalPackages.forEach((card, index) => lines.push(`${index + 1}. ${card.caption} - ${card.imageUrl}`));
  lines.push("");
  lines.push("3 Pacotes Internacionais:");
  content.internationalPackages.forEach((card, index) => lines.push(`${index + 1}. ${card.caption} - ${card.imageUrl}`));
  lines.push("");
  lines.push("Seguro de viagem internacional:");
  lines.push("Assistencia medica, cobertura para bagagem e suporte 24h.");
  lines.push(`Solicite sua cotacao: ${insuranceBannerCtaUrl}`);
  lines.push("");
  lines.push("Casa Mundo de Viagens e Negocios em Turismo Ltda");
  lines.push("CNPJ: 04.078.769/0001-83");
  lines.push("Cadastur: 070001521000010 Casa de Viagens");
  lines.push("(61) 3202-1245");
  lines.push("carlosvieira@casadeviagens.com.br");
  lines.push("St Setor Comercial Sul Quadra 02 Bloco B, 20 - Sala 911 - Asa Sul");
  lines.push("Brasilia / DF");
  lines.push("CEP: 70318-900");
  return lines.join("\n");
};
