import { describe, expect, it } from 'vitest';
import { buildWhatsAppLocationText } from '@/lib/whatsapp-location';

const location = {
  addressText: 'Jl. Contoh No. 7, Sleman',
  latitude: -7.8000123,
  longitude: 110.3999877,
};

describe('buildWhatsAppLocationText', () => {
  it('adds the precise address, coordinate link, driving distance, and delivery fee', () => {
    const message = buildWhatsAppLocationText(
      'Halo Admin\n\nAlamat pengiriman:\n{alamat lengkap}',
      {
        ...location,
        quote: {
          distanceKm: 12.345,
          deliveryFee: 50_000,
          source: 'google_routes',
        },
      },
    );

    expect(message).toContain('Alamat pengiriman:\nJl. Contoh No. 7, Sleman');
    expect(message).toContain('Google Maps (lokasi presisi):');
    expect(message).toContain('query=-7.8000123%2C110.3999877');
    expect(message).toContain('Jarak berkendara dari workshop: 12,345 km');
    expect(message).toContain('Rumus ongkir: 12,345 × 4 ÷ 10 × Rp10.000 = Rp49.380');
    expect(message).toContain('Estimasi ongkir antar-jemput (dibulatkan ke atas Rp1.000): Rp50.000');
  });

  it('does not invent a fee when Google Routes is unavailable', () => {
    const message = buildWhatsAppLocationText('Halo Admin', {
      ...location,
      quote: null,
    });

    expect(message).toContain('Google Maps (lokasi presisi):');
    expect(message).toContain('Estimasi ongkir: belum dapat dihitung otomatis');
    expect(message).not.toContain('Estimasi ongkir antar-jemput:');
  });

  it('keeps three distance decimals so the displayed formula is reproducible', () => {
    const message = buildWhatsAppLocationText('Halo Admin', {
      ...location,
      quote: {
        distanceKm: 12.3,
        deliveryFee: 50_000,
        source: 'google_routes',
      },
    });

    expect(message).toContain('Jarak berkendara dari workshop: 12,300 km');
    expect(message).toContain('Rumus ongkir: 12,300 × 4 ÷ 10 × Rp10.000 = Rp49.200');
  });

  it('does not append the precise location block twice', () => {
    const initial = 'Google Maps (lokasi presisi):\nhttps://example.com';
    const message = buildWhatsAppLocationText(initial, location);

    expect(message).toBe(`${initial}\n\nAlamat pengiriman:\nJl. Contoh No. 7, Sleman`);
  });
});
