import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

// ============================================================
// Setup: vi.hoisted runs FIRST (before vi.mock and imports)
// ============================================================

const { mockCreateTransaction } = vi.hoisted(() => {
  // Set env vars so midtrans-client.ts doesn't call process.exit(1)
  process.env.MIDTRANS_SERVER_KEY = "test-server-key";
  process.env.MIDTRANS_CLIENT_KEY = "test-client-key";

  return {
    mockCreateTransaction: vi.fn(),
  };
});

// ============================================================
// Mock midtrans-client SDK (vi.mock is also hoisted, but AFTER vi.hoisted)
// ============================================================

vi.mock("midtrans-client", () => ({
  default: {
    Snap: class MockSnap {
      createTransaction = mockCreateTransaction;
    },
    CoreApi: class MockCoreApi {},
  },
}));

import { createSnapToken, createQrisCharge } from "./midtrans-client";

// ============================================================
// Fixtures
// ============================================================

const baseInput = {
  transaction_details: {
    order_id: "ORD-2026-001",
    gross_amount: 210000,
  },
  customer_details: {
    first_name: "Budi",
    email: "budi@example.com",
    phone: "08123456789",
  },
  item_details: [
    { id: "pkg-single", name: "Paket Single", price: 70000, quantity: 3 },
  ],
};

const ORIGINAL_ENV = {
  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY,
};

// ============================================================
// Tests
// ============================================================

describe("createSnapToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MIDTRANS_SERVER_KEY = "test-server-key";
    process.env.MIDTRANS_CLIENT_KEY = "test-client-key";
    mockCreateTransaction.mockResolvedValue({ token: "snap-token-abc" });
  });

  it("returns snap token on success", async () => {
    const token = await createSnapToken(baseInput);
    expect(token).toBe("snap-token-abc");
  });

  it("uses 'gopay' enabled payment for gopay method", async () => {
    await createSnapToken({ ...baseInput, paymentMethod: "gopay" });
    const param = mockCreateTransaction.mock.calls[0][0];
    expect(param.enabled_payments).toEqual(["gopay"]);
  });

  it("uses 'other_qris' enabled payment for qris method", async () => {
    await createSnapToken({ ...baseInput, paymentMethod: "qris" });
    const param = mockCreateTransaction.mock.calls[0][0];
    expect(param.enabled_payments).toEqual(["other_qris"]);
  });

  it("uses default payments for transfer method", async () => {
    await createSnapToken({ ...baseInput, paymentMethod: "transfer" });
    const param = mockCreateTransaction.mock.calls[0][0];
    expect(param.enabled_payments).toEqual(["qris", "gopay", "bank_transfer"]);
  });

  it("uses default payments when no method specified", async () => {
    await createSnapToken(baseInput);
    const param = mockCreateTransaction.mock.calls[0][0];
    expect(param.enabled_payments).toEqual(["qris", "gopay", "bank_transfer"]);
  });

  it("sets 15 minute expiry", async () => {
    await createSnapToken(baseInput);
    const param = mockCreateTransaction.mock.calls[0][0];
    expect(param.expiry).toEqual({ unit: "minutes", duration: 15 });
  });

  it("passes through transaction and customer details", async () => {
    await createSnapToken(baseInput);
    const param = mockCreateTransaction.mock.calls[0][0];
    expect(param.transaction_details).toEqual(baseInput.transaction_details);
    expect(param.customer_details).toEqual(baseInput.customer_details);
    expect(param.item_details).toEqual(baseInput.item_details);
  });

  it("throws on Midtrans SDK error", async () => {
    mockCreateTransaction.mockRejectedValue(new Error("401 Unauthorized"));
    await expect(createSnapToken(baseInput)).rejects.toThrow("401 Unauthorized");
  });

  it("fails lazily when Midtrans credentials are missing", async () => {
    delete process.env.MIDTRANS_SERVER_KEY;
    delete process.env.MIDTRANS_CLIENT_KEY;

    await expect(createSnapToken(baseInput)).rejects.toThrow(
      "MIDTRANS_SERVER_KEY is missing",
    );
    expect(mockCreateTransaction).not.toHaveBeenCalled();
  });
});

describe("createQrisCharge", () => {
  beforeEach(() => {
    process.env.MIDTRANS_SERVER_KEY = "test-server-key";
    process.env.MIDTRANS_CLIENT_KEY = "test-client-key";
  });

  it("throws disabled error", async () => {
    await expect(
      createQrisCharge({ order_id: "ORD-001", gross_amount: 100000 }),
    ).rejects.toThrow("QRIS Core API is currently disabled");
  });
});

afterAll(() => {
  process.env.MIDTRANS_SERVER_KEY = ORIGINAL_ENV.MIDTRANS_SERVER_KEY;
  process.env.MIDTRANS_CLIENT_KEY = ORIGINAL_ENV.MIDTRANS_CLIENT_KEY;
});
