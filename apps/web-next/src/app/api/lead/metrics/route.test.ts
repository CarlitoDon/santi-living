import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { isLeadDbConfiguredMock, queryLeadEventMetricsMock } = vi.hoisted(() => ({
  isLeadDbConfiguredMock: vi.fn(),
  queryLeadEventMetricsMock: vi.fn(),
}));

vi.mock('@/lib/lead-db', () => ({
  isLeadDbConfigured: isLeadDbConfiguredMock,
  queryLeadEventMetrics: queryLeadEventMetricsMock,
}));

import { GET } from './route';

describe('GET /api/lead/metrics', () => {
  beforeEach(() => {
    isLeadDbConfiguredMock.mockReset();
    queryLeadEventMetricsMock.mockReset();
    process.env.LEAD_EVENTS_ADMIN_TOKEN = 'test-admin-token';
  });

  it('rejects requests without the admin token', async () => {
    isLeadDbConfiguredMock.mockReturnValue(true);

    const response = await GET(new NextRequest('http://localhost/api/lead/metrics'));

    expect(response.status).toBe(401);
    expect(queryLeadEventMetricsMock).not.toHaveBeenCalled();
  });

  it('reports an unavailable database without querying it', async () => {
    isLeadDbConfiguredMock.mockReturnValue(false);

    const response = await GET(new NextRequest('http://localhost/api/lead/metrics', {
      headers: { authorization: 'Bearer test-admin-token' },
    }));

    expect(response.status).toBe(503);
    expect(queryLeadEventMetricsMock).not.toHaveBeenCalled();
  });

  it('returns aggregate metrics and preserves the requested range', async () => {
    isLeadDbConfiguredMock.mockReturnValue(true);
    queryLeadEventMetricsMock.mockResolvedValue({
      from: '2026-09-01T00:00:00Z',
      to: '2026-09-12T00:00:00Z',
      total_events: 3,
      distinct_event_ids: 3,
      qualified_whatsapp_clicks: 1,
      geocode_successes: 2,
      geocode_failures: 1,
      geocode_missing: 0,
      by_event_type: [{ key: 'whatsapp_click', count: 2 }],
      by_city_classification: [{ key: 'service_area', count: 1 }],
      by_geocode_status: [{ key: 'success', count: 2 }],
      by_source_campaign: [{ source: 'google', campaign: 'brand', count: 2 }],
      daily: [],
    });

    const response = await GET(new NextRequest(
      'http://localhost/api/lead/metrics?from=2026-09-01T00:00:00Z&to=2026-09-12T00:00:00Z',
      { headers: { authorization: 'Bearer test-admin-token' } },
    ));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      source: 'neon_lead_events',
      metrics: { total_events: 3, qualified_whatsapp_clicks: 1 },
    });
    expect(queryLeadEventMetricsMock).toHaveBeenCalledWith({
      from: '2026-09-01T00:00:00Z',
      to: '2026-09-12T00:00:00Z',
    });
  });
});
