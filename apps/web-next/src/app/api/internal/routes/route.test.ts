import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { STORE_LOCATION } from '@/lib/store-location';

const { computeGoogleMultiStopRouteMock } = vi.hoisted(() => ({
  computeGoogleMultiStopRouteMock: vi.fn(),
}));

vi.mock('@/lib/google-routes', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/google-routes')>();
  return { ...original, computeGoogleMultiStopRoute: computeGoogleMultiStopRouteMock };
});

import { POST } from './route';

const token = 'internal-test-token';
const stops = [{ latitude: -7.81, longitude: 110.41 }];

function buildRequest(body: unknown, requestToken?: string): NextRequest {
  return new NextRequest('http://localhost/api/internal/routes', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(requestToken ? { 'x-santi-routes-token': requestToken } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/internal/routes', () => {
  beforeEach(() => {
    vi.stubEnv('GOOGLE_ROUTES_INTERNAL_TOKEN', token);
    computeGoogleMultiStopRouteMock.mockReset();
    computeGoogleMultiStopRouteMock.mockResolvedValue({
      distanceKm: 12.345,
      duration: '900s',
      optimizedIntermediateWaypointIndex: [0],
      optimizedIntermediateWaypointOrder: [0],
      source: 'google_routes',
    });
  });

  it('requires the internal token and returns 401 for missing or wrong tokens', async () => {
    await expect(POST(buildRequest({ stops }))).resolves.toMatchObject({ status: 401 });
    await expect(POST(buildRequest({ stops }, 'wrong-token'))).resolves.toMatchObject({ status: 401 });
    expect(computeGoogleMultiStopRouteMock).not.toHaveBeenCalled();
  });

  it('validates 1-9 stops and rejects invalid stop counts without calling Google', async () => {
    const empty = await POST(buildRequest({ stops: [] }, token));
    expect(empty.status).toBe(400);

    const tooMany = await POST(buildRequest({ stops: Array.from({ length: 10 }, () => stops[0]) }, token));
    expect(tooMany.status).toBe(400);

    const invalidCoordinate = await POST(buildRequest({ stops: [{ latitude: 91, longitude: 110 }] }, token));
    expect(invalidCoordinate.status).toBe(400);
    expect(computeGoogleMultiStopRouteMock).not.toHaveBeenCalled();
  });

  it('uses store defaults and returns the typed Google route result', async () => {
    const response = await POST(buildRequest({ stops }, token));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      distanceKm: 12.345,
      duration: '900s',
      optimizedIntermediateWaypointIndex: [0],
      optimizedIntermediateWaypointOrder: [0],
      source: 'google_routes',
    });
    expect(computeGoogleMultiStopRouteMock).toHaveBeenCalledWith({
      stops,
      origin: { latitude: STORE_LOCATION.lat, longitude: STORE_LOCATION.lng },
      destination: { latitude: STORE_LOCATION.lat, longitude: STORE_LOCATION.lng },
    });
  });
});
