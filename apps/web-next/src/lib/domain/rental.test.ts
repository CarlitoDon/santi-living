import { describe, it, expect, vi } from "vitest";
import {
  calculateRentalPrice,
  calculateEndDate,
  calculateDeliveryEstimate,
  validateDuration,
} from "./rental";
import type { RentalConfig } from "./rental";
import type { CartItem } from "@/types";

// ============================================================
// Test fixtures
// ============================================================

const defaultConfig: RentalConfig = {
  maxDuration: 30,
  minDuration: 1,
  maxQuantity: 20,
  cutoffHour: 14,
  volumeDiscounts: [
    { minQty: 3, maxQty: 5, discount: 0.05, label: "3-5 unit" },
    { minQty: 6, maxQty: 10, discount: 0.1, label: "6-10 unit" },
  ],
};

const makeMattress = (qty: number, price = 50000): CartItem => ({
  id: "m1",
  name: "Kasur Busa",
  category: "mattress",
  quantity: qty,
  pricePerDay: price,
});

const makeAccessory = (qty: number, price = 10000): CartItem => ({
  id: "a1",
  name: "Bantal",
  category: "accessory",
  quantity: qty,
  pricePerDay: price,
});

// ============================================================
// calculateRentalPrice
// ============================================================

describe("calculateRentalPrice", () => {
  it("calculates single mattress rental", () => {
    const items = [makeMattress(1, 50000)];
    const result = calculateRentalPrice(items, 3, defaultConfig);

    expect(result.mattressSubtotal).toBe(150000);
    expect(result.accessorySubtotal).toBe(0);
    expect(result.subtotal).toBe(150000);
    expect(result.discountAmount).toBe(0); // qty 1, no tier
    expect(result.total).toBe(150000);
  });

  it("applies volume discount for 3+ mattresses", () => {
    const items = [makeMattress(3, 50000)];
    const result = calculateRentalPrice(items, 2, defaultConfig);

    expect(result.mattressSubtotal).toBe(300000);
    expect(result.discountAmount).toBe(15000); // 5% of 300000
    expect(result.total).toBe(285000);
    expect(result.volumeDiscountLabel).toBe("3-5 unit");
    expect(result.volumeDiscountPercent).toBe(5);
  });

  it("calculates mixed items with discount only on mattresses", () => {
    const items = [makeMattress(4, 50000), makeAccessory(2, 10000)];
    const result = calculateRentalPrice(items, 2, defaultConfig);

    expect(result.mattressSubtotal).toBe(400000);
    expect(result.accessorySubtotal).toBe(40000);
    expect(result.subtotal).toBe(440000);
    expect(result.discountAmount).toBe(20000); // 5% of 400000 (mattress only)
    expect(result.total).toBe(420000);
  });

  it("provides next tier upsell info", () => {
    const items = [makeMattress(4)];
    const result = calculateRentalPrice(items, 1, defaultConfig);

    expect(result.nextTier).toBeDefined();
    expect(result.nextTier!.unitsNeeded).toBe(2);
    expect(result.nextTier!.discountPercent).toBe(10);
  });

  it("returns no next tier at highest tier", () => {
    const items = [makeMattress(8)];
    const result = calculateRentalPrice(items, 1, defaultConfig);

    expect(result.nextTier).toBeUndefined();
  });

  it("handles empty cart", () => {
    const result = calculateRentalPrice([], 3, defaultConfig);
    expect(result.subtotal).toBe(0);
    expect(result.total).toBe(0);
    expect(result.mattressQty).toBe(0);
  });
});

// ============================================================
// calculateEndDate
// ============================================================

describe("calculateEndDate", () => {
  it("adds days correctly", () => {
    expect(calculateEndDate("2026-01-01", 3)).toBe("2026-01-04");
  });

  it("handles month boundary", () => {
    expect(calculateEndDate("2026-01-30", 5)).toBe("2026-02-04");
  });

  it("handles year boundary", () => {
    expect(calculateEndDate("2025-12-30", 5)).toBe("2026-01-04");
  });

  it("returns empty string for empty input", () => {
    expect(calculateEndDate("", 3)).toBe("");
  });

  it("handles 1 day duration", () => {
    expect(calculateEndDate("2026-03-05", 1)).toBe("2026-03-06");
  });
});

// ============================================================
// calculateDeliveryEstimate
// ============================================================

describe("calculateDeliveryEstimate", () => {
  it("returns placeholder when no date selected", () => {
    const result = calculateDeliveryEstimate(null, 14);
    expect(result).toBe("Pilih tanggal untuk estimasi pengantaran");
  });

  it("returns formatted future date", () => {
    // Far future date — always not today
    const result = calculateDeliveryEstimate("2030-06-15", 14);
    expect(result).toContain("Antar");
  });

  it("returns same-day message before cutoff", () => {
    // Set fake time to 08:00 local time
    vi.useFakeTimers();
    const fakeNow = new Date();
    fakeNow.setHours(8, 0, 0, 0);
    vi.setSystemTime(fakeNow);

    // Build todayStr from local date parts (matching function internals)
    const y = fakeNow.getFullYear();
    const m = String(fakeNow.getMonth() + 1).padStart(2, "0");
    const d = String(fakeNow.getDate()).padStart(2, "0");
    const todayStr = `${y}-${m}-${d}`;

    const result = calculateDeliveryEstimate(todayStr, 14);
    expect(result).toBe("Bisa antar hari ini! 🚚");

    vi.useRealTimers();
  });

  it("returns next-day message after cutoff", () => {
    // Set fake time to 16:00 local time
    vi.useFakeTimers();
    const fakeNow = new Date();
    fakeNow.setHours(16, 0, 0, 0);
    vi.setSystemTime(fakeNow);

    const y = fakeNow.getFullYear();
    const m = String(fakeNow.getMonth() + 1).padStart(2, "0");
    const d = String(fakeNow.getDate()).padStart(2, "0");
    const todayStr = `${y}-${m}-${d}`;

    const result = calculateDeliveryEstimate(todayStr, 14);
    expect(result).toBe("Antar besok pagi");

    vi.useRealTimers();
  });
});

// ============================================================
// validateDuration
// ============================================================

describe("validateDuration", () => {
  const config = { minDuration: 1, maxDuration: 30 };

  it("returns valid for duration within range", () => {
    const result = validateDuration(5, config);
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it("returns valid for minimum duration", () => {
    const result = validateDuration(1, config);
    expect(result.isValid).toBe(true);
  });

  it("returns valid for maximum duration", () => {
    const result = validateDuration(30, config);
    expect(result.isValid).toBe(true);
  });

  it("returns invalid for below minimum", () => {
    const result = validateDuration(0, config);
    expect(result.isValid).toBe(false);
    expect(result.adjustedValue).toBe(1);
    expect(result.message).toContain("Minimal");
  });

  it("returns invalid for above maximum", () => {
    const result = validateDuration(31, config);
    expect(result.isValid).toBe(false);
    expect(result.adjustedValue).toBe(30);
    expect(result.message).toContain("Maksimal");
  });

  it("returns invalid for NaN", () => {
    const result = validateDuration(NaN, config);
    expect(result.isValid).toBe(false);
    expect(result.adjustedValue).toBe(1);
  });

  it("returns invalid for negative", () => {
    const result = validateDuration(-5, config);
    expect(result.isValid).toBe(false);
    expect(result.adjustedValue).toBe(1);
  });
});
