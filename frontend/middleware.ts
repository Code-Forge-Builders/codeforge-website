import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const locales = ['en', 'pt', 'es']

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
});

export default function middleware(request: NextRequest) {

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

  const pathname = request.nextUrl.pathname

  console.log('Middleware working')

  if ((pathname === '/' || pathname === '') && cookieLocale && locales.includes(cookieLocale)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${cookieLocale}`
    return NextResponse.redirect(url)
  }

  return intlMiddleware(request)
}
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};

