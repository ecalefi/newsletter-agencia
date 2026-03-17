import { getNewsletterState } from "@/lib/data-store";
import { renderNewsletterHtml, renderNewsletterText } from "@/lib/newsletter-template";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getTourismNews } from "@/lib/tourism-news";
import { NextResponse } from "next/server";

interface PushBody {
  webhookUrl: string;
  subject?: string;
}

const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<PushBody>;
  const webhookUrl = body.webhookUrl?.trim() ?? "";

  if (!isValidHttpUrl(webhookUrl)) {
    return NextResponse.json({ error: "Webhook URL invalida" }, { status: 400 });
  }

  const newsletter = await getNewsletterState();
  const tourismNews = await getTourismNews();
  const html = renderNewsletterHtml(newsletter, tourismNews);
  const text = renderNewsletterText(newsletter, tourismNews);

  const supabase = getSupabaseAdmin();
  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("name,email,whatsapp,status")
    .eq("status", "active");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const payload = {
    source: "newsletter-admin",
    subject: body.subject?.trim() || `Ofertas da semana - ${newsletter.agencyName}`,
    preheader: newsletter.preheader,
    html,
    text,
    updatedAt: newsletter.updatedAt,
    contacts: (contacts ?? []).map((contact) => ({
      name: contact.name,
      email: contact.email,
      whatsapp: contact.whatsapp ?? "",
    })),
  };

  const webhookResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const webhookBody = await webhookResponse.text();

  return NextResponse.json({
    ok: webhookResponse.ok,
    status: webhookResponse.status,
    contactsSent: payload.contacts.length,
    webhookResponse: webhookBody.slice(0, 1000),
  });
}
