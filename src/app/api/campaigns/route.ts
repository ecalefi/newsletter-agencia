import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { CampaignLog } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("campaign_logs")
    .select("id,subject,preview_text,mode,test_email,total_recipients,status,provider_message_id,error,sent_at")
    .order("sent_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const logs: CampaignLog[] = (data ?? []).map((row) => ({
    id: row.id,
    subject: row.subject,
    previewText: row.preview_text,
    mode: row.mode,
    testEmail: row.test_email ?? undefined,
    totalRecipients: row.total_recipients,
    status: row.status,
    providerMessageId: row.provider_message_id ?? undefined,
    error: row.error ?? undefined,
    sentAt: row.sent_at,
  }));

  return NextResponse.json(logs);
}
