"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setMessage(payload.error ?? "Falha no login");
        return;
      }

      window.location.assign("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-16 w-full max-w-md">
      <div className="card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">Area administrativa</p>
        <h2 className="font-title mt-2 text-3xl">Login do painel</h2>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm font-semibold">
            Email
            <input
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="block text-sm font-semibold">
            Senha
            <input
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button className="btn w-full bg-[var(--color-primary)] px-4 py-2 text-white" disabled={loading} type="submit">
            Entrar
          </button>
          {message ? <p className="text-sm font-semibold text-red-600">{message}</p> : null}
        </form>
      </div>
    </div>
  );
}
