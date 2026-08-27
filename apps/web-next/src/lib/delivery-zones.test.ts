import { describe, expect, it } from "vitest";
import {
  DELIVERY_ZONES,
  getEstimateByKecamatan,
} from "@/lib/delivery-zones";

describe("getEstimateByKecamatan", () => {
  it("calculates fee for Godean (2 km) using fuel formula", () => {
    const result = getEstimateByKecamatan("Godean");
    expect(result).not.toBeNull();
    // 2 * 4 / 10 * 10000 = 8000
    expect(result!.fee).toBe(8_000);
    expect(result!.distanceKm).toBe(2);
    expect(result!.feeLabel).toBe("Rp 8.000");
  });

  it("calculates fee for Sleman kecamatan (~7 km)", () => {
    const result = getEstimateByKecamatan("Sleman");
    expect(result).not.toBeNull();
    expect(result!.distanceKm).toBe(7);
    // 7 * 4 / 10 * 10000 = 28000 → ceil to 28000
    expect(result!.fee).toBe(28_000);
    expect(result!.feeLabel).toBe("Rp 28.000");
  });

  it("calculates fee for Kalasan (~12 km)", () => {
    const result = getEstimateByKecamatan("Kalasan");
    expect(result).not.toBeNull();
    expect(result!.distanceKm).toBe(12);
    // 12 * 4 / 10 * 10000 = 48000
    expect(result!.fee).toBe(48_000);
  });

  it("calculates fee for Prambanan (>15 km)", () => {
    const result = getEstimateByKecamatan("Prambanan");
    expect(result).not.toBeNull();
    expect(result!.distanceKm).toBe(16);
    // 16 * 4 / 10 * 10000 = 64000
    expect(result!.fee).toBe(64_000);
  });

  it("is case-insensitive", () => {
    const lower = getEstimateByKecamatan("godean");
    const upper = getEstimateByKecamatan("GODEAN");
    const mixed = getEstimateByKecamatan("GoDeAn");
    expect(lower).not.toBeNull();
    expect(upper).not.toBeNull();
    expect(mixed).not.toBeNull();
    expect(lower!.fee).toBe(upper!.fee);
    expect(upper!.fee).toBe(mixed!.fee);
  });

  it("returns null for unknown kecamatan", () => {
    expect(getEstimateByKecamatan("Atlantis")).toBeNull();
    expect(getEstimateByKecamatan("")).toBeNull();
  });

  it("covers all entries in DELIVERY_ZONES", () => {
    for (const zone of DELIVERY_ZONES) {
      const result = getEstimateByKecamatan(zone.kecamatan);
      expect(result).not.toBeNull();
      expect(result!.distanceKm).toBe(zone.distanceKm);
    }
  });
});
