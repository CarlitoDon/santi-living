import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Host-based routing for acara.santiliving.com
  // If the host starts with acara.santiliving.com (e.g. acara.santiliving.com or local testing with acara.localhost:3000)
  // and the pathname is the root `/`, rewrite to `/sewa-acara`
  if (
    (hostname.startsWith('acara.santiliving.com') || hostname.startsWith('acara.localhost')) &&
    url.pathname === '/'
  ) {
    url.pathname = '/sewa-acara';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Ensure it matches requests that we care about
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
