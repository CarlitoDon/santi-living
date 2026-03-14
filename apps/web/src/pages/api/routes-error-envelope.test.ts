import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockConfirmPaymentMutation,
  mockCreatePaymentTokenMutation,
  mockCreateQrisPaymentMutation,
  mockUpdateOrderMutation,
  mockUpdatePaymentMethodMutation,
  mockCreateProxyClient,
} = vi.hoisted(() => ({
  mockConfirmPaymentMutation: vi.fn(),
  mockCreatePaymentTokenMutation: vi.fn(),
  mockCreateQrisPaymentMutation: vi.fn(),
  mockUpdateOrderMutation: vi.fn(),
  mockUpdatePaymentMethodMutation: vi.fn(),
  mockCreateProxyClient: vi.fn(),
}));

vi.mock("../../lib/trpc-client", () => ({
  createProxyClient: mockCreateProxyClient,
}));

vi.mock("../../lib/proxy-config", () => ({
  getProxyBaseUrl: () => "http://proxy.test",
}));

import { POST as confirmPaymentPost } from "./confirm-payment";
import { POST as createPaymentTokenPost } from "./create-payment-token";
import { POST as createQrisPaymentPost } from "./create-qris-payment";
import { GET as proxyQrImageGet } from "./proxy-qr-image";
import { GET as reverseGeocodeGet } from "./reverse-geocode";
import { POST as updateOrderPost } from "./update-order";
import { POST as updatePaymentMethodPost } from "./update-payment-method";
import { POST as webhookMidtransPost } from "./webhooks/midtrans";
import { POST as trpcWebhookMidtransPost } from "./trpc/webhooks/midtrans";

const originalFetch = global.fetch;

const createJsonRequest = (url: string, body: unknown) =>
  new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("web api route error envelopes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();

    mockCreateProxyClient.mockReturnValue({
      order: {
        confirmPayment: { mutate: mockConfirmPaymentMutation },
        createPaymentToken: { mutate: mockCreatePaymentTokenMutation },
        createQrisPayment: { mutate: mockCreateQrisPaymentMutation },
        update: { mutate: mockUpdateOrderMutation },
        updatePaymentMethod: { mutate: mockUpdatePaymentMethodMutation },
      },
    });
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("returns BAD_REQUEST for confirm-payment missing fields", async () => {
    const response = await confirmPaymentPost({
      request: createJsonRequest("http://localhost/api/confirm-payment", {
        token: "",
        paymentMethod: "",
      }),
    } as Parameters<typeof confirmPaymentPost>[0]);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: {
        code: "BAD_REQUEST",
        message: "Token and Payment Method are required",
      },
    });
  });

  it("returns UPSTREAM_ERROR for confirm-payment mutation failure", async () => {
    mockConfirmPaymentMutation.mockRejectedValueOnce(new Error("proxy down"));

    const response = await confirmPaymentPost({
      request: createJsonRequest("http://localhost/api/confirm-payment", {
        token: "token-1",
        paymentMethod: "qris",
      }),
    } as Parameters<typeof confirmPaymentPost>[0]);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { code: "UPSTREAM_ERROR", message: "proxy down" },
    });
  });

  it("returns BAD_REQUEST for create-payment-token missing token", async () => {
    const response = await createPaymentTokenPost({
      request: createJsonRequest("http://localhost/api/create-payment-token", {
        paymentMethod: "qris",
      }),
    } as Parameters<typeof createPaymentTokenPost>[0]);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { code: "BAD_REQUEST", message: "Token is required" },
    });
  });

  it("returns BAD_REQUEST for create-qris-payment missing token", async () => {
    const response = await createQrisPaymentPost({
      request: createJsonRequest("http://localhost/api/create-qris-payment", {}),
    } as Parameters<typeof createQrisPaymentPost>[0]);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { code: "BAD_REQUEST", message: "Token is required" },
    });
  });

  it("returns BAD_REQUEST for update-order missing token", async () => {
    const response = await updateOrderPost({
      request: createJsonRequest("http://localhost/api/update-order", {
        customerName: "Budi",
      }),
    } as Parameters<typeof updateOrderPost>[0]);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { code: "BAD_REQUEST", message: "Missing order token" },
    });
  });

  it("returns BAD_REQUEST for update-payment-method invalid method", async () => {
    const response = await updatePaymentMethodPost({
      request: createJsonRequest("http://localhost/api/update-payment-method", {
        token: "token-1",
        paymentMethod: "cash",
      }),
    } as Parameters<typeof updatePaymentMethodPost>[0]);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: {
        code: "BAD_REQUEST",
        message: "Valid payment method is required (qris, transfer, gopay)",
      },
    });
  });

  it("returns BAD_REQUEST for reverse-geocode without coordinates", async () => {
    const response = await reverseGeocodeGet({
      url: new URL("http://localhost/api/reverse-geocode"),
    } as Parameters<typeof reverseGeocodeGet>[0]);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { code: "BAD_REQUEST", message: "lat and lng are required" },
    });
  });

  it("returns UPSTREAM_ERROR for reverse-geocode fetch failure", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("network"));

    const response = await reverseGeocodeGet({
      url: new URL("http://localhost/api/reverse-geocode?lat=-7.79&lng=110.36"),
    } as Parameters<typeof reverseGeocodeGet>[0]);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { code: "UPSTREAM_ERROR", message: "Failed to reverse geocode" },
    });
  });

  it("returns BAD_REQUEST for proxy-qr-image without URL", async () => {
    const response = await proxyQrImageGet({
      url: new URL("http://localhost/api/proxy-qr-image"),
    } as Parameters<typeof proxyQrImageGet>[0]);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { code: "BAD_REQUEST", message: "URL parameter is required" },
    });
  });

  it("returns FORBIDDEN for proxy-qr-image non-midtrans URL", async () => {
    const response = await proxyQrImageGet({
      url: new URL("http://localhost/api/proxy-qr-image?url=https://example.com/qr.png"),
    } as Parameters<typeof proxyQrImageGet>[0]);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { code: "FORBIDDEN", message: "Invalid URL" },
    });
  });

  it("forwards webhook payload and passes through upstream success response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const requestBody = JSON.stringify({ order_id: "order-1" });
    const response = await webhookMidtransPost({
      request: new Request("http://localhost/api/webhooks/midtrans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-midtrans-signature": "sig-1",
        },
        body: requestBody,
      }),
    } as Parameters<typeof webhookMidtransPost>[0]);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://proxy.test/api/webhooks/midtrans",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-midtrans-signature": "sig-1",
        },
        body: requestBody,
      },
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("forwards trpc webhook payload and passes through upstream success response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ accepted: true }), {
        status: 202,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const requestBody = JSON.stringify({ order_id: "order-2" });
    const response = await trpcWebhookMidtransPost({
      request: new Request("http://localhost/api/trpc/webhooks/midtrans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-midtrans-signature": "sig-2",
        },
        body: requestBody,
      }),
    } as Parameters<typeof trpcWebhookMidtransPost>[0]);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://proxy.test/api/webhooks/midtrans",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-midtrans-signature": "sig-2",
        },
        body: requestBody,
      },
    );
    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toEqual({ accepted: true });
  });

  it("returns UPSTREAM_ERROR for webhook forwarder fetch failures", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("forward failed"));

    const directResponse = await webhookMidtransPost({
      request: new Request("http://localhost/api/webhooks/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: "order-1" }),
      }),
    } as Parameters<typeof webhookMidtransPost>[0]);

    const trpcResponse = await trpcWebhookMidtransPost({
      request: new Request("http://localhost/api/trpc/webhooks/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: "order-1" }),
      }),
    } as Parameters<typeof trpcWebhookMidtransPost>[0]);

    expect(directResponse.status).toBe(500);
    await expect(directResponse.json()).resolves.toEqual({
      success: false,
      error: { code: "UPSTREAM_ERROR", message: "Failed to forward webhook" },
    });

    expect(trpcResponse.status).toBe(500);
    await expect(trpcResponse.json()).resolves.toEqual({
      success: false,
      error: { code: "UPSTREAM_ERROR", message: "Failed to forward webhook" },
    });
  });
});
