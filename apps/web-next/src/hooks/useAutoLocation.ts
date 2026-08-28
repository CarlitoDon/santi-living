'use client';

import { useEffect, useRef } from 'react';
import { getCurrentLocation, reverseGeocode } from '@/scripts/geolocation';
import {
  hasManualLocationSelection,
  isDiyLocation,
  LOCATION_SELECTION_CACHE_KEY,
  publishLocationSelection,
  requestLocationPicker,
  type LocationSelection,
} from '@/lib/location-selection';

// Zod-less but safe: we own this exact shape, stored and read by us
type LocationDetail = LocationSelection;

function parseStoredLocation(raw: string): LocationDetail | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('coords' in parsed) ||
      !('address' in parsed)
    ) return null;

    const p = parsed as Record<string, unknown>;
    const coords = p['coords'] as Record<string, unknown>;
    const address = p['address'] as Record<string, unknown>;

    if (typeof coords?.['lat'] !== 'number' || typeof coords?.['lng'] !== 'number') return null;

    return {
      coords: { lat: coords['lat'] as number, lng: coords['lng'] as number },
      address: {
        street: typeof address?.['street'] === 'string' ? address['street'] : undefined,
        kelurahan: typeof address?.['kelurahan'] === 'string' ? address['kelurahan'] : undefined,
        kecamatan: typeof address?.['kecamatan'] === 'string' ? address['kecamatan'] : undefined,
        kota: typeof address?.['kota'] === 'string' ? address['kota'] : undefined,
        provinsi: typeof address?.['provinsi'] === 'string' ? address['provinsi'] : undefined,
        postcode: typeof address?.['postcode'] === 'string' ? address['postcode'] : undefined,
      },
      source: p['source'] === 'manual' ? 'manual' : 'automatic',
    };
  } catch {
    return null;
  }
}

function dispatchLocation(detail: LocationDetail): void {
  const source = detail.source ?? 'automatic';

  if (source !== 'manual' && hasManualLocationSelection()) {
    console.debug('[auto-location] Ignored late GPS result after manual selection.');
    return;
  }

  if (!isDiyLocation(detail)) {
    console.debug('[auto-location] Visitor is outside DIY; asking for the delivery destination.');
    requestLocationPicker('outside-diy');
    return;
  }

  const published = publishLocationSelection(detail, source);
  if (!published) {
    console.debug('[auto-location] Ignored late GPS result after manual selection.');
    return;
  }
  console.debug('[auto-location] ✅ Dispatched location to Calculator.');
}

/**
 * Auto-requests high-precision geolocation on the user's first scroll.
 *
 * Behavior:
 * - If a previous geocode result is cached in sessionStorage → replay it silently on mount
 *   (no GPS request, no permission prompt, just fills the form again)
 * - If no cached result → wait for first scroll → request GPS → cache & dispatch
 */
export function useAutoLocation({ enabled = true }: { enabled?: boolean } = {}) {
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // ── Case 1: Cached result from a previous GPS request this session ──
    const cached = sessionStorage.getItem(LOCATION_SELECTION_CACHE_KEY);
    if (cached) {
      const detail = parseStoredLocation(cached);
      if (detail) {
        console.debug('[auto-location] Replaying cached location (no GPS prompt).');
        // Delay to allow Calculator (Suspense) to finish mounting
        const timer = setTimeout(() => {
          // Re-read at delivery time: a newer map choice may have emitted before
          // Calculator's listener mounted, so the cache is the durable source.
          const latestRaw = sessionStorage.getItem(LOCATION_SELECTION_CACHE_KEY);
          const latestDetail = latestRaw ? parseStoredLocation(latestRaw) : null;
          if (latestDetail) dispatchLocation(latestDetail);
        }, 600);
        return () => clearTimeout(timer);
      }
    }

    // ── Case 2: First visit — wait for scroll to request GPS ──
    console.debug('[auto-location] No cached result. Waiting for first scroll...');

    const handleFirstScroll = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;

      console.debug('[auto-location] First scroll — requesting GPS...');
      window.removeEventListener('scroll', handleFirstScroll);
      void requestLocation();
    };

    window.addEventListener('scroll', handleFirstScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleFirstScroll);
  }, [enabled]);
}

async function requestLocation(): Promise<void> {
  try {
    console.debug('[auto-location] Requesting high-precision GPS...');
    const coords = await getCurrentLocation();
    console.debug('[auto-location] Got coords:', coords.latitude, coords.longitude);

    const address = await reverseGeocode(coords);
    console.debug('[auto-location] Geocoded:', address);

    const detail: LocationDetail = {
      coords: { lat: coords.latitude, lng: coords.longitude },
      address: {
        street: address.street,
        kelurahan: address.kelurahan,
        kecamatan: address.kecamatan,
        kota: address.kota,
        provinsi: address.provinsi,
        postcode: address.postcode,
      },
    };

    dispatchLocation(detail);
  } catch (error) {
    console.debug('[auto-location] Geolocation unavailable:', (error as Error).message);
  }
}
