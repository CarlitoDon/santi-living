import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockCreateOrderMutation,
  mockCreatePaymentTokenMutation,
  mockConfirmPaymentMutation,
  mockCreateProxyClient,
} = vi.hoisted(() => ({
  mockCreateOrderMutation: vi.fn(),
  mockCreatePaymentTokenMutation: vi.fn(),
  mockConfirmPaymentMutation: vi.fn(),
  mockCreateProxyClient: vi.fn(),
}));

vi.mock("../../lib/trpc-client", () => ({
  createProxyClient: mockCreateProxyClient,
}));

import { POST as submitOrderPost } from "./submit-order";
import { POST as createPaymentTokenPost } from "./create-payment-token";
import { POST as confirmPaymentPost } from "./confirm-payment";

const createJsonRequest = (
  url: string,
  body: unknown,
  headers?: Record<string, string>,
) =>
  new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: JSON.stringify(body),
  });

describe("order flow e2e via web api routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCreateProxyClient.mockReturnValue({
      order: {
        create: { mutate: mockCreateOrderMutation },
        createPaymentToken: { mutate: mockCreatePaymentTokenMutation },
        confirmPayment: { mutate: mockConfirmPaymentMutation },
      },
    });

    mockCreateOrderMutation.mockResolvedValue({
      id: "order-001",
      orderNumber: "RNT-260320-00001",
      publicToken: "f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
      status: "DRAFT",
      createdAt: "2026-03-14T10:00:00.000Z",
      orderUrl:
        "https://santi.test/sewa-kasur/pesanan/f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
    });

    mockCreatePaymentTokenMutation.mockResolvedValue({
      token: "snap-token-001",
      redirect_url: "https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-001",
    });

    mockConfirmPaymentMutation.mockResolvedValue({
      success: true,
      orderNumber: "RNT-260320-00001",
      status: "AWAITING_CONFIRM",
      paymentMethod: "qris",
      paymentReference: "trx-001",
    });
  });

  it("creates order, creates payment token, then confirms payment", async () => {
    const submitResponse = await submitOrderPost({
      request: createJsonRequest(
        "http://localhost/api/submit-order",
        {
          customerName: "Budi Santoso",
          customerWhatsapp: "081234567890",
          deliveryAddress: "Jl. Malioboro No. 1",
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
          totalPrice: 70000,
          orderDate: "2026-03-20T00:00:00.000Z",
          endDate: "2026-03-22T00:00:00.000Z",
          duration: 2,
          deliveryFee: 15000,
          paymentMethod: "qris",
        },
        {
          "x-correlation-id": "corr-e2e-order-001",
          "idempotency-key": "idem-e2e-order-001",
          "x-company-id": "santi-company-test",
        },
      ),
    } as Parameters<typeof submitOrderPost>[0]);

    expect(submitResponse.status).toBe(201);
    const submitPayload = await submitResponse.json();
    expect(submitPayload.publicToken).toBe(
      "f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
    );

    const paymentTokenResponse = await createPaymentTokenPost({
      request: createJsonRequest("http://localhost/api/create-payment-token", {
        token: submitPayload.publicToken,
        paymentMethod: "qris",
      }),
    } as Parameters<typeof createPaymentTokenPost>[0]);

    expect(paymentTokenResponse.status).toBe(200);
    await expect(paymentTokenResponse.json()).resolves.toMatchObject({
      success: true,
      token: "snap-token-001",
    });

    const confirmResponse = await confirmPaymentPost({
      request: createJsonRequest("http://localhost/api/confirm-payment", {
        token: submitPayload.publicToken,
        paymentMethod: "qris",
        reference: "trx-001",
      }),
    } as Parameters<typeof confirmPaymentPost>[0]);

    expect(confirmResponse.status).toBe(200);
    await expect(confirmResponse.json()).resolves.toMatchObject({
      success: true,
      orderNumber: "RNT-260320-00001",
      status: "AWAITING_CONFIRM",
    });

    expect(mockCreateProxyClient).toHaveBeenCalledTimes(3);
    expect(mockCreateOrderMutation).toHaveBeenCalledTimes(1);
    expect(mockCreatePaymentTokenMutation).toHaveBeenCalledWith({
      token: "f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
      paymentMethod: "qris",
    });
    expect(mockConfirmPaymentMutation).toHaveBeenCalledWith({
      token: "f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
      paymentMethod: "qris",
      reference: "trx-001",
    });
  });
});
