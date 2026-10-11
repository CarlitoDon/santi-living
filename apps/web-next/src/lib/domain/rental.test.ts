import { describe, it, expect, vi } from "vitest";
import {
  calculateEndDate,
  calculateDeliveryEstimate,
} from "./rental";

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

