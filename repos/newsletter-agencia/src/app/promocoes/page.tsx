"use client";

import { FormEvent, useEffect, useState } from "react";
import { NewsletterContent, PackageImage } from "@/lib/types";

const defaultState: NewsletterContent = {
  templateVersion: "v2",
  agencyName: "",
  preheader: "",
  logoUrl: "",
  highlightBanner: {
    imageUrl: "",
    title: "",
    description: "",
  },
  nationalPackages: Array.from({ length: 3 }, () => ({ imageUrl: "", caption: "" })),
  internationalPackages: Array.from({ length: 3 }, () => ({ imageUrl: "", caption: "" })),
  updatedAt: "",
};

const slotConfig = [
  { id: "national-0", label: "Nacional 1" },
  { id: "national-1", label: "Nacional 2" },
  { id: "national-2", label: "Nacional 3" },
  { id: "international-0", label: "Internacional 1" },
  { id: "international-1", label: "Internacional 2" },
  { id: "international-2", label: "Internacional 3" },
] as const;

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

  const updateImage = (group: "nationalPackages" | "internationalPackages", index: number, imageUrl: string) => {
    setNewsletter((prev) => {
      const nextGroup = [...prev[group]];
      nextGroup[index] = { ...nextGroup[index], imageUrl };
      return { ...prev, [group]: nextGroup };
    });
  };

  const updateCaption = (group: "nationalPackages" | "internationalPackages", index: number, caption: string) => {
    setNewsletter((prev) => {
      const nextGroup = [...prev[group]];
      nextGroup[index] = { ...nextGroup[index], caption };
      return { ...prev, [group]: nextGroup };
    });
  };

  const handleBannerUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const url = await uploadImage(file);
      setNewsletter((prev) => ({
        ...prev,
        highlightBanner: {
          ...prev.highlightBanner,
          imageUrl: url,
        },
      }));
      setMessage("Banner atualizado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha no upload do banner");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const url = await uploadImage(file);
      setNewsletter((prev) => ({ ...prev, logoUrl: url }));
      setMessage("Logo atualizada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha no upload da logo");
    } finally {
      setLoading(false);
    }
  };

  const handleSingleUpload = async (
    group: "nationalPackages" | "internationalPackages",
    index: number,
    file: File | null,
  ) => {
    if (!file) {
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const url = await uploadImage(file);
      updateImage(group, index, url);
      setMessage("Imagem atualizada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha no upload da imagem");
    } finally {
      setLoading(false);
    }
  };

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
      setMessage("Template salvo com sucesso.");
    } finally {
      setLoading(false);
    }
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

      setNewsletter((prev) => {
        let next = { ...prev };
        for (const item of uploaded) {
          const [group, rawIndex] = item.slotId.split("-");
          const index = Number(rawIndex);
          if (group === "national") {
            const national = [...next.nationalPackages];
            national[index] = { ...national[index], imageUrl: item.url };
            next = { ...next, nationalPackages: national };
          }

          if (group === "international") {
            const international = [...next.internationalPackages];
            international[index] = { ...international[index], imageUrl: item.url };
            next = { ...next, internationalPackages: international };
          }
        }
        return next;
      });

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
        <h2 className="font-title text-2xl">Template simplificado</h2>
        <p className="mt-2 text-[var(--color-muted)]">
          Agora voce troca somente 6 imagens com seus respectivos textos: 3 pacotes nacionais e 3 pacotes internacionais.
        </p>
      </section>

      <section className="card p-6">
        <h3 className="font-title text-xl">Logo (upload com fundo branco no template)</h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Envie a logo para aparecer no cabecalho da newsletter com area branca de destaque.
        </p>
        <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-white p-4">
          <label className="block text-sm font-semibold text-[var(--color-ink)]">
            Imagem da logo
            <input
              className="mt-2 block w-full text-xs"
              type="file"
              accept="image/*"
              onChange={(event) => void handleLogoUpload(event.target.files?.[0] ?? null)}
            />
          </label>
          {newsletter.logoUrl ? (
            <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={newsletter.logoUrl} alt="Logo da newsletter" className="h-16 w-auto max-w-full object-contain" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="card p-6">
        <h3 className="font-title text-xl">Banner principal (editavel)</h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Esse banner aparece no topo da newsletter para destacar a oferta principal da semana.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--color-ink)]">
            Titulo do banner
            <input
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              value={newsletter.highlightBanner.title}
              onChange={(event) =>
                setNewsletter((prev) => ({
                  ...prev,
                  highlightBanner: { ...prev.highlightBanner, title: event.target.value },
                }))
              }
            />
          </label>
          <label className="text-sm font-semibold text-[var(--color-ink)]">
            Descricao do banner
            <textarea
              className="mt-1 min-h-[88px] w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-normal"
              value={newsletter.highlightBanner.description}
              onChange={(event) =>
                setNewsletter((prev) => ({
                  ...prev,
                  highlightBanner: { ...prev.highlightBanner, description: event.target.value },
                }))
              }
            />
          </label>
        </div>
        <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-white p-4">
          <label className="block text-sm font-semibold text-[var(--color-ink)]">
            Imagem do banner
            <input
              className="mt-2 block w-full text-xs"
              type="file"
              accept="image/*"
              onChange={(event) => void handleBannerUpload(event.target.files?.[0] ?? null)}
            />
          </label>
          {newsletter.highlightBanner.imageUrl ? (
            <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-soft)] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={newsletter.highlightBanner.imageUrl}
                alt="Banner principal"
                className="h-40 w-full rounded object-cover"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="card p-6">
        <h3 className="font-title text-xl">Upload em lote mapeado</h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Cada arquivo e vinculado ao slot correto antes do envio. Sem risco de ordem errada.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {slotConfig.map((slot) => (
            <label
              key={slot.id}
              className="rounded-lg border border-[var(--color-border)] p-3 text-sm font-semibold text-[var(--color-ink)]"
            >
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
      </section>

      <form className="space-y-6" onSubmit={save}>
        <PackageSection
          title="Pacotes nacionais"
          cards={newsletter.nationalPackages}
          prefix="Nacional"
          group="nationalPackages"
          onCaptionChange={(index, value) => updateCaption("nationalPackages", index, value)}
          onUpload={(index, file) => void handleSingleUpload("nationalPackages", index, file)}
        />

        <PackageSection
          title="Pacotes internacionais"
          cards={newsletter.internationalPackages}
          prefix="Internacional"
          group="internationalPackages"
          onCaptionChange={(index, value) => updateCaption("internationalPackages", index, value)}
          onUpload={(index, file) => void handleSingleUpload("internationalPackages", index, file)}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button className="btn bg-[var(--color-primary)] px-5 py-2 text-white" disabled={loading} type="submit">
            Salvar template
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

function PackageSection({
  title,
  cards,
  prefix,
  group,
  onCaptionChange,
  onUpload,
}: {
  title: string;
  cards: PackageImage[];
  prefix: string;
  group: "nationalPackages" | "internationalPackages";
  onCaptionChange: (index: number, value: string) => void;
  onUpload: (index: number, file: File | null) => void;
}) {
  return (
    <section className="card p-6">
      <h3 className="font-title text-xl">{title}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {cards.map((card, index) => (
          <article key={`${title}-${index}`} className="rounded-xl border border-[var(--color-border)] p-4">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
              {prefix} {index + 1}
            </h4>
            <input
              className="block w-full text-xs"
              type="file"
              accept="image/*"
              onChange={(event) => onUpload(index, event.target.files?.[0] ?? null)}
            />
            <label className="mt-3 block text-xs font-semibold text-[var(--color-ink)]">
              Texto abaixo da imagem
              <textarea
                className="mt-1 min-h-[72px] w-full rounded-lg border border-[var(--color-border)] px-2 py-2 text-xs font-normal"
                maxLength={140}
                placeholder={`Descreva o pacote ${prefix.toLowerCase()} ${index + 1}`}
                value={card.caption}
                onChange={(event) => onCaptionChange(index, event.target.value)}
                name={`${group}-${index}-caption`}
              />
            </label>
            {card.imageUrl ? (
              <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.imageUrl} alt={`${prefix} ${index + 1}`} className="h-28 w-full rounded object-cover" />
                <p className="mt-2 text-xs font-semibold text-[var(--color-ink)]">{card.caption || "Sem texto"}</p>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
