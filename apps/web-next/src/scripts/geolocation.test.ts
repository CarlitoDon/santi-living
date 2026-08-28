import { describe, expect, it } from 'vitest';
import { formatAddress, resolveProvinceName } from './geolocation';

describe('reverse geocode address formatting', () => {
  const jakartaAddress = {
    road: 'Jalan Tebet Timur Dalam III M',
    village: 'Tebet Timur',
    suburb: 'Tebet',
    city: 'Jakarta Selatan',
    'ISO3166-2-lvl4': 'ID-JK',
    postcode: '12830',
  };
  const jakartaDisplayName =
    'Jalan Tebet Timur Dalam III M, RW 03, Tebet Timur, Tebet, Jakarta Selatan, Daerah Khusus Ibukota Jakarta, 12830, Indonesia';

  it('resolves Jakarta from its ISO code when Nominatim omits state', () => {
    const result = formatAddress(jakartaAddress, jakartaDisplayName);

    expect(result.provinsi).toBe('Daerah Khusus Ibukota Jakarta');
    expect(result.fullAddress).toContain('Daerah Khusus Ibukota Jakarta');
    expect(result.fullAddress).not.toContain('DI Yogyakarta');
  });

  it('resolves DIY from its ISO code without relying on a default', () => {
    expect(resolveProvinceName({ 'ISO3166-2-lvl4': 'ID-YO' })).toBe(
      'Daerah Istimewa Yogyakarta',
    );
  });

  it('leaves an unknown missing province empty instead of fabricating DIY', () => {
    expect(resolveProvinceName({ city: 'Kota Tidak Dikenal' })).toBe('');
  });

  it('preserves a non-DIY ISO code so classification fails closed', () => {
    expect(resolveProvinceName({ 'ISO3166-2-lvl4': 'ID-JT' })).toBe('ID-JT');
  });
});
