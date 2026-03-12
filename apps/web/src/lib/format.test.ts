import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate } from "./format";

// ============================================================
// formatCurrency
// ============================================================

describe("formatCurrency", () => {
  it("formats millions with dot separators", () => {
    const result = formatCurrency(1500000);
    // Indonesian locale uses dot as thousands separator
    expect(result).toBe("1.500.000");
  });

  it("formats thousands", () => {
    const result = formatCurrency(50000);
    expect(result).toBe("50.000");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("0");
  });

  it("formats small number", () => {
    expect(formatCurrency(500)).toBe("500");
  });

  it("formats hundreds of millions", () => {
    const result = formatCurrency(250000000);
    expect(result).toBe("250.000.000");
  });
});

// ============================================================
// formatDate
// ============================================================

describe("formatDate", () => {
  it("formats date with default options (weekday, day, month)", () => {
    const result = formatDate("2026-03-05");
    // Expected: "Kamis, 5 Mar" (Indonesian locale)
    expect(result).toContain("5");
    expect(result).toContain("Mar");
  });

  it("accepts Date object", () => {
    const result = formatDate(new Date(2026, 0, 15)); // Jan 15
    expect(result).toContain("15");
    expect(result).toContain("Jan");
  });

  it("accepts custom format options", () => {
    const result = formatDate("2026-06-20", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    expect(result).toContain("2026");
    expect(result).toContain("20");
  });
});
