import type { LeadEventInput } from './lead-attribution';

export type LeadGeocodeStatus = 'not_requested' | 'success' | 'failed' | 'timeout' | 'unavailable';

export interface LeadGeocodeResult {
  geocode_status: LeadGeocodeStatus;
  geocode_source?: string;
  geocode_city?: string;
  geocode_kecamatan?: string;
  geocode_kelurahan?: string;
  geocode_full_address?: string;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? value as Record<string, unknown> : null;
}

function textField(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function parseNominatimResult(data: unknown): LeadGeocodeResult {
  const payload = asRecord(data);
  const address = asRecord(payload?.address);
  if (!payload || !address) {
    return { geocode_status: 'unavailable', geocode_source: 'nominatim' };
  }

  const geocodeKelurahan =
    textField(address, 'suburb') ||
    textField(address, 'village') ||
    textField(address, 'hamlet') ||
    textField(address, 'neighbourhood');
  const geocodeKecamatan =
    textField(address, 'city_district') ||
    textField(address, 'municipality') ||
    textField(address, 'district');
  const geocodeCity =
    textField(address, 'county') ||
    textField(address, 'city') ||
    textField(address, 'town') ||
    geocodeKecamatan;
  const fullAddress = typeof payload.display_name === 'string'
    ? payload.display_name
    : [
        textField(address, 'road'),
        geocodeKelurahan,
        geocodeKecamatan,
        geocodeCity,
        textField(address, 'state'),
        textField(address, 'postcode'),
      ].filter(Boolean).join(', ');

  return {
    geocode_status: geocodeCity || fullAddress ? 'success' : 'unavailable',
    geocode_source: 'nominatim',
    geocode_city: geocodeCity,
    geocode_kecamatan: geocodeKecamatan,
    geocode_kelurahan: geocodeKelurahan,
    geocode_full_address: fullAddress || undefined,
  };
}

export async function reverseGeocodeLeadLocation(
  input: Pick<LeadEventInput, 'latitude' | 'longitude'>,
  timeoutMs = 1800,
): Promise<LeadGeocodeResult> {
  if (typeof input.latitude !== 'number' || typeof input.longitude !== 'number') {
    return { geocode_status: 'not_requested' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'json');
  url.searchParams.set('lat', String(input.latitude));
  url.searchParams.set('lon', String(input.longitude));
  url.searchParams.set('zoom', '18');
  url.searchParams.set('addressdetails', '1');

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'id',
        'User-Agent': 'SantiLiving/1.0 (https://santiliving.com; contact@santiliving.com)',
      },
    });

    if (!response.ok) {
      return { geocode_status: 'failed', geocode_source: 'nominatim' };
    }

    return parseNominatimResult(await response.json());
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { geocode_status: 'timeout', geocode_source: 'nominatim' };
    }
    return { geocode_status: 'failed', geocode_source: 'nominatim' };
  } finally {
    clearTimeout(timeout);
  }
}
