import { beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import type { Context } from "../trpc";
import { getOutboundRequestContext } from "../../services/request-context";

const {
  mockFindOrCreatePartner,
  mockCreateRentalOrder,
  mockGetOrderByToken,
  mockConfirmPayment,
  mockUpdateRentalOrder,
} = vi.hoisted(() => ({
  processEnvSetup: (() => {
    process.env.SANTI_LIVING_COMPANY_ID = "santi-company-test";
  })(),
  mockFindOrCreatePartner: vi.fn(),
  mockCreateRentalOrder: vi.fn(),
  mockGetOrderByToken: vi.fn(),
  mockConfirmPayment: vi.fn(),
  mockUpdateRentalOrder: vi.fn(),
}));

vi.mock("../../services/erp-client", () => ({
  RentalPaymentStatusConst: {
    PENDING: "PENDING",
    AWAITING_CONFIRM: "AWAITING_CONFIRM",
    CONFIRMED: "CONFIRMED",
    FAILED: "FAILED",
  },
  OrderStatusConst: {
    DRAFT: "DRAFT",
    CONFIRMED: "CONFIRMED",
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
  },
  findOrCreatePartner: mockFindOrCreatePartner,
  createRentalOrder: mockCreateRentalOrder,
  getOrderByToken: mockGetOrderByToken,
  confirmPayment: mockConfirmPayment,
  updateRentalOrder: mockUpdateRentalOrder,
}));

vi.mock("../../services/midtrans-client", () => ({
  createSnapToken: vi.fn(),
  createQrisCharge: vi.fn(),
}));

import { orderRouter } from "./order.router";

const ORIGINAL_ENV = {
  PROXY_API_SECRET: process.env.PROXY_API_SECRET,
  SANTI_LIVING_COMPANY_ID: process.env.SANTI_LIVING_COMPANY_ID,
  PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

const buildCaller = (options?: {
  authorization?: string;
  companyId?: string;
}) =>
  orderRouter.createCaller({
    req: {
      headers: {
        ...(options?.authorization
          ? { authorization: options.authorization }
          : {}),
        ...(options?.companyId
          ? { "x-company-id": options.companyId }
          : {}),
      },
    } as Context["req"],
    res: {} as Context["res"],
  });

const baseInput = {
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
      category: "package" as const,
      quantity: 1,
      pricePerDay: 35000,
      includes: ["kasur busa 90x200", "sprei 90x200"],
    },
    {
      id: "mattress-double",
      name: "Double (Kasur)",
      category: "mattress" as const,
      quantity: 1,
      pricePerDay: 45000,
      includes: ["kasur busa 120x200"],
    },
  ],
  totalPrice: 165000,
  orderDate: "2026-03-20T00:00:00.000Z",
  endDate: "2026-03-22T00:00:00.000Z",
  duration: 2,
  deliveryFee: 15000,
  paymentMethod: "qris" as const,
  notes: "Tolong antar pagi hari",
  volumeDiscountAmount: 10000,
  volumeDiscountLabel: "Promo Maret",
};

describe("orderRouter.create", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {
    return undefined;
  });

  beforeEach(() => {
    vi.clearAllMocks();

    process.env.PROXY_API_SECRET = "proxy-test-secret";
    process.env.SANTI_LIVING_COMPANY_ID = "santi-company-test";
    process.env.PUBLIC_BASE_URL = "https://santi.test";
    process.env.NODE_ENV = "test";

    mockFindOrCreatePartner.mockResolvedValue({
      id: "partner-123",
      name: "Budi Santoso",
    });
    mockCreateRentalOrder.mockResolvedValue({
      id: "order-123",
      orderNumber: "RNT-260320-00001",
      publicToken: "f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
      status: "DRAFT",
      createdAt: "2026-03-14T10:00:00.000Z",
    });
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    process.env.PROXY_API_SECRET = ORIGINAL_ENV.PROXY_API_SECRET;
    process.env.SANTI_LIVING_COMPANY_ID = ORIGINAL_ENV.SANTI_LIVING_COMPANY_ID;
    process.env.PUBLIC_BASE_URL = ORIGINAL_ENV.PUBLIC_BASE_URL;
    process.env.NODE_ENV = ORIGINAL_ENV.NODE_ENV;
  });

  it("creates a Santi Living order and maps partner, item, and URL fields correctly", async () => {
    const caller = buildCaller({
      authorization: "Bearer proxy-test-secret",
    });

    const result = await caller.create(baseInput);

    expect(mockFindOrCreatePartner).toHaveBeenCalledWith({
      companyId: "santi-company-test",
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Malioboro No. 1, Yogyakarta",
      street: "Jl. Malioboro No. 1",
      kelurahan: "Sosromenduran",
      kecamatan: "Gedong Tengen",
      kota: "Yogyakarta",
      provinsi: "DIY",
      zip: "55271",
      latitude: -7.7928,
      longitude: 110.3658,
    });
    expect(mockCreateRentalOrder).toHaveBeenCalledWith({
      companyId: "santi-company-test",
      partnerId: "partner-123",
      rentalStartDate: new Date("2026-03-20T00:00:00.000Z"),
      rentalEndDate: new Date("2026-03-22T00:00:00.000Z"),
      items: [
        {
          rentalBundleId: "package-single-standard",
          quantity: 1,
          name: "Single Standard (Paket)",
          pricePerDay: 35000,
          category: "package",
          components: ["kasur busa 90x200", "sprei 90x200"],
        },
        {
          rentalItemId: "mattress-double",
          quantity: 1,
          name: "Double (Kasur)",
          pricePerDay: 45000,
          category: "mattress",
          components: ["kasur busa 120x200"],
        },
      ],
      notes: "Tolong antar pagi hari",
      deliveryFee: 15000,
      deliveryAddress: "Jl. Malioboro No. 1, Yogyakarta",
      street: "Jl. Malioboro No. 1",
      kelurahan: "Sosromenduran",
      kecamatan: "Gedong Tengen",
      kota: "Yogyakarta",
      provinsi: "DIY",
      zip: "55271",
      latitude: -7.7928,
      longitude: 110.3658,
      paymentMethod: "qris",
      discountAmount: 10000,
      discountLabel: "Promo Maret",
    });
    expect(result).toEqual({
      id: "order-123",
      orderNumber: "RNT-260320-00001",
      publicToken: "f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
      status: "DRAFT",
      createdAt: "2026-03-14T10:00:00.000Z",
      orderUrl:
        "https://santi.test/sewa-kasur/pesanan/f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
    });
  });

  it("rejects unauthenticated order creation before touching ERP services", async () => {
    const caller = buildCaller();

    await expect(caller.create(baseInput)).rejects.toThrow(
      "Missing authorization header",
    );
    expect(mockFindOrCreatePartner).not.toHaveBeenCalled();
    expect(mockCreateRentalOrder).not.toHaveBeenCalled();
  });

  it("bubbles partner sync failures and stops before creating the ERP order", async () => {
    const caller = buildCaller({
      authorization: "Bearer proxy-test-secret",
    });
    mockFindOrCreatePartner.mockRejectedValueOnce(
      new Error("Partner sync failed"),
    );

    await expect(caller.create(baseInput)).rejects.toThrow(
      "Partner sync failed",
    );
    expect(mockCreateRentalOrder).not.toHaveBeenCalled();
  });

  it("bubbles ERP order creation failures after partner creation succeeds", async () => {
    const caller = buildCaller({
      authorization: "Bearer proxy-test-secret",
    });
    mockCreateRentalOrder.mockRejectedValueOnce(
      new Error("ERP create order failed"),
    );

    await expect(caller.create(baseInput)).rejects.toThrow(
      "ERP create order failed",
    );
    expect(mockFindOrCreatePartner).toHaveBeenCalledTimes(1);
  });

  it("fails closed when proxy auth secret is missing", async () => {
    const caller = buildCaller({
      authorization: "Bearer proxy-test-secret",
    });

    delete process.env.PROXY_API_SECRET;

    await expect(caller.create(baseInput)).rejects.toThrow(
      "PROXY_API_SECRET is required",
    );
    expect(mockFindOrCreatePartner).not.toHaveBeenCalled();
  });

  it("fails fast when Santi Living company mapping is not configured", async () => {
    const caller = buildCaller({
      authorization: "Bearer proxy-test-secret",
    });

    delete process.env.SANTI_LIVING_COMPANY_ID;

    await expect(caller.create(baseInput)).rejects.toThrow(
      "SANTI_LIVING_COMPANY_ID is required",
    );
    expect(mockFindOrCreatePartner).not.toHaveBeenCalled();
  });
  it("rejects requests with mismatched company scope header", async () => {
    const caller = buildCaller({
      authorization: "Bearer proxy-test-secret",
      companyId: "other-company",
    });

    await expect(caller.create(baseInput)).rejects.toThrow(
      "Company scope mismatch",
    );
    expect(mockFindOrCreatePartner).not.toHaveBeenCalled();
  });

  it("propagates correlation and idempotency headers to outbound ERP context", async () => {
    const caller = orderRouter.createCaller({
      req: {
        headers: {
          authorization: "Bearer proxy-test-secret",
          "x-company-id": "santi-company-test",
          "x-correlation-id": "corr-order-ctx-001",
          "idempotency-key": "idem-order-ctx-001",
        },
      } as Context["req"],
      res: {} as Context["res"],
    });

    let partnerContext: ReturnType<typeof getOutboundRequestContext> = {};
    let orderContext: ReturnType<typeof getOutboundRequestContext> = {};

    mockFindOrCreatePartner.mockImplementationOnce(async () => {
      partnerContext = getOutboundRequestContext();
      return {
        id: "partner-123",
        name: "Budi Santoso",
      };
    });

    mockCreateRentalOrder.mockImplementationOnce(async () => {
      orderContext = getOutboundRequestContext();
      return {
        id: "order-123",
        orderNumber: "RNT-260320-00001",
        publicToken: "f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
        status: "DRAFT",
        createdAt: "2026-03-14T10:00:00.000Z",
      };
    });

    await caller.create(baseInput);

    expect(partnerContext).toEqual({
      correlationId: "corr-order-ctx-001",
      idempotencyKey: "idem-order-ctx-001",
      companyId: "santi-company-test",
    });
    expect(orderContext).toEqual({
      correlationId: "corr-order-ctx-001",
      idempotencyKey: "idem-order-ctx-001",
      companyId: "santi-company-test",
    });
  });

});
