import { getNewsletterState } from "@/lib/data-store";
import { renderNewsletterHtml } from "@/lib/newsletter-template";

export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  let html: string | null = null;
  let errorMessage: string | null = null;

  try {
    const newsletter = await getNewsletterState();
    html = renderNewsletterHtml(newsletter);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Falha inesperada ao carregar o preview";
  }

  if (errorMessage) {
    return (
      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="font-title text-2xl">Preview indisponivel</h2>
          <p className="mt-2 text-[var(--color-muted)]">
            Nao foi possivel carregar o estado da newsletter no servidor.
          </p>
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{errorMessage}</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[var(--color-ink)]">
            <li>Confirme no deploy as variaveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.</li>
            <li>Execute o schema do projeto no Supabase online (tabela app_state e bucket newsletter-assets).</li>
            <li>Após ajustar, faça novo deploy para recarregar as variaveis de ambiente.</li>
          </ul>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="font-title text-2xl">Preview da newsletter</h2>
        <p className="mt-2 text-[var(--color-muted)]">
          Revisao visual do HTML de email antes do envio real.
        </p>
      </section>

      <section className="card overflow-hidden p-0">
        <iframe
          className="min-h-[900px] w-full"
          srcDoc={html ?? ""}
          title="Preview do email"
        />
      </section>
    </div>
  );
}
