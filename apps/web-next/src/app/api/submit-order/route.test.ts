import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { ProxyTransportError } from '@/lib/trpc-client';

const { mockCreateMutation, mockCreateProxyClient, mockPersistLeadEvent } =
  vi.hoisted(() => ({
    mockCreateMutation: vi.fn(),
    mockCreateProxyClient: vi.fn(),
    mockPersistLeadEvent: vi.fn(),
  }));

vi.mock('@/lib/trpc-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/trpc-client')>();
  return { ...actual, createProxyClient: mockCreateProxyClient };
});

vi.mock('@/lib/lead-db', () => ({
  persistLeadEvent: mockPersistLeadEvent,
}));

import { POST } from './route';

const baseBody = {
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
  return new NextRequest('http://localhost/api/submit-order', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/submit-order', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateProxyClient.mockReturnValue({
      order: { create: { mutate: mockCreateMutation } },
    });
    mockCreateMutation.mockResolvedValue({
      id: 'order-123',
      orderNumber: 'RNT-260920-00001',
      publicToken: 'public-token',
      status: 'DRAFT',
      orderUrl: 'https://santi.test/pesanan/public-token',
    });
    mockPersistLeadEvent.mockResolvedValue({
      configured: false,
      persisted: false,
      record: {},
    });
  });

  it('returns a safe 503 when the proxy returns HTML or cannot be reached', async () => {
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

  it('keeps successful order and lead tracking responses correlated', async () => {
    const response = await POST(createRequest());

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        id: 'order-123',
        leadTracking: {
          eventType: 'form_submit',
          eventId: expect.stringMatching(/^form-/),
        },
      }),
    );
    expect(mockPersistLeadEvent).toHaveBeenCalledTimes(1);
  });
});
