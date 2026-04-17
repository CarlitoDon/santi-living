import { NextRequest, NextResponse } from 'next/server';

/**
 * Reverse Geocode API Proxy
 * Proxies requests to Nominatim to avoid CORS issues
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'lat and lng are required' } },
      { status: 400 }
    );
  }

  const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

  try {
    const response = await fetch(nominatimUrl, {
      headers: {
        'Accept-Language': 'id',
        'User-Agent': 'SantiLiving/1.0 (https://santiliving.com; contact@santiliving.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim responded with ${response.status}`);
    }

    const data: unknown = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[reverse-geocode] Error:', error);
    return NextResponse.json(
      { error: { code: 'UPSTREAM_ERROR', message: 'Failed to reverse geocode' } },
      { status: 500 }
    );
  }
}
