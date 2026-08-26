import { z } from 'zod';
import { STORE_LOCATION } from '@/lib/store-location';

const GOOGLE_PLACES_ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';
const GOOGLE_PLACES_TIMEOUT_MS = 5_000;

const GooglePlacesResponseSchema = z.object({
  places: z.array(z.object({
    id: z.string(),
    displayName: z.object({ text: z.string() }),
    formattedAddress: z.string(),
    location: z.object({ latitude: z.number(), longitude: z.number() }),
    addressComponents: z.array(z.object({
      longText: z.string(),
      shortText: z.string().optional(),
      types: z.array(z.string()),
    })).optional(),
  })).optional().default([]),
});

export interface GooglePlaceSearchResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export class GooglePlacesError extends Error {
  constructor(
    public readonly code: 'NOT_CONFIGURED' | 'UPSTREAM_ERROR' | 'INVALID_RESPONSE',
    message: string,
  ) {
    super(message);
    this.name = 'GooglePlacesError';
  }
}

function isDiyAddressComponent(
  components: Array<{ longText: string; shortText?: string; types: string[] }> | undefined,
): boolean {
  const province = components?.find((component) =>
    component.types.includes('administrative_area_level_1'));
  const value = `${province?.longText || ''} ${province?.shortText || ''}`.toLowerCase();
  return value.includes('yogyakarta') || /(^|\s)diy($|\s)/.test(value);
}

export async function searchGooglePlaces(query: string): Promise<GooglePlaceSearchResult[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  if (!apiKey) {
    throw new GooglePlacesError('NOT_CONFIGURED', 'Google Places API is not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GOOGLE_PLACES_TIMEOUT_MS);

  try {
    const response = await fetch(GOOGLE_PLACES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.formattedAddress',
          'places.location',
          'places.addressComponents',
        ].join(','),
      },
      body: JSON.stringify({
        textQuery: query,
        pageSize: 5,
        languageCode: 'id',
        regionCode: 'ID',
        locationBias: {
          circle: {
            center: { latitude: STORE_LOCATION.lat, longitude: STORE_LOCATION.lng },
            radius: 70_000,
          },
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new GooglePlacesError('UPSTREAM_ERROR', `Google Places API responded with ${response.status}`);
    }
    const parsed = GooglePlacesResponseSchema.safeParse(await response.json());
    if (!parsed.success) {
      throw new GooglePlacesError('INVALID_RESPONSE', 'Google Places API response is invalid');
    }

    return parsed.data.places
      .filter((place) => isDiyAddressComponent(place.addressComponents))
      .map((place) => ({
        id: place.id,
        name: place.displayName.text,
        address: place.formattedAddress,
        lat: place.location.latitude,
        lng: place.location.longitude,
      }));
  } catch (error) {
    if (error instanceof GooglePlacesError) throw error;
    throw new GooglePlacesError('UPSTREAM_ERROR', 'Google Places API request failed');
  } finally {
    clearTimeout(timeout);
  }
}
