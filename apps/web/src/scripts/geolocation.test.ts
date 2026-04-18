/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  calculateDistance,
  normalizeName,
  extractKelurahanFromDisplayName,
  formatAddress,
  getCurrentLocation,
  reverseGeocode,
} from "./geolocation";

// ============================================================
// calculateDistance (Haversine)
// ============================================================

const storeLat = -7.7956;
const storeLng = 110.3695;

describe("calculateDistance", () => {
  it("returns 0 for same coordinates", () => {
    expect(calculateDistance(storeLat, storeLng, storeLat, storeLng)).toBe(0);
  });

  it("calculates short distance (~5 km)", () => {
    const d = calculateDistance(storeLat, storeLng, -7.84, 110.37);
    expect(d).toBeGreaterThan(4);
    expect(d).toBeLessThan(6);
  });

  it("calculates medium distance (~15 km)", () => {
    const d = calculateDistance(storeLat, storeLng, -7.75, 110.49);
    expect(d).toBeGreaterThan(12);
    expect(d).toBeLessThan(18);
  });

  it("calculates longer distance (~30 km)", () => {
    const d = calculateDistance(storeLat, storeLng, -7.98, 110.6);
    expect(d).toBeGreaterThan(25);
    expect(d).toBeLessThan(35);
  });

  it("is symmetric (A→B = B→A)", () => {
    const d1 = calculateDistance(storeLat, storeLng, -7.84, 110.37);
    const d2 = calculateDistance(-7.84, 110.37, storeLat, storeLng);
    expect(d1).toBeCloseTo(d2, 10);
  });

  it("handles cross-hemisphere (~1250 km)", () => {
    const d = calculateDistance(storeLat, storeLng, 1.3521, 103.8198);
    expect(d).toBeGreaterThan(1200);
    expect(d).toBeLessThan(1300);
  });

  it("handles very small distances (meters)", () => {
    const d = calculateDistance(storeLat, storeLng, -7.7947, 110.3695);
    expect(d).toBeGreaterThan(0.05);
    expect(d).toBeLessThan(0.2);
  });
});

// ============================================================
// normalizeName
// ============================================================

describe("normalizeName", () => {
  it("returns empty for undefined", () => {
    expect(normalizeName(undefined)).toBe("");
  });

  it("returns empty for empty string", () => {
    expect(normalizeName("")).toBe("");
  });

  it("lowercases and removes spaces", () => {
    expect(normalizeName("Gunung Kidul")).toBe("gunungkidul");
  });

  it("strips 'Kabupaten' prefix", () => {
    expect(normalizeName("Kabupaten Sleman")).toBe("sleman");
  });

  it("strips 'Kota' prefix", () => {
    expect(normalizeName("Kota Yogyakarta")).toBe("yogyakarta");
  });

  it("strips 'Kecamatan' prefix", () => {
    expect(normalizeName("Kecamatan Depok")).toBe("depok");
  });

  it("strips 'Kelurahan' prefix", () => {
    expect(normalizeName("Kelurahan Caturtunggal")).toBe("caturtunggal");
  });

  it("strips 'Desa' prefix", () => {
    expect(normalizeName("Desa Sendangarum")).toBe("sendangarum");
  });

  it("handles input without prefix", () => {
    expect(normalizeName("Mantrijeron")).toBe("mantrijeron");
  });
});

// ============================================================
// extractKelurahanFromDisplayName
// ============================================================

describe("extractKelurahanFromDisplayName", () => {
  it("extracts desa before kecamatan in display_name", () => {
    // display_name: "Road, Desa, Kecamatan, Kabupaten, Provinsi"
    const result = extractKelurahanFromDisplayName(
      "Jl. Raya, Banjaroyo, Kalibawang, Kulon Progo, Daerah Istimewa Yogyakarta",
      "Kalibawang",
    );
    expect(result).toBe("Banjaroyo");
  });

  it("tries second step back if first is same as kecamatan", () => {
    // "Road, Desa, Kecamatan, Kecamatan, Kabupaten, Provinsi"
    const result = extractKelurahanFromDisplayName(
      "Jl. Utama, Sendangarum, Minggir, Minggir, Sleman, DIY",
      "Minggir",
    );
    expect(result).toBe("Sendangarum");
  });

  it("returns empty when kecamatan not found in display_name", () => {
    const result = extractKelurahanFromDisplayName(
      "Random Place, Somewhere, Province",
      "NonExistentKecamatan",
    );
    expect(result).toBe("");
  });

  it("returns empty when kecamatan is the first part", () => {
    const result = extractKelurahanFromDisplayName(
      "Kalibawang, Kulon Progo, DIY",
      "Kalibawang",
    );
    expect(result).toBe(""); // kecamatan at index 0, nothing before it
  });

  it("handles empty display_name", () => {
    const result = extractKelurahanFromDisplayName("", "Minggir");
    expect(result).toBe("");
  });
});

// ============================================================
// formatAddress — Nominatim response parsing
// ============================================================

describe("formatAddress", () => {
  it("formats urban area (Kota Yogyakarta)", () => {
    const result = formatAddress({
      road: "Jl. Malioboro",
      neighbourhood: "Kampung Tegal Kemuning",
      suburb: "Tegalpanggung",
      city_district: "Danurejan",
      city: "Kota Yogyakarta",
      state: "Daerah Istimewa Yogyakarta",
      postcode: "55213",
    });

    expect(result.street).toBe("Jl. Malioboro");
    expect(result.kelurahan).toBe("Tegalpanggung");
    expect(result.kecamatan).toBe("Danurejan");
    expect(result.kota).toBe("Kota Yogyakarta");
    expect(result.provinsi).toBe("Daerah Istimewa Yogyakarta");
    expect(result.postcode).toBe("55213");
    expect(result.fullAddress).toContain("Jl. Malioboro");
    expect(result.fullAddress).toContain("Tegalpanggung");
  });

  it("formats rural area (Kabupaten Sleman)", () => {
    const result = formatAddress({
      road: "Jl. Kaliurang",
      village: "Sendangarum",
      municipality: "Minggir",
      county: "Sleman",
      state: "Daerah Istimewa Yogyakarta",
      postcode: "55562",
    });

    expect(result.street).toBe("Jl. Kaliurang");
    expect(result.kelurahan).toBe("Sendangarum");
    expect(result.kecamatan).toBe("Minggir");
    expect(result.kota).toBe("Sleman");
    expect(result.postcode).toBe("55562");
  });

  it("uses county over city for kota (rural priority)", () => {
    const result = formatAddress({
      village: "Sendangarum",
      municipality: "Minggir",
      city: "Moyudan", // NOT kabupaten — village area
      county: "Sleman", // actual kabupaten
      state: "DIY",
    });

    expect(result.kota).toBe("Sleman"); // county wins
  });

  it("falls back to city when no county (urban area)", () => {
    const result = formatAddress({
      suburb: "Panembahan",
      city_district: "Kraton",
      city: "Kota Yogyakarta",
      state: "DIY",
    });

    expect(result.kota).toBe("Kota Yogyakarta");
  });

  it("uses hamlet as kelurahan when no suburb/village", () => {
    const result = formatAddress({
      hamlet: "Dusun Karangsari",
      municipality: "Kalibawang",
      county: "Kulon Progo",
      state: "DIY",
    });

    expect(result.kelurahan).toBe("Dusun Karangsari");
  });

  it("handles ambiguous village=municipality with display_name extraction", () => {
    const result = formatAddress(
      {
        village: "Kalibawang",
        municipality: "Kalibawang",
        county: "Kulon Progo",
        state: "DIY",
      },
      "Jl. Raya, Banjaroyo, Kalibawang, Kulon Progo, DIY",
    );

    // Should extract "Banjaroyo" from display_name since village == municipality
    expect(result.kelurahan).toBe("Banjaroyo");
    expect(result.kecamatan).toBe("Kalibawang");
  });

  it("uses neighbourhood as street fallback", () => {
    const result = formatAddress({
      neighbourhood: "Kampung Mangkuyudan",
      suburb: "Mantrijeron",
      city_district: "Mantrijeron",
      city: "Kota Yogyakarta",
      state: "DIY",
    });

    expect(result.street).toBe("Kampung Mangkuyudan");
  });

  it("uses kelurahan as street when nothing else available", () => {
    const result = formatAddress({
      suburb: "Gedongkiwo",
      city_district: "Mantrijeron",
      city: "Kota Yogyakarta",
      state: "DIY",
    });

    expect(result.street).toBe("Gedongkiwo");
  });

  it("uses 'Area tidak diketahui' when no address info", () => {
    const result = formatAddress({
      state: "DIY",
    });

    expect(result.street).toBe("Area tidak diketahui");
  });

  it("defaults provinsi to 'DI Yogyakarta' when missing", () => {
    const result = formatAddress({});
    expect(result.provinsi).toBe("DI Yogyakarta");
  });

  it("includes neighbourhood in fullAddress when road exists", () => {
    const result = formatAddress({
      road: "Jl. Malioboro",
      neighbourhood: "Kampung Tegal Kemuning",
      suburb: "Tegalpanggung",
      city_district: "Danurejan",
      city: "Kota Yogyakarta",
      state: "DIY",
    });

    expect(result.fullAddress).toContain("Kampung Tegal Kemuning");
    expect(result.fullAddress).toContain("Tegalpanggung");
  });

  it("builds fullAddress with all parts", () => {
    const result = formatAddress({
      road: "Jl. Test",
      suburb: "Kelurahan A",
      city_district: "Kecamatan B",
      city: "Kota C",
      state: "Provinsi D",
      postcode: "12345",
    });

    expect(result.fullAddress).toBe(
      "Jl. Test, Kelurahan A, Kecamatan B, Kota C, Provinsi D, 12345",
    );
  });
});

// ============================================================
// getCurrentLocation (Browser GPS API)
// ============================================================

describe("getCurrentLocation", () => {
  const mockGetCurrentPosition = vi.fn();

  beforeEach(() => {
    Object.defineProperty(navigator, "geolocation", {
      value: { getCurrentPosition: mockGetCurrentPosition },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves with coordinates on success", async () => {
    mockGetCurrentPosition.mockImplementation((success: (pos: unknown) => void) => {
      success({ coords: { latitude: -7.7956, longitude: 110.3695 } });
    });

    const coords = await getCurrentLocation();
    expect(coords).toEqual({ latitude: -7.7956, longitude: 110.3695 });
  });

  it("rejects with permission denied error", async () => {
    mockGetCurrentPosition.mockImplementation(
      (_: unknown, error: (err: { code: number; PERMISSION_DENIED: number }) => void) => {
        error({ code: 1, PERMISSION_DENIED: 1 });
      },
    );

    await expect(getCurrentLocation()).rejects.toThrow("Izin lokasi ditolak");
  });

  it("rejects with position unavailable error", async () => {
    mockGetCurrentPosition.mockImplementation(
      (_: unknown, error: (err: { code: number; POSITION_UNAVAILABLE: number; PERMISSION_DENIED: number }) => void) => {
        error({ code: 2, POSITION_UNAVAILABLE: 2, PERMISSION_DENIED: 1 });
      },
    );

    await expect(getCurrentLocation()).rejects.toThrow("Lokasi tidak tersedia");
  });

  it("rejects with timeout error", async () => {
    mockGetCurrentPosition.mockImplementation(
      (_: unknown, error: (err: { code: number; TIMEOUT: number; PERMISSION_DENIED: number; POSITION_UNAVAILABLE: number }) => void) => {
        error({ code: 3, TIMEOUT: 3, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2 });
      },
    );

    await expect(getCurrentLocation()).rejects.toThrow("Waktu habis");
  });

  it("rejects when geolocation not supported", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    await expect(getCurrentLocation()).rejects.toThrow("tidak didukung");
  });
});

// ============================================================
// reverseGeocode (Nominatim API via fetch)
// ============================================================

describe("reverseGeocode", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns formatted address from Nominatim response", async () => {
    const mockResponse = {
      address: {
        road: "Jl. Malioboro",
        suburb: "Tegalpanggung",
        city_district: "Danurejan",
        city: "Kota Yogyakarta",
        state: "Daerah Istimewa Yogyakarta",
        postcode: "55213",
      },
      display_name: "Jl. Malioboro, Tegalpanggung, Danurejan, Kota Yogyakarta",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await reverseGeocode({ latitude: -7.7928, longitude: 110.3647 });
    expect(result.street).toBe("Jl. Malioboro");
    expect(result.kelurahan).toBe("Tegalpanggung");
    expect(result.kecamatan).toBe("Danurejan");
    expect(result.kota).toBe("Kota Yogyakarta");
  });

  it("throws on network error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network failure"));

    await expect(
      reverseGeocode({ latitude: -7.7928, longitude: 110.3647 }),
    ).rejects.toThrow("Koneksi gagal");
  });
});

