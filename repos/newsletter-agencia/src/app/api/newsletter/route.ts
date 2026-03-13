import { getNewsletterState, saveNewsletterState } from "@/lib/data-store";
import { NewsletterContent } from "@/lib/types";
import { NextResponse } from "next/server";

const validateNewsletter = (data: NewsletterContent): string | null => {
  if (data.destinations.length !== 3) {
    return "A secao de destinos deve conter 3 cards";
  }

  if (data.hotels.length !== 3) {
    return "A secao de hoteis deve conter 3 cards";
  }

  if (data.packages.length !== 3) {
    return "A secao de pacotes deve conter 3 cards";
  }

  if (data.reviews.length !== 3) {
    return "A secao de reviews deve conter 3 cards";
  }

  if (!data.hero.title.trim() || !data.hero.imageUrl.trim()) {
    return "Preencha titulo e imagem do hero";
  }

  return null;
};

export async function GET() {
  const newsletter = await getNewsletterState();
  return NextResponse.json(newsletter);
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as NewsletterContent;
  payload.templateVersion = "v1";
  payload.updatedAt = new Date().toISOString();
  const error = validateNewsletter(payload);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const saved = await saveNewsletterState(payload);
  return NextResponse.json(saved);
}
