import { describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { persistLeadEventMock } = vi.hoisted(() => ({
  persistLeadEventMock: vi.fn(),
}));

vi.mock('@/lib/lead-db', () => ({
  persistLeadEvent: persistLeadEventMock,
}));

import { POST } from './route';

describe('POST /api/lead/track', () => {
  it('filters automated user agents before writing to Neon', async () => {
    const response = await POST(new NextRequest('http://localhost/api/lead/track', {
      method: 'POST',
      body: JSON.stringify({
        event_id: 'lead-crawler-123',
        event_type: 'whatsapp_click',
        user_agent: 'ExampleCrawler/1.0',
      }),
      headers: { 'content-type': 'application/json' },
    }));

    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      persisted: false,
      cityClassification: 'unknown',
      filtered: true,
    });
    expect(persistLeadEventMock).not.toHaveBeenCalled();
  });

  it('does not expose persistence error details', async () => {
    persistLeadEventMock.mockRejectedValue(
      new Error('Neon connection failed with a private endpoint'),
    );

    const response = await POST(new NextRequest('http://localhost/api/lead/track', {
      method: 'POST',
      body: JSON.stringify({
        event_id: 'lead-test-123',
        event_type: 'phone_click',
      }),
      headers: { 'content-type': 'application/json' },
    }));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: {
        code: 'TRACKING_ERROR',
        message: 'Lead tracking is temporarily unavailable',
      },
    });
  });
});
