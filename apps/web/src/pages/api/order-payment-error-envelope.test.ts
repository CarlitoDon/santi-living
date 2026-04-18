import { beforeEach, describe, expect, it, vi } from "vitest";

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

import { POST as confirmPaymentPost } from "./confirm-payment";
import { POST as createPaymentTokenPost } from "./create-payment-token";
import { POST as createQrisPaymentPost } from "./create-qris-payment";
import { POST as updateOrderPost } from "./update-order";
import { POST as updatePaymentMethodPost } from "./update-payment-method";

const createJsonRequest = (url: string, body: unknown) =>
  new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("order/payment route error envelopes", () => {
  beforeEach(() => {
    vi.clearAllMocks();

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
});
