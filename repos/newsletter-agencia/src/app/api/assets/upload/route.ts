import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo nao enviado" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `newsletter/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("newsletter-assets")
    .upload(key, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("newsletter-assets").getPublicUrl(key);

  return NextResponse.json({ url: data.publicUrl, path: key });
}
