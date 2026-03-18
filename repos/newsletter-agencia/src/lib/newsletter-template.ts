import { NewsletterContent, PackageImage, TourismNewsItem } from "@/lib/types";

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

const getCurrentDate = (): string => {
  const now = new Date();
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  return `${weekdays[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
};

const renderHeader = (content: NewsletterContent): string => `
  <tr>
    <td style="padding:32px 28px 28px;background:linear-gradient(135deg, #0a4e8d 0%, #0f6eb7 100%);">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <img src="${safeLogo(content.logoUrl)}" alt="Casa de Viagens" width="200" style="display:block;max-width:100%;height:auto;" />
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:20px;">
            <div style="display:inline-block;padding:8px 16px;background:rgba(255,255,255,0.15);border-radius:30px;border:1px solid rgba(255,255,255,0.2);">
              <span style="color:#ffffff;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">
                📧 Newsletter ${new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:18px;">
            <h1 style="margin:0;font-family:'Georgia',serif;font-size:36px;font-weight:700;color:#ffffff;line-height:1.2;text-align:center;">
              ${escapeHtml(content.agencyName)}
            </h1>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:14px;">
            <p style="margin:0;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:16px;color:rgba(255,255,255,0.85);line-height:1.6;max-width:520px;text-align:center;">
              ${escapeHtml(content.preheader)}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;

const renderHighlightBanner = (content: NewsletterContent): string => `
  <tr>
    <td style="padding:24px 28px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(10,78,141,0.15);">
        <tr>
          <td style="position:relative;">
            <img src="${safeImage(content.highlightBanner.imageUrl)}" alt="${escapeHtml(content.highlightBanner.title)}" width="100%" style="display:block;height:280px;object-fit:cover;" />
            <div style="position:absolute;top:16px;left:16px;background:#ff6b35;padding:6px 14px;border-radius:20px;">
              <span style="color:#ffffff;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">
                ⭐ Oferta Exclusive
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 28px;background:#ffffff;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="color:#ff6b35;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                    Destaque da Semana
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding-top:8px;">
                  <h2 style="margin:0;font-family:'Georgia',serif;font-size:28px;font-weight:700;color:#1a365d;line-height:1.25;">
                    ${escapeHtml(content.highlightBanner.title)}
                  </h2>
                </td>
              </tr>
              <tr>
                <td style="padding-top:12px;">
                  <p style="margin:0;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:16px;color:#4a5568;line-height:1.7;">
                    ${escapeHtml(content.highlightBanner.description)}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;

const renderSection = (title: string, subtitle: string, cards: PackageImage[], isInternational: boolean): string => {
  if (cards.length === 0) return "";

  const accentColor = isInternational ? "#0a4e8d" : "#0d9488";
  const bgColor = isInternational ? "#f0f7ff" : "#f0fdfa";
  const borderColor = isInternational ? "#dbeafe" : "#ccfbf1";

  return `
    <tr>
      <td style="padding:32px 28px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <div style="display:inline-block;padding:6px 14px;background:${accentColor};border-radius:20px;">
                <span style="color:#ffffff;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;">
                  ${isInternational ? "🌍" : "🇧🇷"} ${subtitle}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:12px;">
              <h3 style="margin:0;font-family:'Georgia',serif;font-size:26px;font-weight:700;color:#1a365d;line-height:1.2;">
                ${escapeHtml(title)}
              </h3>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 18px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            ${cards
              .slice(0, 3)
              .map(
                (card, index) => `
                <td width="33.33%" valign="top" style="padding:8px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:16px;overflow:hidden;background:#ffffff;border:1px solid ${borderColor};box-shadow:0 4px 16px rgba(0,0,0,0.06);transition:transform 0.2s ease;">
                    <tr>
                      <td style="position:relative;">
                        <img src="${safeImage(card.imageUrl)}" alt="${escapeHtml(`${title} ${index + 1}`)}" width="100%" style="display:block;height:160px;object-fit:cover;" />
                        <div style="position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,0.7);padding:4px 10px;border-radius:12px;">
                          <span style="color:#ffffff;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:10px;font-weight:600;">
                            Roteiro ${index + 1}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 14px 18px;">
                        <p style="margin:0;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#374151;">
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
};

const renderInsuranceBanner = (): string => `
  <tr>
    <td style="padding:16px 28px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:20px;overflow:hidden;background:linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);border:1px solid #fdba74;">
        <tr>
          <td style="padding:24px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="top">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <span style="display:inline-block;padding:6px 12px;background:#ea580c;border-radius:20px;margin-bottom:12px;">
                          <span style="color:#ffffff;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">
                            🛡️ Protecao Internacional
                          </span>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:4px;">
                        <h3 style="margin:0;font-family:'Georgia',serif;font-size:24px;font-weight:700;color:#7c2d12;line-height:1.2;">
                          Seguro de Viagem Internacional
                        </h3>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:12px;">
                        <p style="margin:0;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:14px;color:#9a3412;line-height:1.6;">
                          Assistencia medica, cobertura para bagagem, cancelamento e muito mais. Viaje com total seguranca!
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:18px;">
                        <a href="${escapeHtml(insuranceBannerCtaUrl)}" style="display:inline-block;padding:12px 24px;background:#ea580c;color:#ffffff;text-decoration:none;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;border-radius:10px;transition:background 0.2s ease;">
                          Solicitar Cotacao Gratis →
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
                <td valign="middle" style="padding-left:24px;display:none;display:table-cell;">
                  <img src="${safeImage(insuranceBannerImage)}" alt="Seguro de viagem" width="180" style="display:block;height:180px;object-fit:cover;border-radius:16px;box-shadow:0 4px 20px rgba(234,88,12,0.2);" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;

const renderTourismNews = (newsItems: TourismNewsItem[]): string => {
  const hasNews = newsItems.length > 0;

  return `
    <tr>
      <td style="padding:8px 28px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:20px;overflow:hidden;background:#f8fafc;border:1px solid #e2e8f0;">
          <tr>
            <td style="padding:24px 28px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <span style="display:inline-block;padding:6px 12px;background:#1e40af;border-radius:20px;margin-bottom:8px;">
                      <span style="color:#ffffff;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">
                        📰 Radar do Mercado
                      </span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:4px;">
                    <h3 style="margin:0;font-family:'Georgia',serif;font-size:22px;font-weight:700;color:#1e293b;">
                      Noticias do Turismo
                    </h3>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${hasNews
                  ? newsItems
                      .slice(0, 4)
                      .map((item) => {
                        const published = new Date(item.publishedAt).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        });
                        return `
                          <tr>
                            <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
                              <a href="${escapeHtml(item.url)}" style="text-decoration:none;">
                                <span style="display:block;font-size:15px;font-weight:600;color:#1e40af;line-height:1.4;">
                                  ${escapeHtml(item.title)}
                                </span>
                              </a>
                              <span style="display:block;font-size:12px;color:#64748b;padding-top:4px;">
                                ${escapeHtml(item.source)} • ${escapeHtml(published)}
                              </span>
                            </td>
                          </tr>
                        `;
                      })
                      .join("")
                  : `
                    <tr>
                      <td style="padding:12px 0;">
                        <span style="display:block;font-size:14px;line-height:1.6;color:#475569;">
                          Nao foi possivel carregar as noticias agora. Verifique a configuracao da GNews (GNEWS_API_KEY) ou aguarde o cache ser atualizado.
                        </span>
                      </td>
                    </tr>
                  `}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
};

const renderCtaSection = (): string => `
  <tr>
    <td style="padding:8px 28px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:20px;overflow:hidden;background:linear-gradient(135deg, #0a4e8d 0%, #0f6eb7 100%);">
        <tr>
          <td style="padding:28px;text-align:center;">
            <h3 style="margin:0;font-family:'Georgia',serif;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
              Pronto para sua proxima aventura?
            </h3>
            <p style="margin:12px 0 0;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.6;">
              Fale com nossos especialistas e tire sua viagem do papel!
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:18px;">
              <tr>
                <td style="padding:0 8px;">
                  <a href="https://wa.me/556132021245" style="display:inline-block;padding:12px 20px;background:#25D366;color:#ffffff;text-decoration:none;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;border-radius:10px;">
                    WhatsApp
                  </a>
                </td>
                <td style="padding:0 8px;">
                  <a href="mailto:carlosvieira@casadeviagens.com.br" style="display:inline-block;padding:12px 20px;background:rgba(255,255,255,0.15);color:#ffffff;text-decoration:none;font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;border-radius:10px;border:1px solid rgba(255,255,255,0.3);">
                    Email
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;

const renderFooter = (content: NewsletterContent): string => `
  <tr>
    <td style="padding:28px 24px 32px;background:#0f172a;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <img src="${safeLogo(content.logoUrl)}" alt="Casa de Viagens" width="160" style="display:block;max-width:100%;height:auto;opacity:0.8;" />
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:20px;">
            <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;text-align:center;max-width:480px;">
              <strong style="color:#e2e8f0;">Casa Mundo de Viagens e Negocios em Turismo Ltda</strong><br />
              CNPJ: 04.078.769/0001-83 | Cadastur: 070001521000010
            </p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:12px;">
            <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;text-align:center;">
              (61) 3202-1245 | carlosvieira@casadeviagens.com.br
            </p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:8px;">
            <p style="margin:0;font-size:12px;color:#64748b;line-height:1.6;text-align:center;">
              St. Comercial Sul Quadra 02 Bloco B, 20 - Sala 911 - Asa Sul<br />
              Brasilia / DF - CEP: 70318-900
            </p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:20px;">
            <p style="margin:0;font-size:11px;color:#475569;line-height:1.5;text-align:center;">
              Receba nossas ofertas e novidades sobre viagens<br />
              <a href="{{{unsubscribe}}}" style="color:#64748b;text-decoration:underline;">Descadastrar</a> |
              <a href="{{{web_view}}}" style="color:#64748b;text-decoration:underline;">Ver online</a>
            </p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:16px;">
            <p style="margin:0;font-size:10px;color:#334155;line-height:1.4;text-align:center;">
              Este email foi enviado em ${getCurrentDate()}<br />
              Conteudo atualizado em ${escapeHtml(new Date(content.updatedAt).toLocaleString("pt-BR"))}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;

export const renderNewsletterHtml = (content: NewsletterContent, newsItems: TourismNewsItem[] = []): string => `<!doctype html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="email=no" />
    <title>${escapeHtml(content.agencyName)} - Newsletter de Viagens</title>
    <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <style type="text/css">
      body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table { border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { border: 0; -ms-interpolation-mode: bicubic; display: block; }
      a { text-decoration: none; }
      @media only screen and (max-width: 640px) {
        .mobile-full { width: 100% !important; }
        .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
        .hide-mobile { display: none !important; }
        .card-stack { display: block !important; width: 100% !important; }
        .card-stack td { display: block !important; width: 100% !important; padding: 8px 0 !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(content.preheader)}</div>
    
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:20px 0 40px;">
      <tr>
        <td align="center">
          <!-- Email Container -->
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            
            ${renderHeader(content)}
            
            ${renderHighlightBanner(content)}
            
            ${renderTourismNews(newsItems)}
            
            ${renderSection("Pacotes Nacionais", "Destinos Nacionales", content.nationalPackages, false)}
            
            ${renderSection("Pacotes Internacionais", "Destinos Internacionais", content.internationalPackages, true)}
            
            ${renderInsuranceBanner()}
            
            ${renderCtaSection()}
            
            ${renderFooter(content)}
            
          </table>
          <!-- End Email Container -->
        </td>
      </tr>
    </table>
  </body>
</html>`;

export const renderNewsletterText = (content: NewsletterContent, newsItems: TourismNewsItem[] = []): string => {
  const lines: string[] = [];
  lines.push("=".repeat(50));
  lines.push(content.agencyName);
  lines.push("=".repeat(50));
  lines.push("");
  lines.push(content.preheader);
  lines.push("");
  lines.push("-".repeat(50));
  lines.push("DESTAQUE DA SEMANA");
  lines.push("-".repeat(50));
  lines.push(content.highlightBanner.title);
  lines.push(content.highlightBanner.description);
  lines.push("");
  lines.push("-".repeat(50));
  lines.push("PACOTES NACIONAIS");
  lines.push("-".repeat(50));
  content.nationalPackages.forEach((card, index) => lines.push(`${index + 1}. ${card.caption}`));
  lines.push("");
  lines.push("-".repeat(50));
  lines.push("PACOTES INTERNACIONAIS");
  lines.push("-".repeat(50));
  content.internationalPackages.forEach((card, index) => lines.push(`${index + 1}. ${card.caption}`));
  lines.push("");
  lines.push("-".repeat(50));
  lines.push("SEGURO DE VIAGEM INTERNACIONAL");
  lines.push("-".repeat(50));
  lines.push("Assistencia medica, cobertura para bagagem e suporte 24h.");
  lines.push(`Solicite sua cotacao: ${insuranceBannerCtaUrl}`);
  lines.push("");
  lines.push("-".repeat(50));
  lines.push("NOTICIAS DO TURISMO");
  lines.push("-".repeat(50));
  if (newsItems.length) {
    newsItems.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.title}`);
      lines.push(`   Fonte: ${item.source} | ${item.url}`);
    });
  } else {
    lines.push("Atualizacao de noticias temporariamente indisponivel.");
  }
  lines.push("");
  lines.push("=".repeat(50));
  lines.push("CONTATO");
  lines.push("=".repeat(50));
  lines.push("Casa Mundo de Viagens e Negocios em Turismo Ltda");
  lines.push("CNPJ: 04.078.769/0001-83");
  lines.push("Cadastur: 070001521000010 Casa de Viagens");
  lines.push("(61) 3202-1245");
  lines.push("carlosvieira@casadeviagens.com.br");
  lines.push("St. Comercial Sul Quadra 02 Bloco B, 20 - Sala 911 - Asa Sul");
  lines.push("Brasilia / DF - CEP: 70318-900");
  return lines.join("\n");
};
