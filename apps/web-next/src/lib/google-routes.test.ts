import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getGoogleDrivingQuote,
  resetGoogleRoutesCacheForTests,
} from '@/lib/google-routes';
import { STORE_LOCATION } from '@/lib/store-location';

describe('getGoogleDrivingQuote', () => {
  beforeEach(() => resetGoogleRoutesCacheForTests());

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('uses Google driving distance and calculates the delivery fee', async () => {
    vi.stubEnv('GOOGLE_MAPS_API_KEY', 'test-key');
    const fetchMock = vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ routes: [{ distanceMeters: 12_345 }] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    ));
    vi.stubGlobal('fetch', fetchMock);

    await expect(getGoogleDrivingQuote(-7.81, 110.41)).resolves.toEqual({
      distanceKm: 12.345,
      deliveryFee: 50_000,
      source: 'google_routes',
    });

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://routes.googleapis.com/directions/v2:computeRoutes');
    expect(request.headers).toMatchObject({
      'X-Goog-Api-Key': 'test-key',
      'X-Goog-FieldMask': 'routes.distanceMeters',
    });

    const body = JSON.parse(String(request.body));
    expect(body.origin.location.latLng).toEqual({
      latitude: STORE_LOCATION.lat,
      longitude: STORE_LOCATION.lng,
    });
    expect(body.destination.location.latLng).toEqual({
      latitude: -7.81,
      longitude: 110.41,
    });
    expect(body.travelMode).toBe('DRIVE');
  });

  it('fails closed when the server-side API key is missing', async () => {
    vi.stubEnv('GOOGLE_MAPS_API_KEY', '');

    await expect(getGoogleDrivingQuote(-7.81, 110.41)).rejects.toMatchObject({
      code: 'NOT_CONFIGURED',
    });
  });

  it('fails closed when Google returns a non-success response', async () => {
    vi.stubEnv('GOOGLE_MAPS_API_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 429 })));

    await expect(getGoogleDrivingQuote(-7.82, 110.42)).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
    });
  });

  it('fails closed when Google returns a malformed response', async () => {
    vi.stubEnv('GOOGLE_MAPS_API_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ routes: [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )));

    await expect(getGoogleDrivingQuote(-7.83, 110.43)).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
    });
  });

  it('aborts a slow Google request after the timeout', async () => {
    vi.useFakeTimers();
    vi.stubEnv('GOOGLE_MAPS_API_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn().mockImplementation((_url: string, request: RequestInit) => (
      new Promise((_resolve, reject) => {
        request.signal?.addEventListener('abort', () => reject(new Error('aborted')));
      })
    )));

    const assertion = expect(getGoogleDrivingQuote(-7.84, 110.44)).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
    });
    await vi.advanceTimersByTimeAsync(6_001);
    await assertion;
  });

  it('reuses a nearby cached quote instead of billing Google again', async () => {
    vi.stubEnv('GOOGLE_MAPS_API_KEY', 'test-key');
    const fetchMock = vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ routes: [{ distanceMeters: 8_000 }] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    ));
    vi.stubGlobal('fetch', fetchMock);

    await getGoogleDrivingQuote(-7.85001, 110.45001);
    await getGoogleDrivingQuote(-7.85002, 110.45002);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
