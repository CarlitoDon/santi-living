import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { searchGooglePlacesMock } = vi.hoisted(() => ({ searchGooglePlacesMock: vi.fn() }));
vi.mock('@/lib/google-places', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/google-places')>();
  return { ...original, searchGooglePlaces: searchGooglePlacesMock };
});
import { GET, resetPlacesSearchRateLimitForTests } from './route';

describe('GET /api/places/search', () => {
  beforeEach(() => {
    resetPlacesSearchRateLimitForTests();
    searchGooglePlacesMock.mockReset();
  });

  it('returns server-sourced place results', async () => {
    searchGooglePlacesMock.mockResolvedValue([{
      id: 'place-1', name: 'Hotel Tentrem', address: 'Jl. P. Mangkubumi, Sleman', lat: -7.782, lng: 110.367,
    }]);
    const response = await GET(new NextRequest('http://localhost/api/places/search?q=Hotel%20Tentrem'));
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('s-maxage=300');
    await expect(response.json()).resolves.toMatchObject({ ok: true, results: [{ name: 'Hotel Tentrem' }] });
  });

  it('rejects short queries before calling Google', async () => {
    const response = await GET(new NextRequest('http://localhost/api/places/search?q=ab'));
    expect(response.status).toBe(400);
    expect(searchGooglePlacesMock).not.toHaveBeenCalled();
  });
});
