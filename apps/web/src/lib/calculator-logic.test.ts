import { describe, it, expect } from "vitest";
import {
  calculateDeliveryFee,
  calculateVolumeDiscount,
  calculateDurationDiscount,
  calculateTotals,
} from "./calculator-logic";
import type { VolumeDiscountConfig } from "./calculator-logic";
import type { CartItem } from "@/types";

// ============================================================
// Test fixtures
// ============================================================

const volumeDiscountConfig: VolumeDiscountConfig = {
  volumeDiscounts: [
    { minQty: 3, maxQty: 5, discount: 0.05, label: "3-5 unit" },
    { minQty: 6, maxQty: 10, discount: 0.1, label: "6-10 unit" },
    { minQty: 11, maxQty: 20, discount: 0.15, label: "11-20 unit" },
  ],
};

const makeMattress = (
  qty: number,
  price = 50000,
  id = "m1",
): CartItem => ({
  id,
  name: "Kasur Busa",
  category: "mattress",
  quantity: qty,
  pricePerDay: price,
});

const makeAccessory = (
  qty: number,
  price = 10000,
  id = "a1",
): CartItem => ({
  id,
  name: "Bantal",
  category: "accessory",
  quantity: qty,
  pricePerDay: price,
});

// ============================================================
// calculateDeliveryFee
// ============================================================

describe("calculateDeliveryFee", () => {
  it("returns 0 for zero distance", () => {
    expect(calculateDeliveryFee(0)).toBe(0);
  });

  it("returns 0 for negative distance", () => {
    expect(calculateDeliveryFee(-5)).toBe(0);
  });

  it("calculates correctly for 5 km", () => {
    // 5 × 4 / 10 × 6800 = 13600 → ceil to 14000
    expect(calculateDeliveryFee(5)).toBe(14000);
  });

  it("calculates correctly for 10 km", () => {
    // 10 × 4 / 10 × 6800 = 27200 → ceil to 28000
    expect(calculateDeliveryFee(10)).toBe(28000);
  });

  it("rounds up to nearest Rp1.000", () => {
    // 1 × 4 / 10 × 6800 = 2720 → ceil to 3000
    expect(calculateDeliveryFee(1)).toBe(3000);
  });

  it("handles fractional distance", () => {
    // 2.5 × 4 / 10 × 6800 = 6800 → exactly 7000
    expect(calculateDeliveryFee(2.5)).toBe(7000);
  });
});

// ============================================================
// calculateVolumeDiscount
// ============================================================

describe("calculateVolumeDiscount", () => {
  it("returns 0 discount when qty below all tiers", () => {
    const result = calculateVolumeDiscount(1, volumeDiscountConfig);
    expect(result.discount).toBe(0);
    expect(result.percent).toBe(0);
    expect(result.label).toBe("");
  });

  it("matches first tier (3-5 unit)", () => {
    const result = calculateVolumeDiscount(3, volumeDiscountConfig);
    expect(result.discount).toBe(0.05);
    expect(result.percent).toBe(5);
    expect(result.label).toBe("3-5 unit");
  });

  it("matches second tier (6-10 unit)", () => {
    const result = calculateVolumeDiscount(6, volumeDiscountConfig);
    expect(result.discount).toBe(0.1);
    expect(result.percent).toBe(10);
    expect(result.label).toBe("6-10 unit");
  });

  it("calculates next tier upsell info", () => {
    const result = calculateVolumeDiscount(4, volumeDiscountConfig);
    // Next tier is 6-10, need 2 more units
    expect(result.nextTierUnitsNeeded).toBe(2);
    expect(result.nextTierDiscountPercent).toBe(10);
  });

  it("returns 0 next tier info when at highest tier", () => {
    const result = calculateVolumeDiscount(15, volumeDiscountConfig);
    expect(result.nextTierUnitsNeeded).toBe(0);
    expect(result.nextTierDiscountPercent).toBe(0);
  });

  it("returns 0 discount with empty config", () => {
    const result = calculateVolumeDiscount(5, {});
    expect(result.discount).toBe(0);
  });

  it("returns 0 for qty = 0", () => {
    const result = calculateVolumeDiscount(0, volumeDiscountConfig);
    expect(result.discount).toBe(0);
    expect(result.nextTierUnitsNeeded).toBe(0);
  });
});

// ============================================================
// calculateDurationDiscount
// ============================================================

describe("calculateDurationDiscount", () => {
  it("returns 5% for 3+ days", () => {
    const result = calculateDurationDiscount(3);
    expect(result.discount).toBe(0.05);
    expect(result.percent).toBe(5);
    expect(result.label).toBe("3+ hari");
  });

  it("returns 5% for longer durations", () => {
    const result = calculateDurationDiscount(10);
    expect(result.discount).toBe(0.05);
    expect(result.percent).toBe(5);
  });

  it("returns 0 for duration below threshold", () => {
    const result = calculateDurationDiscount(2);
    expect(result.discount).toBe(0);
    expect(result.percent).toBe(0);
    expect(result.label).toBe("");
  });

  it("returns 0 for duration = 1", () => {
    const result = calculateDurationDiscount(1);
    expect(result.discount).toBe(0);
  });
});

// ============================================================
// calculateTotals
// ============================================================

describe("calculateTotals", () => {
  it("calculates basic mattress total", () => {
    const items = [makeMattress(2, 50000)];
    const result = calculateTotals(items, 3, 0, 0, 0);

    expect(result.mattressSubtotal).toBe(300000); // 2 × 50000 × 3
    expect(result.accessorySubtotal).toBe(0);
    expect(result.subtotal).toBe(300000);
    expect(result.total).toBe(300000);
  });

  it("calculates mixed items correctly", () => {
    const items = [makeMattress(2, 50000), makeAccessory(1, 10000)];
    const result = calculateTotals(items, 2, 0, 0, 0);

    expect(result.mattressSubtotal).toBe(200000); // 2 × 50000 × 2
    expect(result.accessorySubtotal).toBe(20000); // 1 × 10000 × 2
    expect(result.subtotal).toBe(220000);
    expect(result.total).toBe(220000);
  });

  it("applies volume discount only to mattresses", () => {
    const items = [makeMattress(2, 50000), makeAccessory(1, 10000)];
    const result = calculateTotals(items, 2, 0, 0.1, 0);

    expect(result.discountAmount).toBe(20000); // 10% of 200000 mattress subtotal
    expect(result.total).toBe(200000); // 220000 - 20000
  });

  it("applies duration discount after volume discount", () => {
    const items = [makeMattress(2, 50000)];
    const result = calculateTotals(items, 3, 0, 0.1, 0.05);

    // mattressSubtotal = 300000
    // volumeDiscount = 30000 (10%)
    // afterVolume = 270000
    // durationDiscount = 13500 (5% of 270000)
    expect(result.discountAmount).toBe(30000);
    expect(result.durationDiscountAmount).toBe(13500);
    expect(result.total).toBe(256500); // 300000 - 30000 - 13500
  });

  it("adds delivery fee to total", () => {
    const items = [makeMattress(1, 50000)];
    const result = calculateTotals(items, 1, 14000, 0, 0);

    expect(result.total).toBe(64000); // 50000 + 14000
  });

  it("handles empty cart", () => {
    const result = calculateTotals([], 3, 10000, 0.1, 0.05);

    expect(result.mattressSubtotal).toBe(0);
    expect(result.accessorySubtotal).toBe(0);
    expect(result.subtotal).toBe(0);
    expect(result.discountAmount).toBe(0);
    expect(result.durationDiscountAmount).toBe(0);
    expect(result.total).toBe(10000); // only delivery fee
  });

  it("handles accessory-only cart", () => {
    const items = [makeAccessory(3, 15000)];
    const result = calculateTotals(items, 2, 0, 0.1, 0);

    expect(result.mattressSubtotal).toBe(0);
    expect(result.accessorySubtotal).toBe(90000); // 3 × 15000 × 2
    expect(result.discountAmount).toBe(0); // no discount on accessories
    expect(result.total).toBe(90000);
  });
});
