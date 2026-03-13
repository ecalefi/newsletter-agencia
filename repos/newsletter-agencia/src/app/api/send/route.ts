import { sendBrevoSmtpMail } from "@/lib/brevo-smtp";
import { getNewsletterState } from "@/lib/data-store";
import { renderNewsletterHtml, renderNewsletterText } from "@/lib/newsletter-template";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { CampaignLog } from "@/lib/types";
import { NextResponse } from "next/server";

interface SendBody {
  subject: string;
  previewText: string;
  mode: "test" | "weekly";
  testEmail?: string;
}

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SendBody>;

    const mode = body.mode === "weekly" ? "weekly" : "test";

    if (!body.subject?.trim()) {
      return NextResponse.json({ error: "Informe o assunto" }, { status: 400 });
    }

    if (mode === "test" && !body.testEmail?.trim()) {
      return NextResponse.json({ error: "Informe o email de teste" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const newsletter = await getNewsletterState();
    const html = renderNewsletterHtml(newsletter);
    const text = renderNewsletterText(newsletter);
    const now = new Date().toISOString();

    let recipients: Array<{ email: string; name: string }>;

    if (mode === "test") {
      recipients = [{ email: body.testEmail?.trim().toLowerCase() ?? "", name: "Teste" }];
    } else {
      const { data: contacts, error: contactsError } = await supabase
        .from("contacts")
        .select("name,email,status")
        .eq("status", "active");

      if (contactsError) {
        return NextResponse.json({ error: contactsError.message }, { status: 500 });
      }

      recipients = (contacts ?? []).map((contact) => ({ email: contact.email, name: contact.name }));
    }

    const validRecipients = recipients.filter((recipient) => isValidEmail(recipient.email));

    if (!validRecipients.length) {
      return NextResponse.json({ error: "Nenhum destinatario valido encontrado" }, { status: 400 });
    }

    const log: CampaignLog = {
      id: crypto.randomUUID(),
      subject: body.subject.trim(),
      previewText: body.previewText?.trim() || newsletter.preheader,
      mode,
      testEmail: mode === "test" ? body.testEmail : undefined,
      totalRecipients: validRecipients.length,
      status: "sent",
      sentAt: now,
    };

    try {
      const messageIds: string[] = [];
      const errors: string[] = [];

      for (const recipient of validRecipients) {
        try {
          const messageId = await sendBrevoSmtpMail({
            subject: log.subject,
            html,
            text,
            to: recipient,
          });
          messageIds.push(messageId);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Falha inesperada ao enviar email";
          errors.push(`${recipient.email}: ${message}`);
        }
      }

      if (errors.length) {
        log.status = "failed";
        log.error = errors.slice(0, 3).join(" | ");
      }

      log.providerMessageId = messageIds[0];
    } catch (error) {
      log.status = "failed";
      log.error = error instanceof Error ? error.message : "Falha inesperada";
    }

    const { error: insertError } = await supabase.from("campaign_logs").insert({
      id: log.id,
      subject: log.subject,
      preview_text: log.previewText,
      mode: log.mode,
      test_email: log.testEmail ?? null,
      total_recipients: log.totalRecipients,
      status: log.status,
      provider_message_id: log.providerMessageId ?? null,
      error: log.error ?? null,
      sent_at: log.sentAt,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    if (log.status === "failed") {
      return NextResponse.json(log, { status: 500 });
    }

    return NextResponse.json(log);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha inesperada no servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
