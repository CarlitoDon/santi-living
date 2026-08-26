import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { searchGooglePlaces } from './google-places';

describe('searchGooglePlaces', () => {
  beforeEach(() => vi.stubEnv('GOOGLE_MAPS_API_KEY', 'test-key'));
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('returns only Google places whose province is DIY', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      places: [
        {
          id: 'jogja-place',
          displayName: { text: 'Hotel Jogja' },
          formattedAddress: 'Jl. Malioboro, Kota Yogyakarta',
          location: { latitude: -7.792, longitude: 110.366 },
          addressComponents: [{ longText: 'Daerah Istimewa Yogyakarta', shortText: 'DIY', types: ['administrative_area_level_1'] }],
        },
        {
          id: 'solo-place',
          displayName: { text: 'Hotel Solo' },
          formattedAddress: 'Surakarta, Jawa Tengah',
          location: { latitude: -7.57, longitude: 110.82 },
          addressComponents: [{ longText: 'Jawa Tengah', shortText: 'Jateng', types: ['administrative_area_level_1'] }],
        },
      ],
    }), { status: 200 }));

    await expect(searchGooglePlaces('Hotel')).resolves.toEqual([{
      id: 'jogja-place', name: 'Hotel Jogja', address: 'Jl. Malioboro, Kota Yogyakarta', lat: -7.792, lng: 110.366,
    }]);
    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({ 'X-Goog-Api-Key': 'test-key' });
  });

  it('fails closed when the server key is missing', async () => {
    vi.stubEnv('GOOGLE_MAPS_API_KEY', '');
    await expect(searchGooglePlaces('Hotel Tentrem')).rejects.toMatchObject({ code: 'NOT_CONFIGURED' });
  });
});
