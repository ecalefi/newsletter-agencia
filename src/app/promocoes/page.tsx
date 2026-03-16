"use client";

import { FormEvent, useEffect, useState } from "react";
import { BannerBlock, NewsletterContent, ReviewCard, SectionCard } from "@/lib/types";

interface ImageSlot {
  id: string;
  label: string;
  read: (value: NewsletterContent) => string;
}

const IMAGE_SLOTS: ImageSlot[] = [
  { id: "logo", label: "Logo", read: (value) => value.logoUrl },
  { id: "hero", label: "Hero", read: (value) => value.hero.imageUrl },
  { id: "banner1", label: "Banner 1", read: (value) => value.banner1.imageUrl },
  { id: "banner2", label: "Banner 2", read: (value) => value.banner2.imageUrl },
  { id: "destination-0", label: "Destination Card 1", read: (value) => value.destinations[0]?.imageUrl ?? "" },
  { id: "destination-1", label: "Destination Card 2", read: (value) => value.destinations[1]?.imageUrl ?? "" },
  { id: "destination-2", label: "Destination Card 3", read: (value) => value.destinations[2]?.imageUrl ?? "" },
  { id: "hotel-0", label: "Hotel Card 1", read: (value) => value.hotels[0]?.imageUrl ?? "" },
  { id: "hotel-1", label: "Hotel Card 2", read: (value) => value.hotels[1]?.imageUrl ?? "" },
  { id: "hotel-2", label: "Hotel Card 3", read: (value) => value.hotels[2]?.imageUrl ?? "" },
  { id: "package-0", label: "Package Card 1", read: (value) => value.packages[0]?.imageUrl ?? "" },
  { id: "package-1", label: "Package Card 2", read: (value) => value.packages[1]?.imageUrl ?? "" },
  { id: "package-2", label: "Package Card 3", read: (value) => value.packages[2]?.imageUrl ?? "" },
  { id: "review-0", label: "Review Avatar 1", read: (value) => value.reviews[0]?.avatarUrl ?? "" },
  { id: "review-1", label: "Review Avatar 2", read: (value) => value.reviews[1]?.avatarUrl ?? "" },
  { id: "review-2", label: "Review Avatar 3", read: (value) => value.reviews[2]?.avatarUrl ?? "" },
];

const applyImageSlot = (value: NewsletterContent, slotId: string, imageUrl: string): NewsletterContent => {
  switch (slotId) {
    case "logo":
      return { ...value, logoUrl: imageUrl };
    case "hero":
      return { ...value, hero: { ...value.hero, imageUrl } };
    case "banner1":
      return { ...value, banner1: { ...value.banner1, imageUrl } };
    case "banner2":
      return { ...value, banner2: { ...value.banner2, imageUrl } };
    case "destination-0":
    case "destination-1":
    case "destination-2": {
      const index = Number(slotId.split("-")[1]);
      const next = [...value.destinations];
      next[index] = { ...next[index], imageUrl };
      return { ...value, destinations: next };
    }
    case "hotel-0":
    case "hotel-1":
    case "hotel-2": {
      const index = Number(slotId.split("-")[1]);
      const next = [...value.hotels];
      next[index] = { ...next[index], imageUrl };
      return { ...value, hotels: next };
    }
    case "package-0":
    case "package-1":
    case "package-2": {
      const index = Number(slotId.split("-")[1]);
      const next = [...value.packages];
      next[index] = { ...next[index], imageUrl };
      return { ...value, packages: next };
    }
    case "review-0":
    case "review-1":
    case "review-2": {
      const index = Number(slotId.split("-")[1]);
      const next = [...value.reviews];
      next[index] = { ...next[index], avatarUrl: imageUrl };
      return { ...value, reviews: next };
    }
    default:
      return value;
  }
};

const sectionCardTemplate = (): SectionCard => ({
  title: "",
  subtitle: "",
  description: "",
  price: "",
  imageUrl: "",
  ctaUrl: "",
  ctaLabel: "Book now",
});

const reviewTemplate = (): ReviewCard => ({
  name: "",
  role: "",
  text: "",
  rating: "5/5",
  avatarUrl: "",
});

const bannerTemplate = (): BannerBlock => ({
  title: "",
  subtitle: "",
  imageUrl: "",
  ctaUrl: "",
  ctaLabel: "Book now",
});

const defaultState: NewsletterContent = {
  templateVersion: "v1",
  agencyName: "",
  preheader: "",
  logoUrl: "",
  hero: { title: "", subtitle: "", imageUrl: "", ctaLabel: "Book now", ctaUrl: "" },
  banner1: bannerTemplate(),
  banner2: bannerTemplate(),
  destinations: Array.from({ length: 3 }, sectionCardTemplate),
  hotels: Array.from({ length: 3 }, sectionCardTemplate),
  packages: Array.from({ length: 3 }, sectionCardTemplate),
  reviews: Array.from({ length: 3 }, reviewTemplate),
  footer: {
    email: "",
    phone: "",
    address: "",
    website: "",
    instagram: "",
    unsubscribeUrl: "",
  },
  updatedAt: "",
};

export default function PromocoesPage() {
  const [newsletter, setNewsletter] = useState<NewsletterContent>(defaultState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<Record<string, File>>({});

  useEffect(() => {
    const run = async () => {
      const response = await fetch("/api/newsletter");
      const data = (await response.json()) as NewsletterContent;
      setNewsletter(data);
    };

    void run();
  }, []);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsletter),
      });

      const payload = (await response.json()) as NewsletterContent & { error?: string };

      if (!response.ok) {
        setMessage(payload.error ?? "Falha ao salvar promocoes");
        return;
      }

      setNewsletter(payload);
      setMessage("Modelo atualizado com sucesso.");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/assets/upload", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !payload.url) {
      throw new Error(payload.error ?? "Falha no upload");
    }

    return payload.url;
  };

  const updateSectionCard = (
    section: "destinations" | "hotels" | "packages",
    index: number,
    field: keyof SectionCard,
    value: string,
  ) => {
    setNewsletter((prev) => {
      const clone = [...prev[section]];
      clone[index] = { ...clone[index], [field]: value };
      return { ...prev, [section]: clone };
    });
  };

  const updateReview = (index: number, field: keyof ReviewCard, value: string) => {
    setNewsletter((prev) => {
      const clone = [...prev.reviews];
      clone[index] = { ...clone[index], [field]: value };
      return { ...prev, reviews: clone };
    });
  };

  const setBulkSlotFile = (slotId: string, file: File | null) => {
    setBulkFiles((prev) => {
      const next = { ...prev };
      if (file) {
        next[slotId] = file;
      } else {
        delete next[slotId];
      }
      return next;
    });
  };

  const onMappedBulkUpload = async () => {
    const selectedEntries = Object.entries(bulkFiles);
    if (!selectedEntries.length) {
      setMessage("Selecione ao menos uma imagem para o upload em lote.");
      return;
    }

    setBulkUploading(true);
    setMessage("");

    try {
      const uploaded = await Promise.all(
        selectedEntries.map(async ([slotId, file]) => ({ slotId, url: await uploadImage(file) })),
      );

      setNewsletter((prev) =>
        uploaded.reduce((acc, item) => applyImageSlot(acc, item.slotId, item.url), prev),
      );

      setBulkFiles({});
      setMessage(`Upload concluido. ${uploaded.length} slot(s) atualizado(s).`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha no upload em lote");
    } finally {
      setBulkUploading(false);
    }
  };

  const selectedBulkCount = Object.keys(bulkFiles).length;

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="font-title text-2xl">Gerador do template</h2>
        <p className="mt-2 text-[var(--color-muted)]">
          Modelo fixo com 2 banners full-width e 3 cards por secao. Edite os dados e envie pelo painel.
        </p>
      </section>

      <form className="space-y-6" onSubmit={save}>
        <section className="card p-6">
          <h3 className="font-title text-xl">Upload em lote mapeado</h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Cada arquivo e vinculado ao slot correto antes do envio. Sem dependencia de ordem de selecao.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {IMAGE_SLOTS.map((slot) => (
              <label key={slot.id} className="rounded-lg border border-[var(--color-border)] p-3 text-sm font-semibold text-[var(--color-ink)]">
                {slot.label}
                <input
                  className="mt-2 block w-full text-xs"
                  type="file"
                  accept="image/*"
                  disabled={bulkUploading}
                  onChange={(event) => setBulkSlotFile(slot.id, event.target.files?.[0] ?? null)}
                />
                {bulkFiles[slot.id] ? (
                  <p className="mt-1 text-xs font-normal text-[var(--color-primary)]">Selecionado: {bulkFiles[slot.id].name}</p>
                ) : null}
                {slot.read(newsletter) ? (
                  <p className="mt-1 break-all text-xs font-normal text-[var(--color-muted)]">Atual: {slot.read(newsletter)}</p>
                ) : null}
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              className="btn bg-[var(--color-primary)] px-4 py-2 text-white"
              type="button"
              disabled={bulkUploading || !selectedBulkCount}
              onClick={() => void onMappedBulkUpload()}
            >
              Aplicar upload em lote
            </button>
            <span className="text-sm text-[var(--color-muted)]">{selectedBulkCount} slot(s) selecionado(s)</span>
          </div>
          {bulkUploading ? <p className="mt-2 text-sm font-semibold text-[var(--color-primary)]">Enviando imagens mapeadas...</p> : null}
        </section>

        <section className="card grid gap-4 p-6 md:grid-cols-2">
          <LabeledInput
            label="Nome da agencia"
            value={newsletter.agencyName}
            onChange={(value) => setNewsletter({ ...newsletter, agencyName: value })}
          />
          <LabeledInput
            label="Preheader"
            value={newsletter.preheader}
            onChange={(value) => setNewsletter({ ...newsletter, preheader: value })}
          />
          <ImageField
            label="Logo URL"
            value={newsletter.logoUrl}
            onChange={(value) => setNewsletter({ ...newsletter, logoUrl: value })}
            onUpload={uploadImage}
          />
        </section>

        <section className="card grid gap-4 p-6 md:grid-cols-2">
          <h3 className="font-title text-xl md:col-span-2">Hero</h3>
          <LabeledInput
            label="Titulo"
            value={newsletter.hero.title}
            onChange={(value) => setNewsletter({ ...newsletter, hero: { ...newsletter.hero, title: value } })}
          />
          <LabeledInput
            label="Subtitulo"
            value={newsletter.hero.subtitle}
            onChange={(value) => setNewsletter({ ...newsletter, hero: { ...newsletter.hero, subtitle: value } })}
          />
          <ImageField
            label="Imagem"
            value={newsletter.hero.imageUrl}
            onChange={(value) => setNewsletter({ ...newsletter, hero: { ...newsletter.hero, imageUrl: value } })}
            onUpload={uploadImage}
          />
          <LabeledInput
            label="CTA Label"
            value={newsletter.hero.ctaLabel}
            onChange={(value) => setNewsletter({ ...newsletter, hero: { ...newsletter.hero, ctaLabel: value } })}
          />
          <LabeledInput
            label="CTA URL"
            value={newsletter.hero.ctaUrl}
            onChange={(value) => setNewsletter({ ...newsletter, hero: { ...newsletter.hero, ctaUrl: value } })}
          />
        </section>

        <BannerSection
          title="Banner 1"
          value={newsletter.banner1}
          onChange={(next) => setNewsletter({ ...newsletter, banner1: next })}
          onUpload={uploadImage}
        />

        <CardSection
          title="Destinations (3 cards)"
          cards={newsletter.destinations}
          onChange={(index, field, value) => updateSectionCard("destinations", index, field, value)}
          onUpload={uploadImage}
        />

        <CardSection
          title="Hotels (3 cards)"
          cards={newsletter.hotels}
          onChange={(index, field, value) => updateSectionCard("hotels", index, field, value)}
          onUpload={uploadImage}
        />

        <BannerSection
          title="Banner 2"
          value={newsletter.banner2}
          onChange={(next) => setNewsletter({ ...newsletter, banner2: next })}
          onUpload={uploadImage}
        />

        <CardSection
          title="Packages (3 cards)"
          cards={newsletter.packages}
          onChange={(index, field, value) => updateSectionCard("packages", index, field, value)}
          onUpload={uploadImage}
        />

        <section className="card p-6">
          <h3 className="font-title text-xl">Reviews (3 cards)</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {newsletter.reviews.map((review, index) => (
              <article key={`review-${index}`} className="rounded-xl border border-[var(--color-border)] p-4">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">Review {index + 1}</h4>
                <div className="grid gap-3">
                  <LabeledInput label="Nome" value={review.name} onChange={(value) => updateReview(index, "name", value)} />
                  <LabeledInput label="Cargo" value={review.role} onChange={(value) => updateReview(index, "role", value)} />
                  <LabeledInput label="Rating" value={review.rating} onChange={(value) => updateReview(index, "rating", value)} />
                  <LabeledInput label="Texto" value={review.text} onChange={(value) => updateReview(index, "text", value)} />
                  <ImageField
                    label="Avatar"
                    value={review.avatarUrl}
                    onChange={(value) => updateReview(index, "avatarUrl", value)}
                    onUpload={uploadImage}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card grid gap-4 p-6 md:grid-cols-2">
          <h3 className="font-title text-xl md:col-span-2">Rodape</h3>
          <LabeledInput
            label="Email"
            value={newsletter.footer.email}
            onChange={(value) => setNewsletter({ ...newsletter, footer: { ...newsletter.footer, email: value } })}
          />
          <LabeledInput
            label="Telefone"
            value={newsletter.footer.phone}
            onChange={(value) => setNewsletter({ ...newsletter, footer: { ...newsletter.footer, phone: value } })}
          />
          <LabeledInput
            label="Endereco"
            value={newsletter.footer.address}
            onChange={(value) => setNewsletter({ ...newsletter, footer: { ...newsletter.footer, address: value } })}
          />
          <LabeledInput
            label="Website"
            value={newsletter.footer.website}
            onChange={(value) => setNewsletter({ ...newsletter, footer: { ...newsletter.footer, website: value } })}
          />
          <LabeledInput
            label="Instagram"
            value={newsletter.footer.instagram}
            onChange={(value) => setNewsletter({ ...newsletter, footer: { ...newsletter.footer, instagram: value } })}
          />
          <LabeledInput
            label="Unsubscribe URL"
            value={newsletter.footer.unsubscribeUrl}
            onChange={(value) => setNewsletter({ ...newsletter, footer: { ...newsletter.footer, unsubscribeUrl: value } })}
          />
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button className="btn bg-[var(--color-primary)] px-5 py-2 text-white" disabled={loading} type="submit">
            Salvar modelo
          </button>
          <a className="btn border border-[var(--color-border)] bg-white px-5 py-2" href="/preview">
            Abrir preview
          </a>
          {message ? <span className="text-sm font-semibold text-[var(--color-primary)]">{message}</span> : null}
        </div>
      </form>
    </div>
  );
}

function BannerSection({
  title,
  value,
  onChange,
  onUpload,
}: {
  title: string;
  value: BannerBlock;
  onChange: (value: BannerBlock) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  return (
    <section className="card grid gap-4 p-6 md:grid-cols-2">
      <h3 className="font-title text-xl md:col-span-2">{title}</h3>
      <LabeledInput label="Titulo" value={value.title} onChange={(next) => onChange({ ...value, title: next })} />
      <LabeledInput label="Subtitulo" value={value.subtitle} onChange={(next) => onChange({ ...value, subtitle: next })} />
      <ImageField label="Imagem" value={value.imageUrl} onChange={(next) => onChange({ ...value, imageUrl: next })} onUpload={onUpload} />
      <LabeledInput label="CTA Label" value={value.ctaLabel} onChange={(next) => onChange({ ...value, ctaLabel: next })} />
      <LabeledInput label="CTA URL" value={value.ctaUrl} onChange={(next) => onChange({ ...value, ctaUrl: next })} />
    </section>
  );
}

function CardSection({
  title,
  cards,
  onChange,
  onUpload,
}: {
  title: string;
  cards: SectionCard[];
  onChange: (index: number, field: keyof SectionCard, value: string) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  return (
    <section className="card p-6">
      <h3 className="font-title text-xl">{title}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {cards.map((card, index) => (
          <article key={`${title}-${index}`} className="rounded-xl border border-[var(--color-border)] p-4">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">Card {index + 1}</h4>
            <div className="grid gap-3">
              <LabeledInput label="Titulo" value={card.title} onChange={(value) => onChange(index, "title", value)} />
              <LabeledInput label="Subtitulo" value={card.subtitle} onChange={(value) => onChange(index, "subtitle", value)} />
              <LabeledInput
                label="Descricao"
                value={card.description}
                onChange={(value) => onChange(index, "description", value)}
              />
              <LabeledInput label="Preco" value={card.price} onChange={(value) => onChange(index, "price", value)} />
              <ImageField
                label="Imagem"
                value={card.imageUrl}
                onChange={(value) => onChange(index, "imageUrl", value)}
                onUpload={onUpload}
              />
              <LabeledInput label="CTA Label" value={card.ctaLabel} onChange={(value) => onChange(index, "ctaLabel", value)} />
              <LabeledInput label="CTA URL" value={card.ctaUrl} onChange={(value) => onChange(index, "ctaUrl", value)} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-semibold text-[var(--color-ink)]">
      {label}
      <input
        className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const url = await onUpload(file);
      onChange(url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="text-sm font-semibold text-[var(--color-ink)]">
      {label}
      <input
        className="mt-2 block text-xs"
        type="file"
        accept="image/*"
        onChange={(event) => void handleFile(event.target.files?.[0] ?? null)}
      />
      {value ? (
        <div className="mt-2 rounded-lg border border-[var(--color-border)] bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="h-28 w-full rounded object-cover" />
          <p className="mt-2 break-all text-xs font-normal text-[var(--color-muted)]">{value}</p>
        </div>
      ) : null}
      {uploading ? <span className="mt-1 block text-xs text-[var(--color-primary)]">Enviando imagem...</span> : null}
    </label>
  );
}
