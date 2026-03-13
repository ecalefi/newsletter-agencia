"use client";

import { FormEvent, useEffect, useState } from "react";
import { Contact } from "@/lib/types";

interface ImportResult {
  imported: number;
  ignored: number;
  errors: Array<{ row: number; message: string }>;
}

export default function ContatosPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const fetchContacts = async () => {
    const response = await fetch("/api/contacts");
    const data = (await response.json()) as Contact[];
    setContacts(data);
  };

  useEffect(() => {
    void fetchContacts();
  }, []);

  const onManualSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setMessage(payload.error ?? "Erro ao salvar contato");
        return;
      }

      setName("");
      setEmail("");
      setMessage("Contato cadastrado com sucesso.");
      await fetchContacts();
    } finally {
      setLoading(false);
    }
  };

  const onImportSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setMessage("Selecione um arquivo CSV ou XLSX.");
      return;
    }

    setLoading(true);
    setMessage("");
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/contacts/import", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as ImportResult & { error?: string };

      if (!response.ok) {
        setMessage(payload.error ?? "Falha na importacao");
        return;
      }

      setImportResult(payload);
      setMessage("Importacao concluida.");
      setFile(null);
      await fetchContacts();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="font-title text-2xl">Base de contatos</h2>
        <p className="mt-2 text-[var(--color-muted)]">
          Cadastre manualmente ou importe planilhas para alimentar a campanha semanal.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form className="card space-y-4 p-6" onSubmit={onManualSubmit}>
          <h3 className="font-title text-xl">Cadastro manual</h3>
          <label className="block text-sm font-semibold text-[var(--color-ink)]">
            Nome
            <input
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="block text-sm font-semibold text-[var(--color-ink)]">
            Email
            <input
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <button className="btn bg-[var(--color-primary)] px-4 py-2 text-white" disabled={loading} type="submit">
            Salvar contato
          </button>
        </form>

        <form className="card space-y-4 p-6" onSubmit={onImportSubmit}>
          <h3 className="font-title text-xl">Importar planilha</h3>
          <p className="text-sm text-[var(--color-muted)]">
            Colunas aceitas: email/e-mail/mail e nome/name.
          </p>
          <input
            accept=".csv,.xlsx,.xls"
            className="w-full rounded-lg border border-[var(--color-border)] p-3"
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <button className="btn bg-[var(--color-accent)] px-4 py-2 text-white" disabled={loading} type="submit">
            Importar arquivo
          </button>
          {importResult ? (
            <div className="rounded-lg bg-[var(--color-bg-soft)] p-3 text-sm text-[var(--color-ink)]">
              <p>
                Importados: <strong>{importResult.imported}</strong>
              </p>
              <p>
                Ignorados: <strong>{importResult.ignored}</strong>
              </p>
              <p>
                Erros: <strong>{importResult.errors.length}</strong>
              </p>
            </div>
          ) : null}
        </form>
      </section>

      {message ? <p className="text-sm font-semibold text-[var(--color-primary)]">{message}</p> : null}

      <section className="card overflow-x-auto p-0">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="bg-[var(--color-bg-soft)] text-left text-sm text-[var(--color-ink)]">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Origem</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-t border-[var(--color-border)] text-sm">
                <td className="px-4 py-3">{contact.name}</td>
                <td className="px-4 py-3">{contact.email}</td>
                <td className="px-4 py-3">{contact.source}</td>
                <td className="px-4 py-3">{contact.status}</td>
                <td className="px-4 py-3">{new Date(contact.createdAt).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
