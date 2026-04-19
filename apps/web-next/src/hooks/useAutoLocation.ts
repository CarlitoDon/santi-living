'use client';

import { useEffect, useRef } from 'react';
import { getCurrentLocation, reverseGeocode } from '@/scripts/geolocation';

// Zod-less but safe: we own this exact shape, stored and read by us
interface LocationDetail {
  coords: { lat: number; lng: number };
  address: {
    street?: string;
    kelurahan?: string;
    kecamatan?: string;
    kota?: string;
    provinsi?: string;
    postcode?: string;
  };
}

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
    };
  } catch {
    return null;
  }
}

function dispatchLocation(detail: LocationDetail): void {
  window.dispatchEvent(new CustomEvent('location-selected', { detail }));
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
    const cached = sessionStorage.getItem('sl_auto_location_result');
    if (cached) {
      const detail = parseStoredLocation(cached);
      if (detail) {
        console.debug('[auto-location] Replaying cached location (no GPS prompt).');
        // Delay to allow Calculator (Suspense) to finish mounting
        const timer = setTimeout(() => dispatchLocation(detail), 600);
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

    // Cache for future page loads in this session (no re-prompt)
    sessionStorage.setItem('sl_auto_location_result', JSON.stringify(detail));

    dispatchLocation(detail);
  } catch (error) {
    console.debug('[auto-location] Geolocation unavailable:', (error as Error).message);
  }
}

