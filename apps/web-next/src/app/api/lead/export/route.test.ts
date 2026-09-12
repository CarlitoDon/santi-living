import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { isLeadDbConfiguredMock, queryLeadEventsMock } = vi.hoisted(() => ({
  isLeadDbConfiguredMock: vi.fn(),
  queryLeadEventsMock: vi.fn(),
}));

vi.mock('@/lib/lead-db', () => ({
  isLeadDbConfigured: isLeadDbConfiguredMock,
  queryLeadEvents: queryLeadEventsMock,
}));

vi.mock('@/lib/lead-export', () => ({
  leadRowsToCsv: vi.fn(() => 'event_id\n'),
}));

import { GET } from './route';

describe('GET /api/lead/export', () => {
  beforeEach(() => {
    isLeadDbConfiguredMock.mockReset();
    queryLeadEventsMock.mockReset();
    process.env.LEAD_EVENTS_ADMIN_TOKEN = 'test-admin-token';
  });

  it('does not expose storage error details', async () => {
    isLeadDbConfiguredMock.mockReturnValue(true);
    queryLeadEventsMock.mockRejectedValue(
      new Error('database password must never appear in a response'),
    );

    const response = await GET(new NextRequest('http://localhost/api/lead/export', {
      headers: { authorization: 'Bearer test-admin-token' },
    }));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: {
        code: 'EXPORT_ERROR',
        message: 'Lead export is temporarily unavailable',
      },
    });
  });
});
