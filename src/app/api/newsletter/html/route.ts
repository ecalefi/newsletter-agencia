import { getNewsletterState } from "@/lib/data-store";
import { renderNewsletterHtml } from "@/lib/newsletter-template";
import { getTourismNews } from "@/lib/tourism-news";

export async function GET() {
  const newsletter = await getNewsletterState();
  const tourismNews = await getTourismNews();
  const html = renderNewsletterHtml(newsletter, tourismNews);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
