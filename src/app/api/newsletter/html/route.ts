import { getNewsletterState } from "@/lib/data-store";
import { renderNewsletterHtml } from "@/lib/newsletter-template";

export async function GET() {
  const newsletter = await getNewsletterState();
  const html = renderNewsletterHtml(newsletter);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
