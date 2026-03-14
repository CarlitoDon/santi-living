import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AddressInfo } from "node:net";

const {
  notifyAdminWebhookMock,
  notifyPaymentStatusWebhookMock,
  midtransWebhookMock,
} = vi.hoisted(() => ({
  notifyAdminWebhookMock: vi.fn(),
  notifyPaymentStatusWebhookMock: vi.fn(),
  midtransWebhookMock: vi.fn(),
}));

vi.mock("./webhooks/notify", () => ({
  notifyAdminWebhook: notifyAdminWebhookMock,
  notifyPaymentStatusWebhook: notifyPaymentStatusWebhookMock,
}));

vi.mock("./webhooks/midtrans", () => ({
  midtransWebhook: midtransWebhookMock,
}));

import { createServer } from "./server";

describe("proxy webhook boundary", () => {
  const originalEnv = {
    PROXY_API_SECRET: process.env.PROXY_API_SECRET,
    SANTI_LIVING_COMPANY_ID: process.env.SANTI_LIVING_COMPANY_ID,
    WEBHOOK_IDEMPOTENCY_TTL_MS: process.env.WEBHOOK_IDEMPOTENCY_TTL_MS,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PROXY_API_SECRET = "proxy-test-secret";
    process.env.SANTI_LIVING_COMPANY_ID = "santi-company-test";
    process.env.WEBHOOK_IDEMPOTENCY_TTL_MS = "60000";

    notifyAdminWebhookMock.mockImplementation((_req, res) => {
      res.status(200).json({ success: true, handled: "admin" });
    });

    notifyPaymentStatusWebhookMock.mockImplementation((_req, res) => {
      res.status(200).json({ success: true, handled: "payment" });
    });

    midtransWebhookMock.mockImplementation((_req, res) => {
      res.status(200).json({ success: true, handled: "midtrans" });
    });
  });

  afterEach(() => {
    process.env.PROXY_API_SECRET = originalEnv.PROXY_API_SECRET;
    process.env.SANTI_LIVING_COMPANY_ID = originalEnv.SANTI_LIVING_COMPANY_ID;
    process.env.WEBHOOK_IDEMPOTENCY_TTL_MS =
      originalEnv.WEBHOOK_IDEMPOTENCY_TTL_MS;
  });

  it("returns BAD_REQUEST envelope when x-company-id is missing", async () => {
    const app = createServer();
    const server = app.listen(0);

    try {
      const { port } = server.address() as AddressInfo;
      const response = await fetch(
        `http://127.0.0.1:${port}/api/orders/token-123/notify-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer proxy-test-secret",
          },
          body: JSON.stringify({ action: "new_order" }),
        },
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Missing required header: X-Company-Id",
        },
      });
      expect(notifyAdminWebhookMock).not.toHaveBeenCalled();
    } finally {
      server.close();
    }
  });

  it("returns FORBIDDEN envelope when x-company-id mismatches configured company", async () => {
    const app = createServer();
    const server = app.listen(0);

    try {
      const { port } = server.address() as AddressInfo;
      const response = await fetch(
        `http://127.0.0.1:${port}/api/orders/token-123/notify-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer proxy-test-secret",
            "X-Company-Id": "other-company",
          },
          body: JSON.stringify({ action: "new_order" }),
        },
      );

      expect(response.status).toBe(403);
      await expect(response.json()).resolves.toEqual({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Company scope mismatch",
        },
      });
      expect(notifyAdminWebhookMock).not.toHaveBeenCalled();
    } finally {
      server.close();
    }
  });

  it("returns standardized unauthorized envelope when auth header is missing", async () => {
    const app = createServer();
    const server = app.listen(0);

    try {
      const { port } = server.address() as AddressInfo;
      const response = await fetch(
        `http://127.0.0.1:${port}/api/orders/token-123/notify-admin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "new_order" }),
        },
      );

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Missing authorization header",
        },
      });
      expect(notifyAdminWebhookMock).not.toHaveBeenCalled();
    } finally {
      server.close();
    }
  });

  it("deduplicates repeated deliveries and calls handler once", async () => {
    const app = createServer();
    const server = app.listen(0);

    try {
      const { port } = server.address() as AddressInfo;
      const url = `http://127.0.0.1:${port}/api/orders/token-123/notify-admin`;

      const first = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer proxy-test-secret",
          "X-Company-Id": "santi-company-test",
          "X-Webhook-Delivery-Id": "delivery-1",
        },
        body: JSON.stringify({ action: "new_order" }),
      });

      const second = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer proxy-test-secret",
          "X-Company-Id": "santi-company-test",
          "X-Webhook-Delivery-Id": "delivery-1",
        },
        body: JSON.stringify({ action: "new_order" }),
      });

      expect(first.status).toBe(200);
      expect(second.status).toBe(200);
      expect(notifyAdminWebhookMock).toHaveBeenCalledTimes(1);
      await expect(second.json()).resolves.toEqual({
        success: true,
        duplicate: true,
        deliveryId: "delivery-1",
      });
    } finally {
      server.close();
    }
  });
});
