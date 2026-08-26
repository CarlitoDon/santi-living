import { NextRequest, NextResponse } from 'next/server';
import { GooglePlacesError, searchGooglePlaces } from '@/lib/google-places';

const buckets = new Map<string, { count: number; startedAt: number }>();

function getClientKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim()
    || 'unknown-client';
}

function isRateLimited(request: NextRequest, now = Date.now()): boolean {
  const key = getClientKey(request);
  const current = buckets.get(key);
  const bucket = current && now - current.startedAt < 60_000
    ? current
    : { count: 0, startedAt: now };
  if (bucket.count >= 20) return true;
  bucket.count += 1;
  buckets.set(key, bucket);
  if (buckets.size > 1_000) {
    for (const [bucketKey, value] of buckets) {
      if (now - value.startedAt >= 60_000) buckets.delete(bucketKey);
    }
  }
  return false;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() || '';
  if (query.length < 3 || query.length > 120) {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_QUERY' } }, { status: 400 });
  }
  if (isRateLimited(request)) {
    return NextResponse.json({ ok: false, error: { code: 'RATE_LIMITED' } }, { status: 429 });
  }

  try {
    const results = await searchGooglePlaces(query);
    return NextResponse.json(
      { ok: true, results },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    const code = error instanceof GooglePlacesError ? error.code : 'UNKNOWN';
    console.warn('[google_places_search] Search unavailable:', { code });
    return NextResponse.json({ ok: false, error: { code: 'SEARCH_UNAVAILABLE' } }, { status: 503 });
  }
}

export function resetPlacesSearchRateLimitForTests(): void {
  buckets.clear();
}
