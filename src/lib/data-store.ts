import { NewsletterContent, PackageImage } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const defaultImage = (imageUrl: string, caption: string): PackageImage => ({ imageUrl, caption });

const defaultNewsletter = (): NewsletterContent => ({
  templateVersion: "v2",
  agencyName: "Horizonte Viagens",
  preheader: "Pacotes nacionais e internacionais da semana.",
  nationalPackages: [
    defaultImage(
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
      "Serra com cafe da manha incluso e passeio guiado.",
    ),
    defaultImage(
      "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1200&q=80",
      "Fim de semana na praia com traslado e hotel 4 estrelas.",
    ),
    defaultImage(
      "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=1200&q=80",
      "Roteiro cultural com city tour e ingressos principais.",
    ),
  ],
  internationalPackages: [
    defaultImage(
      "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1200&q=80",
      "Europa classica com saida garantida e seguro viagem.",
    ),
    defaultImage(
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
      "Caribe all-inclusive com parcelamento em ate 12x.",
    ),
    defaultImage(
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
      "America do Sul premium com roteiros flexiveis.",
    ),
  ],
  updatedAt: new Date().toISOString(),
});

const asString = (value: unknown, fallback = ""): string => (typeof value === "string" ? value : fallback);

const normalizeImageArray = (value: unknown, fallback: PackageImage[]): PackageImage[] => {
  const source = Array.isArray(value) ? value : [];
  const images = source
    .slice(0, 3)
    .map((item, index) => {
      if (typeof item === "string") {
        return defaultImage(item, fallback[index]?.caption ?? "");
      }

      const raw = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
      const imageUrl = asString(raw.imageUrl, fallback[index]?.imageUrl ?? "");
      const caption = asString(
        raw.caption ?? raw.title ?? raw.subtitle ?? raw.description,
        fallback[index]?.caption ?? "",
      );
      return defaultImage(imageUrl, caption);
    })
    .filter((item) => item.imageUrl.trim().length > 0);

  while (images.length < 3) {
    images.push(fallback[images.length]);
  }

  return images;
};

const normalizeNewsletter = (value: unknown): NewsletterContent => {
  const defaults = defaultNewsletter();
  const raw = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

  const legacyNational = raw.nationalPackages ?? raw.destinations ?? raw.packages;
  const legacyInternational = raw.internationalPackages ?? raw.hotels;

  return {
    templateVersion: "v2",
    agencyName: asString(raw.agencyName, defaults.agencyName),
    preheader: asString(raw.preheader, defaults.preheader),
    nationalPackages: normalizeImageArray(legacyNational, defaults.nationalPackages),
    internationalPackages: normalizeImageArray(legacyInternational, defaults.internationalPackages),
    updatedAt: asString(raw.updatedAt, defaults.updatedAt),
  };
};

export const getNewsletterState = async (): Promise<NewsletterContent> => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("app_state").select("value").eq("key", "newsletter").maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.value) {
    const seed = defaultNewsletter();
    await saveNewsletterState(seed);
    return seed;
  }

  return normalizeNewsletter(data.value);
};

export const saveNewsletterState = async (value: NewsletterContent): Promise<NewsletterContent> => {
  const supabase = getSupabaseAdmin();
  const payload = {
    ...value,
    templateVersion: "v2" as const,
    updatedAt: new Date().toISOString(),
    nationalPackages: normalizeImageArray(value.nationalPackages, defaultNewsletter().nationalPackages),
    internationalPackages: normalizeImageArray(value.internationalPackages, defaultNewsletter().internationalPackages),
  };

  const { error } = await supabase.from("app_state").upsert({ key: "newsletter", value: payload }, { onConflict: "key" });

  if (error) {
    throw new Error(error.message);
  }

  return payload;
};
