import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { ProxyTransportError } from '@/lib/trpc-client';

const { mockCreateMutation, mockCreateProxyClient } = vi.hoisted(() => ({
  mockCreateMutation: vi.fn(),
  mockCreateProxyClient: vi.fn(),
}));

vi.mock('@/lib/trpc-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/trpc-client')>();
  return { ...actual, createProxyClient: mockCreateProxyClient };
});

import { POST } from './route';

const baseBody = {
  token: 'public-order-token',
  customerName: 'Budi Santoso',
  customerWhatsapp: '081234567890',
  deliveryAddress: 'Jl. Malioboro No. 1, Yogyakarta',
  addressFields: {
    street: 'Jl. Malioboro No. 1',
    district: 'Gedong Tengen',
    city: 'Yogyakarta',
  },
  items: [
    {
      id: 'package-single-standard',
      name: 'Single Standard',
      category: 'package',
      quantity: 1,
      pricePerDay: 35000,
      includes: ['kasur busa 90x200'],
    },
  ],
  totalPrice: 85000,
  orderDate: '2026-09-20',
  endDate: '2026-09-22',
  duration: 2,
  deliveryFee: 15000,
  paymentMethod: 'qris',
};

function createRequest(body: unknown = baseBody) {
  return new NextRequest('http://localhost/api/update-order', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/update-order', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateProxyClient.mockReturnValue({
      order: { update: { mutate: mockCreateMutation } },
    });
    mockCreateMutation.mockResolvedValue({ ok: true });
  });

  it('returns a safe 503 when the proxy returns a non-JSON response', async () => {
    mockCreateMutation.mockRejectedValueOnce(
      new ProxyTransportError('Proxy returned a non-JSON response (HTTP 404)', 404),
    );

    const response = await POST(createRequest());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'PROXY_UNAVAILABLE',
        message:
          'Sistem pemesanan sedang mengalami gangguan sementara. Silakan hubungi admin via WhatsApp.',
      },
    });
  });

  it('does not expose unexpected upstream error details', async () => {
    mockCreateMutation.mockRejectedValueOnce(new Error('Unexpected end of JSON input'));

    const response = await POST(createRequest());

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'UPSTREAM_ERROR',
        message:
          'Sistem pemesanan sedang mengalami gangguan sementara. Silakan hubungi admin via WhatsApp.',
      },
    });
  });
});
