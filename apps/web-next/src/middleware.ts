import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['id', 'en'];
const defaultLocale = 'id';

const CANONICAL_ORIGIN = 'https://santiliving.com';

/** Exact hostname → canonical landing pathname for specialist subdomains. */
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

function getLocale(): string {
  // Bare URLs always start in Indonesian. Explicit /id and /en paths are the
  // source of truth, so a stale browser cookie can never override navigation.
  return defaultLocale;
}

function pathnameWithLocale(pathname: string, locale: string): string {
  if (pathname === '/') return `/${locale}`;
  if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) return pathname;
  return `/${locale}${pathname}`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = (request.headers.get('host') || '').split(':')[0].toLowerCase();

  // --- Step 1: Skip api, static files ---
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // --- Step 2: Specialist subdomains only own their landing page. ---
  // Redirect every other path to the main host so article crawls cannot create
  // duplicate ISR variants under acara/karpet/permadani/kipas hostnames.
  const hostTarget = HOST_REWRITES.get(hostname);
  if (hostTarget) {
    const localeMatch = pathname.match(/^\/(id|en)(?:\/|$)/);
    const locale = localeMatch?.[1] || getLocale();
    const unlocalizedPath = localeMatch
      ? pathname.slice(`/${locale}`.length) || '/'
      : pathname;
    const isLandingPath = unlocalizedPath === '/' || unlocalizedPath === hostTarget;

    if (isLandingPath) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${hostTarget}`;
      return NextResponse.rewrite(url);
    }

    const canonicalUrl = new URL(CANONICAL_ORIGIN);
    canonicalUrl.pathname = pathnameWithLocale(pathname, locale);
    canonicalUrl.search = request.nextUrl.search;
    return NextResponse.redirect(canonicalUrl, 308);
  }

  // --- Step 3: Locale prefix detection ---
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // --- Step 4: Redirect to locale-prefixed path ---
  const locale = getLocale();
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
