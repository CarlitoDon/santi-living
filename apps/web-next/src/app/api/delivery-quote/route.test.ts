import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { resetDeliveryQuoteGuardForTests } from '@/lib/delivery-quote-guard';

const { getGoogleDrivingQuoteMock } = vi.hoisted(() => ({
  getGoogleDrivingQuoteMock: vi.fn(),
}));

vi.mock('@/lib/google-routes', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/google-routes')>();
  return { ...original, getGoogleDrivingQuote: getGoogleDrivingQuoteMock };
});

import { GET } from './route';

describe('GET /api/delivery-quote', () => {
  beforeEach(() => {
    resetDeliveryQuoteGuardForTests();
    getGoogleDrivingQuoteMock.mockReset();
  });

  it('returns the final Google road-route delivery quote', async () => {
    getGoogleDrivingQuoteMock.mockResolvedValue({
      distanceKm: 9.994,
      deliveryFee: 40_000,
      source: 'google_routes',
    });
    const request = new NextRequest(
      'http://localhost/api/delivery-quote?lat=-7.7672263&lng=110.3543540',
      { headers: { 'x-forwarded-for': '203.0.113.30' } },
    );

    const response = await GET(request);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      quote: { deliveryFee: 40_000, distanceKm: 9.994 },
    });
    expect(getGoogleDrivingQuoteMock).toHaveBeenCalledWith(-7.7672263, 110.354354);
  });

  it('rejects invalid coordinates without calling Google', async () => {
    const response = await GET(new NextRequest(
      'http://localhost/api/delivery-quote?lat=invalid&lng=110.35',
    ));
    expect(response.status).toBe(400);
    expect(getGoogleDrivingQuoteMock).not.toHaveBeenCalled();
  });
});
