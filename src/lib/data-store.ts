import { NewsletterContent, ReviewCard, SectionCard } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const defaultSectionCard = (title: string): SectionCard => ({
  title,
  subtitle: "",
  description: "",
  price: "",
  imageUrl: "",
  ctaUrl: "https://example.com",
  ctaLabel: "Book now",
});

const defaultReviewCard = (name: string): ReviewCard => ({
  name,
  role: "Cliente",
  text: "Experiencia excelente com atendimento rapido e suporte total.",
  rating: "5/5",
  avatarUrl: "",
});

const defaultNewsletter = (): NewsletterContent => ({
  templateVersion: "v1",
  agencyName: "Horizonte Viagens",
  preheader: "Ofertas da semana com vagas limitadas.",
  logoUrl: "",
  hero: {
    title: "Get Ready For Your Journey",
    subtitle: "Pacotes com condicoes especiais para a sua proxima viagem.",
    imageUrl:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
    ctaLabel: "Book now",
    ctaUrl: "https://example.com/oferta",
  },
  banner1: {
    title: "Popular Hotel By Traveler",
    subtitle: "Selecao premium para reservas com alta procura.",
    imageUrl:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=80",
    ctaUrl: "https://example.com/banner-1",
    ctaLabel: "Book now",
  },
  banner2: {
    title: "Happy Client Review",
    subtitle: "Veja os relatos de quem ja viajou com a agencia.",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
    ctaUrl: "https://example.com/banner-2",
    ctaLabel: "See details",
  },
  destinations: Array.from({ length: 3 }, (_, i) => defaultSectionCard(`Destination ${i + 1}`)),
  hotels: Array.from({ length: 3 }, (_, i) => defaultSectionCard(`Hotel ${i + 1}`)),
  packages: Array.from({ length: 3 }, (_, i) => defaultSectionCard(`Package ${i + 1}`)),
  reviews: Array.from({ length: 3 }, (_, i) => defaultReviewCard(`Cliente ${i + 1}`)),
  footer: {
    email: "contato@horizonteviagens.com.br",
    phone: "+55 (11) 4000-1234",
    address: "Av. Paulista, 1000 - Sao Paulo/SP",
    website: "https://example.com",
    instagram: "https://instagram.com",
    unsubscribeUrl: "https://example.com/unsubscribe",
  },
  updatedAt: new Date().toISOString(),
});

const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const normalizeCards = (value: unknown, fallbackPrefix: string): SectionCard[] => {
  const source = Array.isArray(value) ? value : [];
  const cards = source.slice(0, 3).map((item, index) => {
    const raw = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
    return {
      title: asString(raw.title, `${fallbackPrefix} ${index + 1}`),
      subtitle: asString(raw.subtitle ?? raw.destination),
      description: asString(raw.description ?? raw.period),
      price: asString(raw.price),
      imageUrl: asString(raw.imageUrl),
      ctaUrl: asString(raw.ctaUrl, "https://example.com"),
      ctaLabel: asString(raw.ctaLabel, "Book now"),
    };
  });

  while (cards.length < 3) {
    cards.push(defaultSectionCard(`${fallbackPrefix} ${cards.length + 1}`));
  }

  return cards;
};

const normalizeReviews = (value: unknown): ReviewCard[] => {
  const source = Array.isArray(value) ? value : [];
  const reviews = source.slice(0, 3).map((item, index) => {
    const raw = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
    return {
      name: asString(raw.name, `Cliente ${index + 1}`),
      role: asString(raw.role, "Cliente"),
      text: asString(raw.text, "Experiencia excelente com atendimento rapido e suporte total."),
      rating: asString(raw.rating, "5/5"),
      avatarUrl: asString(raw.avatarUrl),
    };
  });

  while (reviews.length < 3) {
    reviews.push(defaultReviewCard(`Cliente ${reviews.length + 1}`));
  }

  return reviews;
};

const normalizeBanner = (value: unknown, titleFallback: string): NewsletterContent["banner1"] => {
  const raw = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
  return {
    title: asString(raw.title, titleFallback),
    subtitle: asString(raw.subtitle),
    imageUrl: asString(raw.imageUrl),
    ctaUrl: asString(raw.ctaUrl, "https://example.com"),
    ctaLabel: asString(raw.ctaLabel, "Book now"),
  };
};

const normalizeFooter = (value: unknown): NewsletterContent["footer"] => {
  const raw = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
  return {
    email: asString(raw.email, "contato@horizonteviagens.com.br"),
    phone: asString(raw.phone, "+55 (11) 4000-1234"),
    address: asString(raw.address, "Av. Paulista, 1000 - Sao Paulo/SP"),
    website: asString(raw.website, "https://example.com"),
    instagram: asString(raw.instagram, "https://instagram.com"),
    unsubscribeUrl: asString(raw.unsubscribeUrl, "https://example.com/unsubscribe"),
  };
};

const normalizeNewsletter = (value: unknown): NewsletterContent => {
  const defaults = defaultNewsletter();
  const raw = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

  const heroRaw = typeof raw.hero === "object" && raw.hero !== null ? (raw.hero as Record<string, unknown>) : {};
  const migratedBanner1 = raw.banner1 ?? raw.insurance;
  const migratedBanner2 = raw.banner2 ?? raw.carRental;

  return {
    templateVersion: "v1",
    agencyName: asString(raw.agencyName, defaults.agencyName),
    preheader: asString(raw.preheader, defaults.preheader),
    logoUrl: asString(raw.logoUrl, defaults.logoUrl),
    hero: {
      title: asString(heroRaw.title, defaults.hero.title),
      subtitle: asString(heroRaw.subtitle, defaults.hero.subtitle),
      imageUrl: asString(heroRaw.imageUrl, defaults.hero.imageUrl),
      ctaLabel: asString(heroRaw.ctaLabel, defaults.hero.ctaLabel),
      ctaUrl: asString(heroRaw.ctaUrl, defaults.hero.ctaUrl),
    },
    banner1: normalizeBanner(migratedBanner1, defaults.banner1.title),
    banner2: normalizeBanner(migratedBanner2, defaults.banner2.title),
    destinations: normalizeCards(raw.destinations ?? raw.nationalPackages, "Destination"),
    hotels: normalizeCards(raw.hotels ?? raw.internationalPackages, "Hotel"),
    packages: normalizeCards(raw.packages, "Package"),
    reviews: normalizeReviews(raw.reviews),
    footer: normalizeFooter(raw.footer),
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
  const payload = { ...value, updatedAt: new Date().toISOString() };
  const { error } = await supabase.from("app_state").upsert({ key: "newsletter", value: payload }, { onConflict: "key" });

  if (error) {
    throw new Error(error.message);
  }

  return payload;
};
