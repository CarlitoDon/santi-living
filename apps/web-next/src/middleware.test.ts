import { describe, it, expect } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from './middleware';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function makeRequest(
  url: string,
  opts?: { host?: string; cookie?: string },
): NextRequest {
  const headers = new Headers();
  if (opts?.host) headers.set('host', opts.host);
  if (opts?.cookie) headers.set('cookie', opts.cookie);
  return new NextRequest(url, { headers });
}

function extractLocation(res: NextResponse): string {
  return res.headers.get('location') ?? '';
}

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */

describe('middleware – locale redirect preserves query parameters', () => {
  it('redirects / to /id with all tracking params', () => {
    const qs =
      'gclid=abc123&wbraid=wb&gbraid=gb&utm_source=google&utm_medium=cpc&utm_campaign=summer&utm_term=bed&utm_content=ad1&ref=homepage';
    const req = makeRequest(`http://localhost:3000/?${qs}`);
    const res = middleware(req);

    const loc = extractLocation(res);
    expect(loc).toContain('/id?');
    expect(loc).toContain('gclid=abc123');
    expect(loc).toContain('wbraid=wb');
    expect(loc).toContain('gbraid=gb');
    expect(loc).toContain('utm_source=google');
    expect(loc).toContain('utm_medium=cpc');
    expect(loc).toContain('utm_campaign=summer');
    expect(loc).toContain('utm_term=bed');
    expect(loc).toContain('utm_content=ad1');
    expect(loc).toContain('ref=homepage');
  });

  it('redirects bare / with empty search to /id (no trailing ?)', () => {
    const req = makeRequest('http://localhost:3000/');
    const res = middleware(req);
    const loc = extractLocation(res);
    expect(loc).toMatch(/\/id\/?$/);
  });

  it('redirects /path to /id/path retaining query params', () => {
    const req = makeRequest('http://localhost:3000/about?ref=ad&utm_source=bing');
    const res = middleware(req);
    const loc = extractLocation(res);
    expect(loc).toContain('/id/about?');
    expect(loc).toContain('ref=ad');
    expect(loc).toContain('utm_source=bing');
  });

  it('preserves duplicate query parameter keys', () => {
    const req = makeRequest(
      'http://localhost:3000/?tag=a&tag=b&tag=c',
    );
    const res = middleware(req);
    const loc = extractLocation(res);
    // URLSearchParams serialises each occurrence
    expect(loc).toContain('tag=a');
    expect(loc).toContain('tag=b');
    expect(loc).toContain('tag=c');
  });

  it('preserves percent-encoded values', () => {
    const req = makeRequest(
      'http://localhost:3000/?q=hello%20world&path=%2Ffoo',
    );
    const res = middleware(req);
    const loc = extractLocation(res);
    expect(loc).toContain('q=hello%20world');
    expect(loc).toContain('path=%2Ffoo');
  });

  it('preserves unrelated/arbitrary query params', () => {
    const req = makeRequest(
      'http://localhost:3000/?foo=bar&123=true&a-b=c',
    );
    const res = middleware(req);
    const loc = extractLocation(res);
    expect(loc).toContain('foo=bar');
    expect(loc).toContain('123=true');
    expect(loc).toContain('a-b=c');
  });

  it('preserves an empty-value query param', () => {
    const req = makeRequest('http://localhost:3000/?key=&other=val');
    const res = middleware(req);
    const loc = extractLocation(res);
    expect(loc).toContain('key=');
    expect(loc).toContain('other=val');
  });
});

describe('middleware – locale-prefixed paths pass through', () => {
  it('passes /id with query params through (no redirect)', () => {
    const req = makeRequest('http://localhost:3000/id?gclid=abc');
    const res = middleware(req);
    // Should NOT be a redirect
    expect(res.headers.get('location')).toBeNull();
  });

  it('passes /en with query params through (no redirect)', () => {
    const req = makeRequest('http://localhost:3000/en?gclid=abc');
    const res = middleware(req);
    expect(res.headers.get('location')).toBeNull();
  });
});

describe('middleware – subdomain rewrites preserve query params', () => {
  it('rewrites the acara subdomain root and retains query params', () => {
    const req = makeRequest('http://localhost:3000/?gclid=abc', {
      host: 'acara.localhost',
    });
    const res = middleware(req);
    expect(res.headers.get('location')).toBeNull();
    expect(res.headers.get('x-middleware-rewrite')).toContain(
      '/id/sewa-perlengkapan-event?gclid=abc',
    );
  });

  it('rewrites an explicit English karpet landing path', () => {
    const req = makeRequest('http://localhost:3000/en/sewa-karpet-jogja?utm_source=fb', {
      host: 'karpet.localhost',
    });
    const res = middleware(req);
    expect(res.headers.get('location')).toBeNull();
    expect(res.headers.get('x-middleware-rewrite')).toContain(
      '/en/sewa-karpet-jogja?utm_source=fb',
    );
  });

  it('treats a locale-only specialist URL as that subdomain home', () => {
    const req = makeRequest('https://karpet.santiliving.com/id', {
      host: 'karpet.santiliving.com',
    });
    const res = middleware(req);

    expect(res.headers.get('location')).toBeNull();
    expect(res.headers.get('x-middleware-rewrite')).toContain('/id/sewa-karpet-jogja');
  });

  it('redirects article paths on a specialist subdomain to the canonical main host', () => {
    const req = makeRequest('https://permadani.santiliving.com/en/artikel/tips?ref=sidebar', {
      host: 'permadani.santiliving.com',
    });
    const res = middleware(req);

    expect(extractLocation(res)).toBe(
      'https://santiliving.com/en/artikel/tips?ref=sidebar',
    );
    expect(res.headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('adds the Indonesian locale when redirecting a bare subdomain path', () => {
    const req = makeRequest('https://karpet.santiliving.com/artikel/tips?utm_source=google', {
      host: 'karpet.santiliving.com',
    });
    const res = middleware(req);

    expect(extractLocation(res)).toBe(
      'https://santiliving.com/id/artikel/tips?utm_source=google',
    );
  });

  it('does not treat lookalike hostnames as Santi Living subdomains', () => {
    const req = makeRequest('https://karpet.santiliving.com.evil.test/', {
      host: 'karpet.santiliving.com.evil.test',
    });
    const res = middleware(req);

    expect(extractLocation(res)).toContain('/id');
    expect(res.headers.get('x-middleware-rewrite')).toBeNull();
  });
});

describe('middleware – deterministic Indonesian default', () => {
  it('redirects root to Indonesian without setting a locale cookie', () => {
    const req = makeRequest('http://localhost:3000/?gclid=abc');
    const res = middleware(req);
    const cookie = res.cookies.get('NEXT_LOCALE');
    expect(extractLocation(res)).toContain('/id?');
    expect(cookie).toBeUndefined();
  });

  it('ignores a stale English cookie when redirecting the bare domain', () => {
    const req = makeRequest('http://localhost:3000/?gclid=abc', {
      cookie: 'NEXT_LOCALE=en',
    });
    const res = middleware(req);
    const loc = extractLocation(res);
    expect(loc).toContain('/id?');
    expect(loc).toContain('gclid=abc');
  });

  it('does not refresh the legacy locale cookie on explicit locale paths', () => {
    const req = makeRequest('http://localhost:3000/en', {
      cookie: 'NEXT_LOCALE=en',
    });
    const res = middleware(req);

    expect(res.headers.get('location')).toBeNull();
    expect(res.cookies.get('NEXT_LOCALE')).toBeUndefined();
  });
});

describe('middleware – skipped routes', () => {
  it('passes /api routes through without redirect', () => {
    const req = makeRequest('http://localhost:3000/api/lead?foo=bar');
    const res = middleware(req);
    expect(res.headers.get('location')).toBeNull();
  });

  it('passes paths with extensions through without redirect', () => {
    const req = makeRequest('http://localhost:3000/favicon.ico');
    const res = middleware(req);
    expect(res.headers.get('location')).toBeNull();
  });
});

describe('middleware – next.config redirects', () => {
  // These are tested via the static redirect config in next.config.ts.
  // /sewa-kasur -> / (permanent). The middleware then redirects / -> /id.
  // We verify the middleware handles the intermediate step correctly.
  it('middleware redirects /sewa-kasur path (with locale) without error', () => {
    const req = makeRequest('http://localhost:3000/sewa-kasur');
    const res = middleware(req);
    const loc = extractLocation(res);
    expect(loc).toContain('/id/sewa-kasur');
  });
});
