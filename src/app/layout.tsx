import type { Metadata } from "next";
import { Manrope, Merriweather } from "next/font/google";
import { AppNav } from "@/components/app-nav";
import { LogoutButton } from "@/components/logout-button";
import "./globals.css";

const titleFont = Merriweather({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["700"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Central de Newsletter - Agencia de Viagens",
  description: "Plataforma para contatos, promocoes e disparo semanal com Brevo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${titleFont.variable} ${bodyFont.variable} antialiased`}>
        <header className="border-b border-[var(--color-border)] bg-[var(--color-bg-soft)]/90">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                  Horizonte Viagens
                </p>
                <h1 className="font-title text-2xl text-[var(--color-ink)]">Central de Newsletter</h1>
              </div>
              <LogoutButton />
            </div>
            <AppNav />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">{children}</main>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-8 pt-4 text-sm text-[var(--color-muted)] md:px-6">
          Fluxo: contatos no Supabase, gerador de template no painel e envio SMTP Brevo.
        </footer>
      </body>
    </html>
  );
}
