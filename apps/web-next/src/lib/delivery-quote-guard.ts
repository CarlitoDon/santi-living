import type { NextRequest } from 'next/server';
import { haversineDistance } from '@/lib/calculator-logic';
import { STORE_LOCATION } from '@/lib/store-location';

const SERVICE_RADIUS_KM = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 6;
const MAX_TRACKED_CLIENTS = 1_000;

interface RateBucket {
  count: number;
  windowStartedAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

export type DeliveryQuoteGuardResult =
  | { allowed: true }
  | { allowed: false; code: 'OUTSIDE_SERVICE_AREA' | 'RATE_LIMITED' };

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwardedFor || request.headers.get('x-real-ip')?.trim() || 'unknown-client';
}

function pruneRateBuckets(now: number): void {
  for (const [key, bucket] of rateBuckets) {
    if (now - bucket.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
      rateBuckets.delete(key);
    }
  }

  while (rateBuckets.size >= MAX_TRACKED_CLIENTS) {
    const oldestKey = rateBuckets.keys().next().value as string | undefined;
    if (!oldestKey) break;
    rateBuckets.delete(oldestKey);
  }
}

export function guardDeliveryQuoteRequest(
  request: NextRequest,
  destinationLatitude: number,
  destinationLongitude: number,
  now = Date.now(),
): DeliveryQuoteGuardResult {
  const straightLineDistanceKm = haversineDistance(
    STORE_LOCATION.lat,
    STORE_LOCATION.lng,
    destinationLatitude,
    destinationLongitude,
  );
  if (straightLineDistanceKm > SERVICE_RADIUS_KM) {
    return { allowed: false, code: 'OUTSIDE_SERVICE_AREA' };
  }

  pruneRateBuckets(now);
  const clientKey = getClientKey(request);
  const existing = rateBuckets.get(clientKey);
  const bucket = existing && now - existing.windowStartedAt < RATE_LIMIT_WINDOW_MS
    ? existing
    : { count: 0, windowStartedAt: now };

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    rateBuckets.set(clientKey, bucket);
    return { allowed: false, code: 'RATE_LIMITED' };
  }

  bucket.count += 1;
  rateBuckets.set(clientKey, bucket);
  return { allowed: true };
}

export function resetDeliveryQuoteGuardForTests(): void {
  rateBuckets.clear();
}
