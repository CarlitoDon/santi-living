import { describe, expect, it } from 'vitest';
import type { LeadExportRow } from './lead-db';
import { leadRowsToCsv } from './lead-export';

const baseRow: LeadExportRow = {
  event_id: 'lead-1',
  event_type: 'whatsapp_click',
  source: 'google',
  medium: 'cpc',
  campaign: 'starter',
  term: null,
  content: null,
  cta_source: 'hero',
  cta_location: 'home',
  landing_page: '/',
  city: 'Klaten',
  city_classification: 'out_of_service',
  device: null,
  gclid: null,
  wbraid: null,
  gbraid: null,
  fbclid: null,
  location_permission: 'granted',
  latitude: -7.7,
  longitude: 110.6,
  location_accuracy_m: 20,
  geocode_status: 'success',
  geocode_source: 'nominatim',
  geocode_city: 'Klaten',
  geocode_kecamatan: null,
  geocode_kelurahan: null,
  geocode_full_address: 'Jalan Contoh, Klaten',
  user_agent: 'test',
  referrer: null,
  event_timestamp: '2026-05-25T00:00:00.000Z',
  received_at: '2026-05-25T00:00:00.000Z',
  updated_at: '2026-05-25T00:00:00.000Z',
  raw_payload: {},
};

describe('leadRowsToCsv', () => {
  it('exports stable CSV with escaped text', () => {
    const csv = leadRowsToCsv([
      { ...baseRow, geocode_full_address: 'Jalan "Contoh", Klaten' },
    ]);

    expect(csv).toContain('event_id,event_type,source');
    expect(csv).toContain('"Jalan ""Contoh"", Klaten"');
  });
});
