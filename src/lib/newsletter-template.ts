import { NewsletterContent, ReviewCard, SectionCard } from "@/lib/types";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const fallbackImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

const safeImage = (value: string): string => (value.trim() ? escapeHtml(value) : fallbackImage);
const safeUrl = (value: string): string => (value.trim() ? escapeHtml(value) : "https://example.com");

const renderDestinations = (cards: SectionCard[]): string => `
  <tr>
    <td style="padding:16px 16px 8px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;color:#122f46;">
      Popular Destinations
    </td>
  </tr>
  <tr>
    <td style="padding:0 8px 14px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${cards
            .slice(0, 3)
            .map(
              (card) => `
              <td width="33.33%" valign="top" style="padding:8px;">
                <img src="${safeImage(card.imageUrl)}" alt="${escapeHtml(card.title)}" width="100%" style="display:block;height:130px;object-fit:cover;border-radius:4px;" />
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#0f2f47;margin-top:8px;">${escapeHtml(card.title)}</div>
                <a href="${safeUrl(card.ctaUrl)}" style="display:inline-block;margin-top:6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#1f7fce;text-decoration:none;">${escapeHtml(card.ctaLabel || "Read more")}</a>
              </td>
            `,
            )
            .join("\n")}
        </tr>
      </table>
    </td>
  </tr>
`;

const renderHotels = (cards: SectionCard[]): string => `
  <tr>
    <td style="padding:16px 16px 8px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:30px;font-weight:700;color:#122f46;">
      Popular Hotel By Traveler
    </td>
  </tr>
  <tr>
    <td style="padding:0 8px 14px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${cards
            .slice(0, 3)
            .map(
              (card) => `
              <td width="33.33%" valign="top" style="padding:8px;">
                <img src="${safeImage(card.imageUrl)}" alt="${escapeHtml(card.title)}" width="100%" style="display:block;height:120px;object-fit:cover;" />
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#102f45;margin-top:8px;">${escapeHtml(card.title)}</div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#3e6684;margin-top:4px;">${escapeHtml(card.subtitle)}</div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#4f6f88;line-height:1.5;margin-top:6px;">${escapeHtml(card.description)}</div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#0e84d4;margin-top:8px;">${escapeHtml(card.price)}</div>
                <a href="${safeUrl(card.ctaUrl)}" style="display:inline-block;margin-top:6px;background:#1f7fce;color:#ffffff;text-decoration:none;padding:6px 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;">${escapeHtml(card.ctaLabel || "Book now")}</a>
              </td>
            `,
            )
            .join("\n")}
        </tr>
      </table>
    </td>
  </tr>
`;

const renderPackages = (cards: SectionCard[]): string => `
  <tr>
    <td style="padding:16px 16px 8px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:32px;font-weight:700;color:#122f46;">
      Our Best Packages
    </td>
  </tr>
  <tr>
    <td style="padding:0 8px 14px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${cards
            .slice(0, 3)
            .map(
              (card) => `
              <td width="33.33%" valign="top" style="padding:8px;">
                <img src="${safeImage(card.imageUrl)}" alt="${escapeHtml(card.title)}" width="100%" style="display:block;height:150px;object-fit:cover;" />
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#102f45;margin-top:8px;">${escapeHtml(card.title)}</div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#3e6684;margin-top:4px;">${escapeHtml(card.subtitle)}</div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#4f6f88;line-height:1.5;margin-top:6px;">${escapeHtml(card.description)}</div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#0e84d4;margin-top:8px;">${escapeHtml(card.price)}</div>
                <a href="${safeUrl(card.ctaUrl)}" style="display:inline-block;margin-top:6px;background:#1f7fce;color:#ffffff;text-decoration:none;padding:6px 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;">${escapeHtml(card.ctaLabel || "Book now")}</a>
              </td>
            `,
            )
            .join("\n")}
        </tr>
      </table>
    </td>
  </tr>
`;

const renderReviews = (reviews: ReviewCard[]): string => `
  <tr>
    <td style="padding:16px 16px 8px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:30px;font-weight:700;color:#122f46;">
      Happy Client Review
    </td>
  </tr>
  <tr>
    <td style="padding:0 10px 18px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#002733;">
        <tr>
          ${reviews
            .slice(0, 3)
            .map(
              (review) => `
              <td width="33.33%" valign="top" style="padding:14px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="42" valign="top"><img src="${safeImage(review.avatarUrl)}" alt="${escapeHtml(review.name)}" width="36" height="36" style="display:block;border-radius:50%;object-fit:cover;" /></td>
                    <td valign="top">
                      <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#ffffff;">${escapeHtml(review.name)}</div>
                      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8fc6e5;">${escapeHtml(review.role)}</div>
                      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#ffdb7d;">${escapeHtml(review.rating)}</div>
                    </td>
                  </tr>
                </table>
                <div style="margin-top:8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:#d3e8f4;">
                  ${escapeHtml(review.text)}
                </div>
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
  <body style="margin:0;padding:0;background:#d9e0e6;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(content.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#d9e0e6;padding:20px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;">
            <tr>
              <td style="background:#1594e5;padding:12px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#ffffff;">
                      ${escapeHtml(content.agencyName)}
                    </td>
                    <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#d9efff;">
                      in · ig · fb · yt
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="52%" valign="top" style="background:#1594e5;padding:18px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
                      <div style="font-size:52px;line-height:0.95;font-weight:700;">${escapeHtml(content.hero.title)}</div>
                      <div style="margin-top:12px;font-size:14px;line-height:1.5;color:#d6eeff;">${escapeHtml(content.hero.subtitle)}</div>
                      <a href="${safeUrl(content.hero.ctaUrl)}" style="display:inline-block;margin-top:12px;background:#ffffff;color:#1594e5;text-decoration:none;padding:8px 12px;font-size:12px;font-weight:700;">${escapeHtml(content.hero.ctaLabel)}</a>
                    </td>
                    <td width="48%">
                      <img src="${safeImage(content.hero.imageUrl)}" alt="${escapeHtml(content.hero.title)}" width="100%" style="display:block;height:300px;object-fit:cover;" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:10px 16px;background:#f3f7fb;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #d8e3ee;background:#ffffff;">
                  <tr>
                    <td style="padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#4c6b82;">🔎 Search or type your place</td>
                    <td style="padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#4c6b82;">📅 Anytime</td>
                    <td style="padding:8px 10px;"><a href="${safeUrl(content.banner1.ctaUrl)}" style="display:inline-block;background:#1f7fce;color:#ffffff;text-decoration:none;padding:6px 12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;">Search</a></td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 16px 8px;text-align:center;font-family:Arial,Helvetica,sans-serif;">
                <div style="font-size:30px;font-weight:700;color:#122f46;">About Travel Agency</div>
                <div style="margin-top:8px;font-size:12px;line-height:1.6;color:#4d6d84;">${escapeHtml(content.banner1.subtitle)}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 16px 12px;"><img src="${safeImage(content.banner1.imageUrl)}" alt="${escapeHtml(content.banner1.title)}" width="100%" style="display:block;height:180px;object-fit:cover;" /></td>
            </tr>

            ${renderDestinations(content.destinations)}

            <tr>
              <td style="padding:0 10px 10px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#00313f;">
                  <tr>
                    <td width="33.33%" style="padding:12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#d5e9f5;">${escapeHtml(content.banner2.title)}</td>
                    <td width="33.33%" style="padding:12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#d5e9f5;">${escapeHtml(content.banner2.subtitle)}</td>
                    <td width="33.33%" style="padding:12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#d5e9f5;">${escapeHtml(content.banner2.ctaLabel)}</td>
                  </tr>
                </table>
              </td>
            </tr>

            ${renderHotels(content.hotels)}

            <tr>
              <td style="padding:0 10px 10px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1294e5;">
                  <tr>
                    <td width="33.33%" style="padding:14px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#ffffff;">🍸 ${escapeHtml(content.banner2.title)}</td>
                    <td width="33.33%" style="padding:14px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#ffffff;">🎵 ${escapeHtml(content.banner2.subtitle)}</td>
                    <td width="33.33%" style="padding:14px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#ffffff;">🛒 ${escapeHtml(content.banner2.ctaLabel)}</td>
                  </tr>
                </table>
              </td>
            </tr>

            ${renderPackages(content.packages)}

            ${renderReviews(content.reviews)}

            <tr>
              <td style="padding:16px;background:#072d43;color:#d0e6f4;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;">
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
  lines.push(`Banner 1: ${content.banner1.title} - ${content.banner1.ctaUrl}`);
  lines.push("");
  content.destinations.forEach((card, index) => lines.push(lineForCard(`Destination ${index + 1}`, card)));
  lines.push("");
  content.hotels.forEach((card, index) => lines.push(lineForCard(`Hotel ${index + 1}`, card)));
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
