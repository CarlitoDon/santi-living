import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createOrderInERP } from "./erp-api";

const originalFetch = global.fetch;

const basePayload = {
  customerName: "Budi Santoso",
  customerWhatsapp: "081234567890",
  deliveryAddress: "Jl. Malioboro No. 1, Yogyakarta",
  addressFields: {
    street: "Jl. Malioboro No. 1",
    kota: "Yogyakarta",
    provinsi: "DIY",
  },
  items: [
    {
      id: "package-single-standard",
      name: "Single Standard (Paket)",
      category: "package" as const,
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
  paymentMethod: "qris" as const,
  notes: "Tolong antar pagi hari",
  volumeDiscountAmount: 5000,
  volumeDiscountLabel: "Promo Maret",
};

describe("createOrderInERP", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("posts to submit-order with ISO-normalized dates", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: "order-123",
          orderNumber: "RNT-260320-00001",
          publicToken: "f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
          status: "DRAFT",
          createdAt: "2026-03-14T10:00:00.000Z",
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    const result = await createOrderInERP(basePayload);

    expect(global.fetch).toHaveBeenCalledWith("/api/submit-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName: "Budi Santoso",
        customerWhatsapp: "081234567890",
        deliveryAddress: "Jl. Malioboro No. 1, Yogyakarta",
        addressFields: basePayload.addressFields,
        items: basePayload.items,
        totalPrice: 85000,
        orderDate: "2026-03-20T00:00:00.000Z",
        endDate: "2026-03-22T00:00:00.000Z",
        duration: 2,
        deliveryFee: 15000,
        paymentMethod: "qris",
        notes: "Tolong antar pagi hari",
        volumeDiscountAmount: 5000,
        volumeDiscountLabel: "Promo Maret",
      }),
    });
    expect(result).toEqual({
      id: "order-123",
      orderNumber: "RNT-260320-00001",
      publicToken: "f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
      status: "DRAFT",
      createdAt: "2026-03-14T10:00:00.000Z",
    });
  });

  it("surfaces upstream error messages when submit-order fails", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          message: "Order creation failed",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    await expect(createOrderInERP(basePayload)).rejects.toThrow(
      "Order creation failed",
    );
  });
});
