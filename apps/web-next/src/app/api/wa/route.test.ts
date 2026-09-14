import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GoogleRoutesError } from '@/lib/google-routes';
import { resetDeliveryQuoteGuardForTests } from '@/lib/delivery-quote-guard';

const { getGoogleDrivingQuoteMock, persistLeadEventMock } = vi.hoisted(() => ({
  getGoogleDrivingQuoteMock: vi.fn(),
  persistLeadEventMock: vi.fn(),
}));

vi.mock('@/lib/google-routes', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/google-routes')>();
  return {
    ...original,
    getGoogleDrivingQuote: getGoogleDrivingQuoteMock,
  };
});

vi.mock('@/lib/lead-db', () => ({
  persistLeadEvent: persistLeadEventMock,
}));

import { GET } from '@/app/api/wa/route';

describe('GET /api/wa', () => {
  beforeEach(() => {
    resetDeliveryQuoteGuardForTests();
    getGoogleDrivingQuoteMock.mockReset();
    getGoogleDrivingQuoteMock.mockResolvedValue(null);
    persistLeadEventMock.mockReset();
    persistLeadEventMock.mockResolvedValue({
      configured: false,
      persisted: false,
      record: null,
    });
  });

  function buildRequest(ip = '203.0.113.20', eventId?: string): NextRequest {
    const url = new URL('http://localhost/api/wa');
    url.searchParams.set('to', '6289519119092');
    url.searchParams.set('text', 'Halo Admin\n\nAlamat pengiriman:\n{alamat lengkap}');
    url.searchParams.set('address_text', 'Jl. Contoh No. 7, Sleman');
    url.searchParams.set('latitude', '-7.8000123');
    url.searchParams.set('longitude', '110.3999877');
    if (eventId) url.searchParams.set('event_id', eventId);
    return new NextRequest(url, { headers: { 'x-forwarded-for': ip } });
  }

  it('redirects with the precise location and Google driving quote in the message', async () => {
    getGoogleDrivingQuoteMock.mockResolvedValue({
      distanceKm: 12.345,
      deliveryFee: 50_000,
      source: 'google_routes',
    });
    const response = await GET(buildRequest());
    const redirect = new URL(response.headers.get('location') as string);
    const message = redirect.searchParams.get('text') as string;

    expect(response.status).toBe(307);
    expect(redirect.origin).toBe('https://wa.me');
    expect(message).toContain('Alamat pengiriman:\nJl. Contoh No. 7, Sleman');
    expect(message).toContain('Google Maps (lokasi presisi):');
    expect(message).toContain('query=-7.8000123%2C110.3999877');
    expect(message).toContain('Estimasi ongkir antar-jemput: Rp50.000');
    expect(message).not.toContain('Jarak berkendara');
    expect(message).not.toContain('Rumus ongkir');
    expect(message).not.toContain('dibulatkan');
    expect(getGoogleDrivingQuoteMock).toHaveBeenCalledWith(-7.8000123, 110.3999877);
  });

  it('does not persist direct redirects without a client-generated event id', async () => {
    const response = await GET(buildRequest());

    expect(response.status).toBe(307);
    expect(persistLeadEventMock).not.toHaveBeenCalled();
  });

  it('persists redirects carrying a client-generated event id', async () => {
    const request = buildRequest('203.0.113.20', 'lead-client-event-123');

    await GET(request);

    expect(persistLeadEventMock).toHaveBeenCalledWith(
      'lead-client-event-123',
      expect.objectContaining({ event_id: 'lead-client-event-123', event_type: 'whatsapp_click', city: undefined }),
      expect.any(String),
      { geocode: false },
    );
  });

  it('keeps automated redirects working without persisting or requesting a quote', async () => {
    const url = new URL(buildRequest('203.0.113.25', 'lead-crawler-event-123').url);
    url.searchParams.set('latitude', '-7.8000123');
    url.searchParams.set('longitude', '110.3999877');
    const response = await GET(new NextRequest(url, {
      headers: {
        'user-agent': 'ExampleCrawler/1.0',
        'x-forwarded-for': '203.0.113.25',
      },
    }));

    expect(response.status).toBe(307);
    expect(persistLeadEventMock).not.toHaveBeenCalled();
    expect(getGoogleDrivingQuoteMock).not.toHaveBeenCalled();
  });

  it('does not trust client-supplied geocode fields on tracked redirects', async () => {
    const url = new URL(buildRequest('203.0.113.24', 'lead-client-event-789').url);
    url.searchParams.set('city', 'Sleman');
    url.searchParams.set('geocode_status', 'success');
    url.searchParams.set('geocode_source', 'client');
    url.searchParams.set('geocode_city', 'Sleman');
    url.searchParams.set('geocode_kecamatan', 'Depok');
    url.searchParams.set('geocode_kelurahan', 'Condongcatur');
    url.searchParams.set('geocode_full_address', 'Alamat palsu');

    await GET(new NextRequest(url, { headers: { 'x-forwarded-for': '203.0.113.24' } }));

    expect(persistLeadEventMock).toHaveBeenCalledWith(
      'lead-client-event-789',
      expect.objectContaining({
        city: undefined,
        geocode_status: undefined,
        geocode_source: undefined,
        geocode_city: undefined,
        geocode_kecamatan: undefined,
        geocode_kelurahan: undefined,
        geocode_full_address: undefined,
      }),
      expect.any(String),
      { geocode: false },
    );
  });

  it.each([
    ['missing key', new GoogleRoutesError('NOT_CONFIGURED', 'missing key')],
    ['timeout', new GoogleRoutesError('UPSTREAM_ERROR', 'request timed out')],
    ['non-2xx response', new GoogleRoutesError('UPSTREAM_ERROR', 'status 429')],
    ['malformed response', new GoogleRoutesError('INVALID_RESPONSE', 'invalid payload')],
  ])('preserves the precise location without inventing a fee on %s', async (_name, error) => {
    getGoogleDrivingQuoteMock.mockRejectedValue(error);

    const response = await GET(buildRequest('203.0.113.21'));
    const redirect = new URL(response.headers.get('location') as string);
    const message = redirect.searchParams.get('text') as string;

    expect(response.status).toBe(307);
    expect(message).toContain('Alamat pengiriman:\nJl. Contoh No. 7, Sleman');
    expect(message).toContain('Google Maps (lokasi presisi):');
    expect(message).toContain('query=-7.8000123%2C110.3999877');
    expect(message).toContain('Estimasi ongkir: belum dapat dihitung otomatis');
    expect(message).not.toContain('Estimasi ongkir antar-jemput');
  });

  it('does not call Google for a destination outside the service radius', async () => {
    const url = new URL('http://localhost/api/wa');
    url.searchParams.set('text', 'Halo Admin');
    url.searchParams.set('address_text', 'Jakarta');
    url.searchParams.set('latitude', '-6.2');
    url.searchParams.set('longitude', '106.8');

    const response = await GET(new NextRequest(url, {
      headers: { 'x-forwarded-for': '203.0.113.22' },
    }));
    const message = new URL(response.headers.get('location') as string).searchParams.get('text') as string;

    expect(response.status).toBe(307);
    expect(getGoogleDrivingQuoteMock).not.toHaveBeenCalled();
    expect(message).toContain('Google Maps (lokasi presisi):');
    expect(message).toContain('Estimasi ongkir: belum dapat dihitung otomatis');
  });

  it('does not expose persistence error details', async () => {
    persistLeadEventMock.mockRejectedValue(
      new Error('Neon connection string must never reach the client'),
    );

    const response = await GET(buildRequest('203.0.113.23', 'lead-client-event-456'));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: {
        code: 'WA_REDIRECT_ERROR',
        message: 'WhatsApp redirect is temporarily unavailable',
      },
    });
  });
});
