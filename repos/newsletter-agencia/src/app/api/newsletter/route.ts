import { getNewsletterState, saveNewsletterState } from "@/lib/data-store";
import { NewsletterContent } from "@/lib/types";
import { NextResponse } from "next/server";

const validateNewsletter = (data: NewsletterContent): string | null => {
  if (data.nationalPackages.length !== 3) {
    return "A secao de pacotes nacionais deve conter 3 imagens";
  }

  if (data.internationalPackages.length !== 3) {
    return "A secao de pacotes internacionais deve conter 3 imagens";
  }

  if (!data.agencyName.trim()) {
    return "Informe o nome da agencia";
  }

  if (!data.preheader.trim()) {
    return "Informe o preheader";
  }

  if (!data.logoUrl?.trim()) {
    return "Preencha a logo da newsletter";
  }

  if (!data.highlightBanner?.imageUrl?.trim()) {
    return "Preencha a imagem do banner principal";
  }

  if (!data.highlightBanner?.title?.trim()) {
    return "Preencha o titulo do banner principal";
  }

  if (!data.highlightBanner?.description?.trim()) {
    return "Preencha a descricao do banner principal";
  }

  const missingNational = data.nationalPackages.some((item) => !item.imageUrl.trim());
  if (missingNational) {
    return "Preencha todas as 3 imagens de pacotes nacionais";
  }

  const missingNationalCaption = data.nationalPackages.some((item) => !item.caption.trim());
  if (missingNationalCaption) {
    return "Preencha os textos dos 3 pacotes nacionais";
  }

  const missingInternational = data.internationalPackages.some((item) => !item.imageUrl.trim());
  if (missingInternational) {
    return "Preencha todas as 3 imagens de pacotes internacionais";
  }

  const missingInternationalCaption = data.internationalPackages.some((item) => !item.caption.trim());
  if (missingInternationalCaption) {
    return "Preencha os textos dos 3 pacotes internacionais";
  }

  return null;
};

export async function GET() {
  const newsletter = await getNewsletterState();
  return NextResponse.json(newsletter);
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as NewsletterContent;
  payload.templateVersion = "v2";
  payload.updatedAt = new Date().toISOString();
  const error = validateNewsletter(payload);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const saved = await saveNewsletterState(payload);
  return NextResponse.json(saved);
}
