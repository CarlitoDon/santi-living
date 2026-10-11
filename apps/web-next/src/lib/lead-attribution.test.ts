import { describe, expect, it } from 'vitest';
import { buildLeadLogRecord, LeadEventSchema } from './lead-attribution';

describe('LeadEventSchema', () => {
  it('normalizes empty attribution fields to undefined', () => {
    const parsed = LeadEventSchema.parse({
      event_type: 'whatsapp_click',
      source: '',
      medium: '  ',
      cta_source: ' hero ',
    });

    expect(parsed.source).toBeUndefined();
    expect(parsed.medium).toBeUndefined();
    expect(parsed.cta_source).toBe('hero');
  });

  it('keeps location permission denials without requiring coordinates', () => {
    const parsed = LeadEventSchema.parse({
      event_id: 'lead-test-123',
      event_type: 'whatsapp_click',
      location_permission: 'denied',
    });

    expect(parsed.location_permission).toBe('denied');
    expect(parsed.latitude).toBeUndefined();
  });
});

describe('classifyLeadCity via buildLeadLogRecord', () => {
  it('classifies out-of-service cities', () => {
    expect(
      buildLeadLogRecord('ev-1', { event_type: 'whatsapp_click', city: 'Klaten' }, '').city_classification,
    ).toBe('out_of_service');
    expect(
      buildLeadLogRecord('ev-2', { event_type: 'whatsapp_click', city: 'Semanu, Gunung Kidul' }, '').city_classification,
    ).toBe('out_of_service');
  });

  it('classifies service-area cities', () => {
    expect(
      buildLeadLogRecord('ev-3', { event_type: 'whatsapp_click', city: 'Sleman' }, '').city_classification,
    ).toBe('service_area');
    expect(
      buildLeadLogRecord('ev-4', { event_type: 'whatsapp_click', city: 'Kota Yogyakarta' }, '').city_classification,
    ).toBe('service_area');
  });
});
