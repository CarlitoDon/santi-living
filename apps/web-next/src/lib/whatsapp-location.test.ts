import { describe, expect, it } from 'vitest';
import { buildWhatsAppLocationText } from '@/lib/whatsapp-location';

const location = {
  addressText: 'Jl. Contoh No. 7, Sleman',
  latitude: -7.8000123,
  longitude: 110.3999877,
};

describe('buildWhatsAppLocationText', () => {
  it('adds the precise address, coordinate link, and only the final delivery fee', () => {
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
    expect(message).toContain('Estimasi ongkir antar-jemput: Rp50.000');
    expect(message).not.toContain('Jarak berkendara');
    expect(message).not.toContain('Rumus ongkir');
    expect(message).not.toContain('dibulatkan');
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

  it('does not disclose distance or calculation details', () => {
    const message = buildWhatsAppLocationText('Halo Admin', {
      ...location,
      quote: {
        distanceKm: 12.3,
        deliveryFee: 50_000,
        source: 'google_routes',
      },
    });

    expect(message).toContain('Estimasi ongkir antar-jemput: Rp50.000');
    expect(message).not.toContain('12,300');
    expect(message).not.toContain('Rumus');
  });

  it('does not append the precise location block twice', () => {
    const initial = 'Google Maps (lokasi presisi):\nhttps://example.com';
    const message = buildWhatsAppLocationText(initial, location);

    expect(message).toBe(`${initial}\n\nAlamat pengiriman:\nJl. Contoh No. 7, Sleman`);
  });
});
