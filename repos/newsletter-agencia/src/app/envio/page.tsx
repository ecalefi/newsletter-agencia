"use client";

import { FormEvent, useEffect, useState } from "react";
import { CampaignLog } from "@/lib/types";

export default function EnvioPage() {
  const [subject, setSubject] = useState("Ofertas da semana - Casa de Viagens");
  const [previewText, setPreviewText] = useState("Pacotes com condicoes especiais por tempo limitado.");
  const [mode, setMode] = useState<"test" | "weekly">("test");
  const [testEmail, setTestEmail] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("https://prd.calefi.shop/webhook/newsletter-send");
  const [message, setMessage] = useState("");
  const [n8nMessage, setN8nMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [n8nLoading, setN8nLoading] = useState(false);
  const [logs, setLogs] = useState<CampaignLog[]>([]);

  const fetchLogs = async () => {
    const response = await fetch("/api/campaigns");
    const data = (await response.json()) as CampaignLog[];
    setLogs(data);
  };

  useEffect(() => {
    void fetchLogs();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          previewText,
          mode,
          testEmail,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as Partial<CampaignLog> & {
        error?: string;
      };

      if (!response.ok) {
        setMessage(payload.error ?? "Falha ao enviar");
      } else {
        setMessage(`Envio realizado com sucesso. ID: ${payload.id ?? "n/a"}`);
      }

      await fetchLogs();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha inesperada ao enviar";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const onPushN8n = async () => {
    setN8nLoading(true);
    setN8nMessage("");

    try {
      const response = await fetch("/api/n8n/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl, subject }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        ok?: boolean;
        status?: number;
        contactsSent?: number;
      };

      if (!response.ok) {
        setN8nMessage(payload.error ?? "Falha ao enviar payload para n8n");
        return;
      }

      setN8nMessage(
        `Webhook chamado. status=${payload.status ?? "n/a"}, contatos=${payload.contactsSent ?? 0}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha inesperada ao acionar webhook";
      setN8nMessage(message);
    } finally {
      setN8nLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="font-title text-2xl">Disparo via Brevo API</h2>
        <p className="mt-2 text-[var(--color-muted)]">
          Dispare em modo teste para validacao ou em modo semanal para toda base ativa.
        </p>
      </section>

      <form className="card grid gap-4 p-6" onSubmit={onSubmit}>
        <label className="text-sm font-semibold">
          Assunto
          <input
            className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
        </label>

        <label className="text-sm font-semibold">
          Texto de apoio
          <input
            className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
            value={previewText}
            onChange={(event) => setPreviewText(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input checked={mode === "test"} name="mode" type="radio" onChange={() => setMode("test")} />
            Envio teste
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input checked={mode === "weekly"} name="mode" type="radio" onChange={() => setMode("weekly")} />
            Disparo semanal (toda base ativa)
          </label>
        </div>

        {mode === "test" ? (
          <label className="text-sm font-semibold">
            Email de teste
            <input
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              required
              type="email"
              value={testEmail}
              onChange={(event) => setTestEmail(event.target.value)}
            />
          </label>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button className="btn bg-[var(--color-primary)] px-4 py-2 text-white" disabled={loading} type="submit">
            Enviar agora
          </button>
          {message ? <span className="text-sm font-semibold text-[var(--color-primary)]">{message}</span> : null}
        </div>
      </form>

      <section className="card grid gap-4 p-6">
        <h3 className="font-title text-xl">Exportar para n8n</h3>
        <p className="text-sm text-[var(--color-muted)]">
          Gera HTML/texto com lista de contatos ativos (nome, email, whatsapp) e envia para seu webhook.
        </p>
        <label className="text-sm font-semibold">
          Webhook n8n
          <input
            className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
            value={webhookUrl}
            onChange={(event) => setWebhookUrl(event.target.value)}
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="btn bg-[var(--color-accent)] px-4 py-2 text-white"
            type="button"
            disabled={n8nLoading}
            onClick={() => void onPushN8n()}
          >
            Enviar payload para n8n
          </button>
          {n8nMessage ? <span className="text-sm font-semibold text-[var(--color-primary)]">{n8nMessage}</span> : null}
        </div>
      </section>

      <section className="card overflow-x-auto p-0">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-[var(--color-bg-soft)] text-left text-sm text-[var(--color-ink)]">
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Modo</th>
              <th className="px-4 py-3">Assunto</th>
              <th className="px-4 py-3">Destinatarios</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-[var(--color-border)] text-sm">
                <td className="px-4 py-3">{new Date(log.sentAt).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3">{log.mode}</td>
                <td className="px-4 py-3">{log.subject}</td>
                <td className="px-4 py-3">{log.totalRecipients}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${log.status === "sent" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
