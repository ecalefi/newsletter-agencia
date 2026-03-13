import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName, isValidSessionToken } from "@/lib/auth";

const isPublicPath = (pathname: string): boolean => {
  if (pathname === "/login") {
    return true;
  }

  if (pathname.startsWith("/api/auth/")) {
    return true;
  }

  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return true;
  }

  return false;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(getSessionCookieName())?.value;

  if (isValidSessionToken(token)) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL("/login", request.url);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
