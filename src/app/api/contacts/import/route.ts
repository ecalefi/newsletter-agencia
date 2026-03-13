import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());

const readCell = (row: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const exact = row[key];
    if (typeof exact === "string" && exact.trim()) {
      return exact.trim();
    }

    const found = Object.entries(row).find(
      ([name, value]) => name.toLowerCase().trim() === key.toLowerCase() && typeof value === "string" && value.trim(),
    );

    if (found) {
      return String(found[1]).trim();
    }
  }

  return "";
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo nao enviado" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return NextResponse.json({ error: "Planilha sem conteudo" }, { status: 400 });
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[firstSheetName], {
    defval: "",
  });

  const supabase = getSupabaseAdmin();
  const { data: existing, error: existingError } = await supabase.from("contacts").select("email");

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  const knownEmails = new Set((existing ?? []).map((item) => item.email));
  const errors: Array<{ row: number; message: string }> = [];
  const inserted: Array<{ name: string; email: string; source: "spreadsheet"; status: "active" }> = [];

  rows.forEach((row, index) => {
    const email = readCell(row, ["email", "e-mail", "mail"]).toLowerCase();
    const name = readCell(row, ["nome", "name"]);

    if (!email) {
      errors.push({ row: index + 2, message: "Email ausente" });
      return;
    }

    if (!isValidEmail(email)) {
      errors.push({ row: index + 2, message: "Email invalido" });
      return;
    }

    if (knownEmails.has(email)) {
      return;
    }

    knownEmails.add(email);
    inserted.push({
      name: name || email.split("@")[0],
      email,
      source: "spreadsheet",
      status: "active",
    });
  });

  if (inserted.length) {
    const { error: insertError } = await supabase.from("contacts").insert(inserted);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    imported: inserted.length,
    ignored: rows.length - inserted.length - errors.length,
    errors,
  });
}
