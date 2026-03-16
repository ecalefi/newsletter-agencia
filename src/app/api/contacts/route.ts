import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { Contact } from "@/lib/types";
import { NextResponse } from "next/server";

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());

const normalizeWhatsapp = (value: string): string =>
  value
    .trim()
    .replace(/\s+/g, " ");

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("contacts")
    .select("id,name,email,whatsapp,status,source,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const contacts: Contact[] = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    whatsapp: row.whatsapp ?? "",
    status: row.status,
    source: row.source,
    createdAt: row.created_at,
  }));

  return NextResponse.json(contacts);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; email?: string; whatsapp?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const name = body.name?.trim() ?? "";
  const whatsapp = normalizeWhatsapp(body.whatsapp ?? "");

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email invalido" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("contacts")
    .insert({
      name: name || email.split("@")[0],
      email,
      whatsapp: whatsapp || null,
      source: "manual",
      status: "active",
    })
    .select("id,name,email,whatsapp,status,source,created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Email ja cadastrado" }, { status: 409 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const contact: Contact = {
    id: data.id,
    name: data.name,
    email: data.email,
    whatsapp: data.whatsapp ?? "",
    status: data.status,
    source: data.source,
    createdAt: data.created_at,
  };

  return NextResponse.json(contact, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { id?: string; status?: Contact["status"] };
  const id = body.id?.trim() ?? "";
  const status = body.status;

  if (!id) {
    return NextResponse.json({ error: "ID do contato obrigatorio" }, { status: 400 });
  }

  if (status !== "active" && status !== "unsubscribed") {
    return NextResponse.json({ error: "Status invalido" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("contacts")
    .update({ status })
    .eq("id", id)
    .select("id,name,email,whatsapp,status,source,created_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Contato nao encontrado" }, { status: 404 });
  }

  const contact: Contact = {
    id: data.id,
    name: data.name,
    email: data.email,
    whatsapp: data.whatsapp ?? "",
    status: data.status,
    source: data.source,
    createdAt: data.created_at,
  };

  return NextResponse.json(contact);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim() ?? "";

  if (!id) {
    return NextResponse.json({ error: "ID do contato obrigatorio" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("contacts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
