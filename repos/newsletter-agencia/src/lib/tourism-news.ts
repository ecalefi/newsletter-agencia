import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { TourismNewsItem } from "@/lib/types";

const CACHE_KEY = "tourism_news_cache";
const DEFAULT_LIMIT = 3;
const MAX_LIMIT = 5;

interface TourismNewsCache {
  fetchedAt: string;
  items: TourismNewsItem[];
}

const asString = (value: unknown, fallback = ""): string => (typeof value === "string" ? value : fallback);

const clampLimit = (value: number): number => {
  if (Number.isNaN(value) || value <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(MAX_LIMIT, Math.max(1, value));
};

const normalizeItem = (item: unknown): TourismNewsItem | null => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const sourceObject = (item as Record<string, unknown>).source;
  const sourceName =
    sourceObject && typeof sourceObject === "object" && typeof (sourceObject as Record<string, unknown>).name === "string"
      ? ((sourceObject as Record<string, unknown>).name as string)
      : "Mercado de turismo";

  const raw = item as Record<string, unknown>;
  const title = asString(raw.title);
  const url = asString(raw.url);
  const publishedAt = asString(raw.publishedAt, new Date().toISOString());

  if (!title.trim() || !url.trim()) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
  } catch {
    return null;
  }

  return {
    title: title.trim(),
    url: url.trim(),
    source: sourceName.trim() || "Mercado de turismo",
    publishedAt,
  };
};

const readCachedNews = async (): Promise<TourismNewsItem[]> => {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from("app_state").select("value").eq("key", CACHE_KEY).maybeSingle();
    const value = data?.value as TourismNewsCache | null | undefined;
    if (!value || !Array.isArray(value.items)) {
      return [];
    }

    return value.items.map(normalizeItem).filter((item): item is TourismNewsItem => item !== null);
  } catch {
    return [];
  }
};

const writeCachedNews = async (items: TourismNewsItem[]): Promise<void> => {
  try {
    const supabase = getSupabaseAdmin();
    const payload: TourismNewsCache = {
      fetchedAt: new Date().toISOString(),
      items,
    };

    await supabase.from("app_state").upsert({ key: CACHE_KEY, value: payload }, { onConflict: "key" });
  } catch {
    // noop
  }
};

const fetchFromGNews = async (): Promise<TourismNewsItem[]> => {
  const apiKey = process.env.GNEWS_API_KEY?.trim();
  if (!apiKey) {
    return [];
  }

  const limit = clampLimit(Number(process.env.TOURISM_NEWS_LIMIT ?? DEFAULT_LIMIT));
  const query = process.env.TOURISM_NEWS_QUERY?.trim() || '"mercado de turismo" OR turismo OR hotelaria OR aviacao';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    const params = new URLSearchParams({
      q: query,
      lang: "pt",
      country: "br",
      max: String(limit),
      sortby: "publishedAt",
      in: "title,description",
      token: apiKey,
    });

    const response = await fetch(`https://gnews.io/api/v4/search?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as { articles?: unknown[] };
    const items = (payload.articles ?? []).map(normalizeItem).filter((item): item is TourismNewsItem => item !== null);
    return items.slice(0, limit);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
};

export const getTourismNews = async (): Promise<TourismNewsItem[]> => {
  if (process.env.NEWS_TOURISM_ENABLED === "false") {
    return [];
  }

  const fresh = await fetchFromGNews();
  if (fresh.length > 0) {
    await writeCachedNews(fresh);
    return fresh;
  }

  const cached = await readCachedNews();
  return cached.slice(0, clampLimit(Number(process.env.TOURISM_NEWS_LIMIT ?? DEFAULT_LIMIT)));
};
