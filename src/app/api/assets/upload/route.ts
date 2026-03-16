import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
      return NextResponse.json({ error: "Arquivo nao enviado" }, { status: 400 });
    }

    const typedFile = file as File;
    if (!typedFile.type?.startsWith("image/")) {
      return NextResponse.json({ error: "Envie apenas arquivos de imagem" }, { status: 400 });
    }

    const maxSizeInBytes = 10 * 1024 * 1024;
    if (typedFile.size > maxSizeInBytes) {
      return NextResponse.json({ error: "Imagem maior que 10MB" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const ext = typedFile.name.split(".").pop()?.toLowerCase() || typedFile.type.split("/")[1] || "jpg";
    const key = `newsletter/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await typedFile.arrayBuffer());

    const { error } = await supabase.storage.from("newsletter-assets").upload(key, bytes, {
      contentType: typedFile.type || "application/octet-stream",
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: `Falha no upload: ${error.message}` }, { status: 500 });
    }

    const { data } = supabase.storage.from("newsletter-assets").getPublicUrl(key);
    return NextResponse.json({ url: data.publicUrl, path: key });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha inesperada ao enviar imagem";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
