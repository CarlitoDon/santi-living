import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['id', 'en'];
const defaultLocale = 'id';
const localeCookieName = 'NEXT_LOCALE';

/** Hostname → pathname rewrite for subdomain routing */
const HOST_REWRITES = new Map([
  ['acara.santiliving.com', '/sewa-perlengkapan-event'],
  ['acara.localhost', '/sewa-perlengkapan-event'],
  ['karpet.santiliving.com', '/sewa-karpet-jogja'],
  ['karpet.localhost', '/sewa-karpet-jogja'],
  ['permadani.santiliving.com', '/sewa-karpet-permadani-jogja'],
  ['permadani.localhost', '/sewa-karpet-permadani-jogja'],
  ['kipas-angin.santiliving.com', '/sewa-kipas-angin'],
  ['kipas-angin.localhost', '/sewa-kipas-angin'],
]);

function getLocale(request: NextRequest): string {
  // 1) Cookie from previous visit
  const cookie = request.cookies.get(localeCookieName)?.value;
  if (cookie && locales.includes(cookie)) return cookie;

  // 2) Default
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  let { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // --- Step 1: Skip api, static files ---
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // --- Step 2: Host-based subdomain rewrite ---
  for (const [host, target] of HOST_REWRITES) {
    if (hostname.startsWith(host)) {
      const url = request.nextUrl.clone();
      const localeMatch = pathname.match(/^\/(id|en)/);
      const locale = localeMatch ? localeMatch[1] : getLocale(request);
      url.pathname = `/${locale}${target}`;
      return NextResponse.rewrite(url);
    }
  }

  // --- Step 3: Locale prefix detection ---
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Remember this locale in a cookie
    const detected = pathname.split('/')[1];
    const res = NextResponse.next();
    if (detected && locales.includes(detected)) {
      res.cookies.set(localeCookieName, detected, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
      });
    }
    return res;
  }

  // --- Step 4: Redirect to locale-prefixed path ---
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const res = NextResponse.redirect(request.nextUrl);
  // Also set cookie on redirect (covers first visit with no cookie)
  res.cookies.set(localeCookieName, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
