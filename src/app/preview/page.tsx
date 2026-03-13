import { getNewsletterState } from "@/lib/data-store";
import { renderNewsletterHtml } from "@/lib/newsletter-template";

export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  const newsletter = await getNewsletterState();
  const html = renderNewsletterHtml(newsletter);

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
          srcDoc={html}
          title="Preview do email"
        />
      </section>
    </div>
  );
}
