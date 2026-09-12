import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

import { GET } from './route';

describe('GET /api/reverse-geocode', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('returns a cached upstream address response', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({
      address: { city: 'Yogyakarta' },
      display_name: 'Yogyakarta, Indonesia',
    }), { status: 200 }));

    const response = await GET(new NextRequest(
      'http://localhost/api/reverse-geocode?lat=-7.7956&lng=110.3695',
    ));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      address: { city: 'Yogyakarta' },
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('lat=-7.7956');
    expect(fetchMock.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({ next: { revalidate: 86400 } }),
    );
    expect(response.headers.get('Cache-Control')).toBe(
      'public, s-maxage=86400, stale-while-revalidate=604800',
    );
  });

  it('rejects invalid coordinates without calling Nominatim', async () => {
    const response = await GET(new NextRequest(
      'http://localhost/api/reverse-geocode?lat=invalid&lng=110.3695',
    ));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: { code: 'BAD_REQUEST', message: 'valid lat and lng are required' },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('turns Nominatim rate limits into a retryable service response', async () => {
    fetchMock.mockResolvedValue(new Response('', { status: 429 }));

    const response = await GET(new NextRequest(
      'http://localhost/api/reverse-geocode?lat=-7.7956&lng=110.3695',
    ));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: { code: 'RATE_LIMITED', message: 'Reverse geocoding is temporarily unavailable' },
    });
    expect(response.headers.get('Retry-After')).toBe('60');
  });
});
