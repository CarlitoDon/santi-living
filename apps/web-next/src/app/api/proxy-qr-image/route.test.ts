import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

import { GET } from './route';

describe('GET /api/proxy-qr-image', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('blocks non-https and foreign domains (e.g. evil.com/midtrans.com, localhost)', async () => {
    const invalidUrls = [
      'evil.com/midtrans.com',
      'http://evil.com/midtrans.com',
      'https://evil.com/midtrans.com',
      'http://localhost',
      'https://localhost',
      'http://api.midtrans.com',
      'https://fakemidtrans.com',
    ];

    for (const url of invalidUrls) {
      const response = await GET(
        new NextRequest(`http://localhost/api/proxy-qr-image?url=${encodeURIComponent(url)}`),
      );
      expect([400, 403]).toContain(response.status);
    }

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('permits https://api.midtrans.com', async () => {
    const mockImageBuffer = new Uint8Array([1, 2, 3]).buffer;
    fetchMock.mockResolvedValue(
      new Response(mockImageBuffer, {
        status: 200,
        headers: { 'Content-Type': 'image/png' },
      }),
    );

    const targetUrl = 'https://api.midtrans.com/v2/qris/123/qr-code';
    const response = await GET(
      new NextRequest(`http://localhost/api/proxy-qr-image?url=${encodeURIComponent(targetUrl)}`),
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toBe(targetUrl);
    expect(response.headers.get('Content-Type')).toBe('image/png');
  });
});
