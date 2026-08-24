import { z } from 'zod';
import { calculateDeliveryFee } from '@/lib/calculator-logic';
import { STORE_LOCATION } from '@/lib/store-location';

const GOOGLE_ROUTES_ENDPOINT = 'https://routes.googleapis.com/directions/v2:computeRoutes';
const ROUTES_TIMEOUT_MS = 6000;
const ROUTES_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const ROUTES_CACHE_MAX_ENTRIES = 500;

const RoutesResponseSchema = z.object({
  routes: z.array(z.object({
    distanceMeters: z.number().positive(),
  })).min(1),
});

export interface GoogleDrivingQuote {
  distanceKm: number;
  deliveryFee: number;
  source: 'google_routes';
}

interface CachedQuote {
  expiresAt: number;
  quote: GoogleDrivingQuote;
}

const quoteCache = new Map<string, CachedQuote>();
const inFlightQuotes = new Map<string, Promise<GoogleDrivingQuote>>();

function getCacheKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
}

function setCachedQuote(key: string, quote: GoogleDrivingQuote): void {
  while (quoteCache.size >= ROUTES_CACHE_MAX_ENTRIES) {
    const oldestKey = quoteCache.keys().next().value as string | undefined;
    if (!oldestKey) break;
    quoteCache.delete(oldestKey);
  }
  quoteCache.set(key, { quote, expiresAt: Date.now() + ROUTES_CACHE_TTL_MS });
}

export class GoogleRoutesError extends Error {
  constructor(
    public readonly code: 'NOT_CONFIGURED' | 'UPSTREAM_ERROR' | 'INVALID_RESPONSE',
    message: string,
  ) {
    super(message);
    this.name = 'GoogleRoutesError';
  }
}

export async function getGoogleDrivingQuote(
  destinationLatitude: number,
  destinationLongitude: number,
): Promise<GoogleDrivingQuote> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  if (!apiKey) {
    throw new GoogleRoutesError('NOT_CONFIGURED', 'Google Routes API is not configured');
  }

  const cacheKey = getCacheKey(destinationLatitude, destinationLongitude);
  const cached = quoteCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.quote;
  if (cached) quoteCache.delete(cacheKey);

  const inFlight = inFlightQuotes.get(cacheKey);
  if (inFlight) return inFlight;

  const requestPromise = requestGoogleDrivingQuote(
    apiKey,
    destinationLatitude,
    destinationLongitude,
  );
  inFlightQuotes.set(cacheKey, requestPromise);

  try {
    const quote = await requestPromise;
    setCachedQuote(cacheKey, quote);
    return quote;
  } finally {
    inFlightQuotes.delete(cacheKey);
  }
}

async function requestGoogleDrivingQuote(
  apiKey: string,
  destinationLatitude: number,
  destinationLongitude: number,
): Promise<GoogleDrivingQuote> {

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ROUTES_TIMEOUT_MS);

  try {
    const response = await fetch(GOOGLE_ROUTES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'routes.distanceMeters',
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: STORE_LOCATION.lat,
              longitude: STORE_LOCATION.lng,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            },
          },
        },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_UNAWARE',
        languageCode: 'id-ID',
        units: 'METRIC',
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new GoogleRoutesError(
        'UPSTREAM_ERROR',
        `Google Routes API responded with ${response.status}`,
      );
    }

    const parsed = RoutesResponseSchema.safeParse(await response.json());
    if (!parsed.success) {
      throw new GoogleRoutesError('INVALID_RESPONSE', 'Google Routes API response is invalid');
    }

    const distanceKm = parsed.data.routes[0].distanceMeters / 1000;
    return {
      distanceKm,
      deliveryFee: calculateDeliveryFee(distanceKm),
      source: 'google_routes',
    };
  } catch (error) {
    if (error instanceof GoogleRoutesError) throw error;
    throw new GoogleRoutesError('UPSTREAM_ERROR', 'Google Routes API request failed');
  } finally {
    clearTimeout(timeout);
  }
}

export function resetGoogleRoutesCacheForTests(): void {
  quoteCache.clear();
  inFlightQuotes.clear();
}
