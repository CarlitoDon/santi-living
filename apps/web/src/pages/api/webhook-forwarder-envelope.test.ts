import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/proxy-config", () => ({
  getProxyBaseUrl: () => "http://proxy.test",
}));

import { POST as webhookMidtransPost } from "./webhooks/midtrans";
import { POST as trpcWebhookMidtransPost } from "./trpc/webhooks/midtrans";

const originalFetch = global.fetch;

describe("webhook forwarder envelope", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
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
