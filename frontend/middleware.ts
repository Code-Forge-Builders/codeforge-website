import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./src/i18n/locales";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Already has a locale in path → continue
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}`)
  );
  if (hasLocale) return;

  // Detect browser language
  const browserLang = req.headers
    .get("accept-language")
    ?.split(",")[0]
    .toLowerCase();

  const locale =
    locales.find((l) => l.toLowerCase() === browserLang) || defaultLocale;

  return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

