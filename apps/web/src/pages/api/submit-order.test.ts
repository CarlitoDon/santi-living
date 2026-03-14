import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateMutation, mockCreateProxyClient } = vi.hoisted(() => ({
  mockCreateMutation: vi.fn(),
  mockCreateProxyClient: vi.fn(),
}));

vi.mock("../../lib/trpc-client", () => ({
  createProxyClient: mockCreateProxyClient,
}));

import { POST } from "./submit-order";

const ORIGINAL_ENV = {
  SANTI_PROXY_URL: process.env.SANTI_PROXY_URL,
  PUBLIC_PROXY_URL: process.env.PUBLIC_PROXY_URL,
  PROXY_API_SECRET: process.env.PROXY_API_SECRET,
  PROXY_API_KEY: process.env.PROXY_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
};

const baseBody = {
  customerName: "Budi Santoso",
  customerWhatsapp: "081234567890",
  deliveryAddress: "Jl. Malioboro No. 1, Yogyakarta",
  addressFields: {
    street: "Jl. Malioboro No. 1",
    kelurahan: "Sosromenduran",
    kecamatan: "Gedong Tengen",
    kota: "Yogyakarta",
    provinsi: "DIY",
    zip: "55271",
    lat: "-7.7928",
    lng: "110.3658",
  },
  items: [
    {
      id: "package-single-standard",
      name: "Single Standard (Paket)",
      category: "package",
      quantity: 1,
      pricePerDay: 35000,
      includes: ["kasur busa 90x200", "sprei 90x200"],
    },
  ],
  totalPrice: 85000,
  orderDate: "2026-03-20",
  endDate: "2026-03-22",
  duration: 2,
  deliveryFee: 15000,
  paymentMethod: "qris",
  notes: "Tolong antar pagi hari",
  volumeDiscountAmount: 5000,
  volumeDiscountLabel: "Promo Maret",
};

const createRequest = (body = baseBody) =>
  new Request("http://localhost/api/submit-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /api/submit-order", () => {
  const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
    return undefined;
  });
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {
    return undefined;
  });

  beforeEach(() => {
    vi.clearAllMocks();

    process.env.SANTI_PROXY_URL = "http://proxy.test";
    process.env.PUBLIC_PROXY_URL = "http://proxy.public.test";
    process.env.PROXY_API_SECRET = "proxy-secret";
    process.env.PROXY_API_KEY = "";
    process.env.NODE_ENV = "test";

    mockCreateProxyClient.mockReturnValue({
      order: {
        create: {
          mutate: mockCreateMutation,
        },
      },
    });
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    process.env.SANTI_PROXY_URL = ORIGINAL_ENV.SANTI_PROXY_URL;
    process.env.PUBLIC_PROXY_URL = ORIGINAL_ENV.PUBLIC_PROXY_URL;
    process.env.PROXY_API_SECRET = ORIGINAL_ENV.PROXY_API_SECRET;
    process.env.PROXY_API_KEY = ORIGINAL_ENV.PROXY_API_KEY;
    process.env.NODE_ENV = ORIGINAL_ENV.NODE_ENV;
  });

  it("returns 201 and forwards the order payload to the proxy client", async () => {
    mockCreateMutation.mockResolvedValue({
      id: "order-123",
      orderNumber: "RNT-260320-00001",
      publicToken: "f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
      status: "DRAFT",
      createdAt: "2026-03-14T10:00:00.000Z",
      orderUrl:
        "https://santi.test/sewa-kasur/pesanan/f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
    });

    const response = await POST({
      request: createRequest(),
    } as Parameters<typeof POST>[0]);

    expect(mockCreateProxyClient).toHaveBeenCalledTimes(1);
    expect(mockCreateMutation).toHaveBeenCalledWith({
      customerName: "Budi Santoso",
      customerWhatsapp: "081234567890",
      deliveryAddress: "Jl. Malioboro No. 1, Yogyakarta",
      addressFields: baseBody.addressFields,
      items: baseBody.items,
      totalPrice: 85000,
      orderDate: "2026-03-20",
      endDate: "2026-03-22",
      duration: 2,
      deliveryFee: 15000,
      paymentMethod: "qris",
      notes: "Tolong antar pagi hari",
      volumeDiscountAmount: 5000,
      volumeDiscountLabel: "Promo Maret",
    });
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      id: "order-123",
      orderNumber: "RNT-260320-00001",
      publicToken: "f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
      status: "DRAFT",
      createdAt: "2026-03-14T10:00:00.000Z",
      orderUrl:
        "https://santi.test/sewa-kasur/pesanan/f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
    });
  });

  it("maps validation-like upstream failures to HTTP 400", async () => {
    mockCreateMutation.mockRejectedValueOnce(
      new Error("ZodError: INVALID_PHONE"),
    );

    const response = await POST({
      request: createRequest(),
    } as Parameters<typeof POST>[0]);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "ZodError: INVALID_PHONE",
      },
    });
  });

  it("maps unexpected upstream failures to HTTP 500", async () => {
    mockCreateMutation.mockRejectedValueOnce(
      new Error("ERP service unavailable"),
    );

    const response = await POST({
      request: createRequest(),
    } as Parameters<typeof POST>[0]);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: {
        code: "UPSTREAM_ERROR",
        message: "ERP service unavailable",
      },
    });
  });
});
