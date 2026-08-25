import { describe, expect, it } from 'vitest';
import {
  getGoogleMapsCoordinateUrl,
  getStoreMapEmbedUrl,
  STORE_LOCATION,
} from '@/lib/store-location';

describe('store location URLs', () => {
  it('builds a precise Google Maps link for customer coordinates', () => {
    const url = new URL(getGoogleMapsCoordinateUrl(-7.8000123, 110.3999877));

    expect(url.hostname).toBe('www.google.com');
    expect(url.searchParams.get('query')).toBe('-7.8000123,110.3999877');
  });

  it('uses the canonical workshop point in the map embed', () => {
    const url = new URL(getStoreMapEmbedUrl());

    expect(url.searchParams.get('q')).toBe(`${STORE_LOCATION.lat},${STORE_LOCATION.lng}`);
    expect(url.searchParams.get('z')).toBe('17');
    expect(url.searchParams.get('output')).toBe('embed');
  });
});
