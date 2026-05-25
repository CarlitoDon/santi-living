import { describe, expect, it } from 'vitest';
import { classifyLeadCity, LeadEventSchema } from './lead-attribution';

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

describe('classifyLeadCity', () => {
  it('classifies out-of-service cities', () => {
    expect(classifyLeadCity('Klaten')).toBe('out_of_service');
    expect(classifyLeadCity('Semanu, Gunung Kidul')).toBe('out_of_service');
  });

  it('classifies service-area cities', () => {
    expect(classifyLeadCity('Sleman')).toBe('service_area');
    expect(classifyLeadCity('Kota Yogyakarta')).toBe('service_area');
  });
});
