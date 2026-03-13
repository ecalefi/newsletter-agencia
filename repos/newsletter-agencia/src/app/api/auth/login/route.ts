import { createSessionToken, getSessionCookieName } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password?.trim() ?? "";
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: "Configure ADMIN_EMAIL e ADMIN_PASSWORD" }, { status: 500 });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "Credenciais invalidas" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSessionCookieName(), createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });

  return response;
}
