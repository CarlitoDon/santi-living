import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const latValue = searchParams.get('lat');
  const lngValue = searchParams.get('lng');
  const lat = Number(latValue);
  const lng = Number(lngValue);

  if (
    !latValue ||
    !lngValue ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'valid lat and lng are required' } },
      { status: 400 }
    );
  }

  const cachedLat = Math.round(lat * 100000) / 100000;
  const cachedLng = Math.round(lng * 100000) / 100000;
  const nominatimUrl = new URL('https://nominatim.openstreetmap.org/reverse');
  nominatimUrl.searchParams.set('format', 'json');
  nominatimUrl.searchParams.set('lat', String(cachedLat));
  nominatimUrl.searchParams.set('lon', String(cachedLng));
  nominatimUrl.searchParams.set('zoom', '18');
  nominatimUrl.searchParams.set('addressdetails', '1');

  try {
    const response = await fetch(nominatimUrl, {
      next: { revalidate: 86400 },
      headers: {
        'Accept-Language': 'id',
        'User-Agent': 'SantiLiving/1.0 (https://santiliving.com; contact@santiliving.com)',
      },
    });

    if (response.status === 429) {
      console.warn('[reverse-geocode] Upstream rate limited request');
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Reverse geocoding is temporarily unavailable' } },
        {
          status: 503,
          headers: {
            'Cache-Control': 'no-store',
            'Retry-After': '60',
          },
        },
      );
    }

    if (!response.ok) {
      console.warn('[reverse-geocode] Upstream request failed', { status: response.status });
      return NextResponse.json(
        { error: { code: 'UPSTREAM_ERROR', message: 'Failed to reverse geocode' } },
        { status: 502 },
      );
    }

    const data: unknown = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.warn('[reverse-geocode] Upstream request unavailable', {
      error: error instanceof Error ? error.message : 'unknown error',
    });
    return NextResponse.json(
      { error: { code: 'UPSTREAM_ERROR', message: 'Failed to reverse geocode' } },
      { status: 503 }
    );
  }
}
