import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = getSupabaseAdmin();

  const [{ count: activeContacts }, { count: campaignsCount }, { data: lastCampaign }, { data: newsletterRow }] = await Promise.all([
    supabase.from("contacts").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("campaign_logs").select("id", { count: "exact", head: true }),
    supabase.from("campaign_logs").select("sent_at,status").order("sent_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("app_state").select("value").eq("key", "newsletter").maybeSingle(),
  ]);

  const value = (newsletterRow?.value ?? {}) as {
    nationalPackages?: unknown[];
    internationalPackages?: unknown[];
  };

  return NextResponse.json({
    activeContacts: activeContacts ?? 0,
    campaignsCount: campaignsCount ?? 0,
    nationalPackages: value.nationalPackages?.length ?? 0,
    internationalPackages: value.internationalPackages?.length ?? 0,
    lastCampaign: lastCampaign ?? null,
  });
}
