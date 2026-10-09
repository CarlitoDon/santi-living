import { describe, expect, it } from 'vitest';
import { buildCalculatorWhatsAppMessage } from '@/utils/whatsapp';

describe('buildCalculatorWhatsAppMessage', () => {
  it('includes coordinates link and delivery fee when provided', () => {
    const message = buildCalculatorWhatsAppMessage({
      items: [{ name: 'Kasur Busa Single', category: 'mattress', quantity: 1 }],
      duration: 3,
      startDate: '2026-10-10',
      address: {
        street: 'Jl. Kaliurang KM 5',
        kelurahan: 'Caturtunggal',
        kecamatan: 'Depok',
        kota: 'Sleman',
        provinsi: 'D.I. Yogyakarta',
        zip: '55281',
        lat: '-7.7654321',
        lng: '110.3845123',
      },
      deliveryFee: 35000,
    });

    expect(message).toContain('Titik Lokasi (Google Maps):');
    expect(message).toContain('https://maps.google.com/?q=-7.7654321,110.3845123');
    expect(message).toContain('Estimasi ongkir antar-jemput: Rp35.000');
  });

  it('omits coordinates and delivery fee when not available or zero', () => {
    const message = buildCalculatorWhatsAppMessage({
      items: [{ name: 'Kasur Busa Single', category: 'mattress', quantity: 1 }],
      duration: 3,
      startDate: '2026-10-10',
      address: {
        street: 'Jl. Kaliurang KM 5',
      },
      deliveryFee: 0,
    });

    expect(message).not.toContain('Titik Lokasi (Google Maps):');
    expect(message).not.toContain('Estimasi ongkir antar-jemput:');
  });

  it('supports numeric coordinates', () => {
    const message = buildCalculatorWhatsAppMessage({
      items: [],
      duration: 1,
      startDate: null,
      address: {
        lat: -7.8000123 as unknown as string,
        lng: 110.3999877 as unknown as string,
      },
    });

    expect(message).toContain('Titik Lokasi (Google Maps):');
    expect(message).toContain('https://maps.google.com/?q=-7.8000123,110.3999877');
  });
});
