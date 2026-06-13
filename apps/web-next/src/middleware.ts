import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['id', 'en'];
const defaultLocale = 'id';

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
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  let { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // --- Step 1: Host-based subdomain rewrite ---
  for (const [host, target] of HOST_REWRITES) {
    if (hostname.startsWith(host) && pathname === '/') {
      pathname = target;
      break;
    }
  }

  // --- Step 2: Skip api, static files ---
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // --- Step 3: Locale prefix detection ---
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // --- Step 4: Redirect to locale-prefixed path ---
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
