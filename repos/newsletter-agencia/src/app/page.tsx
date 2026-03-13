"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardSummary {
  activeContacts: number;
  campaignsCount: number;
  destinations: number;
  hotels: number;
  lastCampaign: { sent_at: string; status: string } | null;
}

export default function Home() {
  const [summary, setSummary] = useState<DashboardSummary>({
    activeContacts: 0,
    campaignsCount: 0,
    destinations: 0,
    hotels: 0,
    lastCampaign: null,
  });

  useEffect(() => {
    const run = async () => {
      const response = await fetch("/api/dashboard");
      const data = (await response.json()) as DashboardSummary;
      setSummary(data);
    };

    void run();
  }, []);

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">Operacao semanal</p>
        <h2 className="font-title mt-2 text-3xl">Controle completo da sua newsletter</h2>
        <p className="mt-3 max-w-3xl text-[var(--color-muted)]">
          Cadastre contatos por planilha ou manualmente, monte as promocoes e dispare com Brevo no ritmo da campanha semanal.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="card p-5">
          <p className="text-sm text-[var(--color-muted)]">Contatos ativos</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-ink)]">{summary.activeContacts}</p>
        </article>
        <article className="card p-5">
          <p className="text-sm text-[var(--color-muted)]">Destinos no template</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-ink)]">{summary.destinations}</p>
        </article>
        <article className="card p-5">
          <p className="text-sm text-[var(--color-muted)]">Hoteis no template</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-ink)]">{summary.hotels}</p>
        </article>
        <article className="card p-5">
          <p className="text-sm text-[var(--color-muted)]">Ultimo disparo</p>
          <p className="mt-2 text-base font-bold text-[var(--color-ink)]">
            {summary.lastCampaign ? new Date(summary.lastCampaign.sent_at).toLocaleString("pt-BR") : "Sem historico"}
          </p>
        </article>
      </section>

      <section className="card p-6">
        <h3 className="font-title text-2xl">Checklist rapido</h3>
        <div className="mt-4 grid gap-3 text-sm text-[var(--color-ink)] md:grid-cols-2">
          <p>1. Importar ou cadastrar os contatos da semana.</p>
          <p>2. Revisar os 3 cards de destinos e 3 de hoteis.</p>
          <p>3. Ajustar os 2 banners e os 3 pacotes principais.</p>
          <p>4. Validar preview e disparar teste no proprio email.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn bg-[var(--color-primary)] px-4 py-2 text-white" href="/contatos">
            Gerenciar contatos
          </Link>
          <Link className="btn bg-[var(--color-accent)] px-4 py-2 text-white" href="/promocoes">
            Editar promocoes
          </Link>
          <Link className="btn border border-[var(--color-border)] bg-white px-4 py-2 text-[var(--color-ink)]" href="/preview">
            Visualizar email
          </Link>
        </div>
      </section>
    </div>
  );
}
