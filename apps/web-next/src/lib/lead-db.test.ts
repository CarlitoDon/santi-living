import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { LeadEventSchema } from './lead-attribution';

const { neonMock, reverseGeocodeLeadLocationMock, sqlMock } = vi.hoisted(() => ({
  neonMock: vi.fn(),
  reverseGeocodeLeadLocationMock: vi.fn(),
  sqlMock: vi.fn(),
}));

vi.mock('@neondatabase/serverless', () => ({ neon: neonMock }));
vi.mock('./lead-geocode', () => ({
  reverseGeocodeLeadLocation: reverseGeocodeLeadLocationMock,
}));

import { persistLeadEvent } from './lead-db';

const originalDatabaseUrl = process.env.DATABASE_URL;
const receivedAt = '2026-09-13T00:00:00.000Z';

describe('persistLeadEvent location trust boundary', () => {
  beforeEach(() => {
    process.env.DATABASE_URL = 'postgres://test';
    neonMock.mockReturnValue(sqlMock);
    sqlMock.mockReset();
    sqlMock.mockResolvedValue([]);
    reverseGeocodeLeadLocationMock.mockReset();
  });

  afterAll(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  it('uses server reverse geocoding instead of a client-supplied service-area city', async () => {
    reverseGeocodeLeadLocationMock.mockResolvedValue({
      geocode_status: 'success',
      geocode_source: 'nominatim',
      geocode_city: 'Klaten',
    });

    const input = LeadEventSchema.parse({
      event_id: 'lead-location-spoof-123',
      event_type: 'whatsapp_click',
      city: 'Sleman',
      geocode_city: 'Sleman',
      latitude: -7.7,
      longitude: 110.6,
      location_permission: 'granted',
      geocode_status: 'success',
    });

    const result = await persistLeadEvent(input.event_id as string, input, receivedAt, { geocode: true });

    expect(reverseGeocodeLeadLocationMock).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: -7.7, longitude: 110.6 }),
    );
    expect(result.cityClassification).toBe('out_of_service');
    expect(result.record.city).toBe('Klaten');
    expect(result.record.geocode_status).toBe('success');
  });

  it('fails closed when a WhatsApp event has no coordinates', async () => {
    const input = LeadEventSchema.parse({
      event_id: 'lead-location-missing-123',
      event_type: 'whatsapp_click',
      city: 'Sleman',
      geocode_city: 'Sleman',
      geocode_status: 'success',
    });

    const result = await persistLeadEvent(input.event_id as string, input, receivedAt, { geocode: true });

    expect(reverseGeocodeLeadLocationMock).not.toHaveBeenCalled();
    expect(result.cityClassification).toBe('unknown');
    expect(result.record.city).toBe('');
    expect(result.record.geocode_status).toBe('not_requested');
  });

  it('does not qualify when server reverse geocoding fails', async () => {
    reverseGeocodeLeadLocationMock.mockResolvedValue({
      geocode_status: 'failed',
      geocode_source: 'nominatim',
    });

    const input = LeadEventSchema.parse({
      event_id: 'lead-location-failed-123',
      event_type: 'whatsapp_click',
      city: 'Sleman',
      latitude: -7.8,
      longitude: 110.4,
      location_permission: 'granted',
    });

    const result = await persistLeadEvent(input.event_id as string, input, receivedAt, { geocode: true });

    expect(result.cityClassification).toBe('unknown');
    expect(result.record.city).toBe('');
    expect(result.record.geocode_status).toBe('failed');
  });

  it('preserves checkout city data when server geocoding is not requested', async () => {
    const input = LeadEventSchema.parse({
      event_id: 'form-location-preserved-123',
      event_type: 'form_submit',
      city: 'Sleman',
    });

    const result = await persistLeadEvent(input.event_id as string, input, receivedAt, { geocode: false });

    expect(reverseGeocodeLeadLocationMock).not.toHaveBeenCalled();
    expect(result.cityClassification).toBe('service_area');
    expect(result.record.city).toBe('Sleman');
  });
});
