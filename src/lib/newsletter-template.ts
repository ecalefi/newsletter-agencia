import { NewsletterContent, ReviewCard, SectionCard } from "@/lib/types";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const safeUrl = (value: string): string => (value.trim() ? escapeHtml(value) : "https://example.com");

const safeImage = (value: string): string =>
  value.trim()
    ? escapeHtml(value)
    : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

const cardColumns = (cards: SectionCard[]): string =>
  cards
    .slice(0, 3)
    .map(
      (card) => `
      <td width="33.33%" valign="top" style="padding:8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #d8e3ee;border-radius:10px;background:#ffffff;">
          <tr>
            <td>
              <img src="${safeImage(card.imageUrl)}" alt="${escapeHtml(card.title)}" width="100%" style="display:block;border-top-left-radius:10px;border-top-right-radius:10px;height:120px;object-fit:cover;" />
            </td>
          </tr>
          <tr>
            <td style="padding:10px 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#0f3048;">
              ${escapeHtml(card.title)}
            </td>
          </tr>
          <tr>
            <td style="padding:6px 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#49718f;line-height:1.4;">
              ${escapeHtml(card.subtitle)}
            </td>
          </tr>
          <tr>
            <td style="padding:6px 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#3f6078;line-height:1.5;min-height:40px;">
              ${escapeHtml(card.description)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#1f7fce;">
              ${escapeHtml(card.price)}
            </td>
          </tr>
          <tr>
            <td style="padding:10px;">
              <a href="${safeUrl(card.ctaUrl)}" style="display:inline-block;background:#1f7fce;color:#ffffff;text-decoration:none;padding:8px 12px;border-radius:6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;">
                ${escapeHtml(card.ctaLabel || "Book now")}
              </a>
            </td>
          </tr>
        </table>
      </td>
    `,
    )
    .join("\n");

const reviewColumns = (reviews: ReviewCard[]): string =>
  reviews
    .slice(0, 3)
    .map(
      (review) => `
      <td width="33.33%" valign="top" style="padding:8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#072d43;border-radius:10px;">
          <tr>
            <td style="padding:12px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="36" valign="top">
                    <img src="${safeImage(review.avatarUrl)}" alt="${escapeHtml(review.name)}" width="32" height="32" style="display:block;border-radius:50%;object-fit:cover;" />
                  </td>
                  <td valign="top">
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#ffffff;">${escapeHtml(review.name)}</div>
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8fc5eb;">${escapeHtml(review.role)}</div>
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#f6d365;">${escapeHtml(review.rating)}</div>
                  </td>
                </tr>
              </table>
              <div style="margin-top:10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#d9edfb;">
                ${escapeHtml(review.text)}
              </div>
            </td>
          </tr>
        </table>
      </td>
    `,
    )
    .join("\n");

const section = (title: string, cards: SectionCard[]): string => `
  <tr>
    <td style="padding:22px 16px 8px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#103049;text-align:center;">
      ${escapeHtml(title)}
    </td>
  </tr>
  <tr>
    ${cardColumns(cards)}
  </tr>
`;

const banner = (title: string, subtitle: string, imageUrl: string, ctaUrl: string, ctaLabel: string): string => `
  <tr>
    <td style="padding:10px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0d8adf;border-radius:12px;overflow:hidden;">
        <tr>
          <td width="52%" valign="top" style="padding:18px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
            <div style="font-size:30px;line-height:1.1;font-weight:700;">${escapeHtml(title)}</div>
            <div style="margin-top:10px;font-size:14px;line-height:1.5;color:#d8efff;">${escapeHtml(subtitle)}</div>
            <a href="${safeUrl(ctaUrl)}" style="display:inline-block;margin-top:14px;background:#ffffff;color:#0d8adf;text-decoration:none;padding:9px 14px;border-radius:6px;font-size:12px;font-weight:700;">
              ${escapeHtml(ctaLabel || "Book now")}
            </a>
          </td>
          <td width="48%">
            <img src="${safeImage(imageUrl)}" alt="${escapeHtml(title)}" width="100%" style="display:block;height:220px;object-fit:cover;" />
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
  <body style="margin:0;padding:0;background:#f0f4f8;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(content.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:20px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;">
            <tr>
              <td style="padding:14px 18px;background:#0c8adf;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#ffffff;">${escapeHtml(content.agencyName)}</td>
                    <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#cce9ff;">Travel newsletter</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <img src="${safeImage(content.hero.imageUrl)}" alt="${escapeHtml(content.hero.title)}" width="100%" style="display:block;height:260px;object-fit:cover;" />
              </td>
            </tr>
            <tr>
              <td style="padding:18px 20px 10px;font-family:Arial,Helvetica,sans-serif;">
                <h1 style="margin:0;font-size:42px;line-height:1.05;color:#0f3048;">${escapeHtml(content.hero.title)}</h1>
                <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#466880;">${escapeHtml(content.hero.subtitle)}</p>
                <a href="${safeUrl(content.hero.ctaUrl)}" style="display:inline-block;margin-top:14px;background:#1f7fce;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:6px;font-size:13px;font-weight:700;">${escapeHtml(content.hero.ctaLabel)}</a>
              </td>
            </tr>
            ${banner(content.banner1.title, content.banner1.subtitle, content.banner1.imageUrl, content.banner1.ctaUrl, content.banner1.ctaLabel)}
            ${section("Popular Destinations", content.destinations)}
            ${section("Popular Hotel By Traveler", content.hotels)}
            ${banner(content.banner2.title, content.banner2.subtitle, content.banner2.imageUrl, content.banner2.ctaUrl, content.banner2.ctaLabel)}
            ${section("Our Best Packages", content.packages)}
            <tr>
              <td style="padding:22px 16px 8px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#103049;text-align:center;">
                Happy Client Review
              </td>
            </tr>
            <tr>
              ${reviewColumns(content.reviews)}
            </tr>
            <tr>
              <td style="padding:18px;background:#072d43;color:#cde7f9;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;">
                <strong style="font-size:14px;color:#ffffff;">${escapeHtml(content.agencyName)}</strong><br />
                ${escapeHtml(content.footer.address)}<br />
                ${escapeHtml(content.footer.phone)} | ${escapeHtml(content.footer.email)}<br />
                <a href="${safeUrl(content.footer.website)}" style="color:#9fd2f5;text-decoration:none;">Website</a> |
                <a href="${safeUrl(content.footer.instagram)}" style="color:#9fd2f5;text-decoration:none;">Instagram</a> |
                <a href="${safeUrl(content.footer.unsubscribeUrl)}" style="color:#9fd2f5;text-decoration:none;">Unsubscribe</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const lineForCard = (label: string, card: SectionCard): string => {
  const parts = [card.title, card.subtitle, card.price].filter(Boolean).join(" | ");
  return `${label}: ${parts}`;
};

export const renderNewsletterText = (content: NewsletterContent): string => {
  const lines: string[] = [];

  lines.push(content.agencyName);
  lines.push(content.preheader);
  lines.push("");
  lines.push(content.hero.title);
  lines.push(content.hero.subtitle);
  lines.push(`CTA: ${content.hero.ctaLabel} - ${content.hero.ctaUrl}`);
  lines.push("");
  lines.push(`Banner 1: ${content.banner1.title} - ${content.banner1.ctaUrl}`);
  lines.push("");
  content.destinations.forEach((card, index) => lines.push(lineForCard(`Destination ${index + 1}`, card)));
  lines.push("");
  content.hotels.forEach((card, index) => lines.push(lineForCard(`Hotel ${index + 1}`, card)));
  lines.push("");
  lines.push(`Banner 2: ${content.banner2.title} - ${content.banner2.ctaUrl}`);
  lines.push("");
  content.packages.forEach((card, index) => lines.push(lineForCard(`Package ${index + 1}`, card)));
  lines.push("");
  content.reviews.forEach((review, index) => lines.push(`Review ${index + 1}: ${review.name} (${review.rating}) - ${review.text}`));
  lines.push("");
  lines.push(`Contato: ${content.footer.email} | ${content.footer.phone}`);
  lines.push(content.footer.address);
  lines.push(`Unsubscribe: ${content.footer.unsubscribeUrl}`);

  return lines.join("\n");
};
