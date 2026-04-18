import { describe, it, expect, vi, beforeEach } from "vitest";
import { matchAddressToKode } from "./address-matcher";
import type { WilayahItem } from "./nusantarakita-api";

// ============================================================
// Mock the nusantarakita-api module
// ============================================================

const mockKotaList: WilayahItem[] = [
  { kode: "3471", nama: "Kota Yogyakarta", lat: -7.8, lng: 110.36 },
  { kode: "3402", nama: "Kabupaten Bantul", lat: -7.88, lng: 110.33 },
  { kode: "3403", nama: "Kabupaten Gunung Kidul", lat: -7.98, lng: 110.6 },
];

const mockKecamatanMap: Record<string, WilayahItem[]> = {
  "3471": [
    { kode: "347101", nama: "Mantrijeron", lat: -7.81, lng: 110.36 },
    { kode: "347102", nama: "Kraton", lat: -7.8, lng: 110.36 },
    { kode: "347103", nama: "Mergangsan", lat: -7.81, lng: 110.37 },
  ],
  "3402": [
    { kode: "340201", nama: "Sewon", lat: -7.84, lng: 110.36 },
    { kode: "340202", nama: "Kasihan", lat: -7.83, lng: 110.33 },
  ],
};

const mockKelurahanMap: Record<string, WilayahItem[]> = {
  "347101": [
    {
      kode: "3471011001",
      nama: "Gedongkiwo",
      lat: -7.81,
      lng: 110.36,
      kode_pos: "55142",
    },
    {
      kode: "3471011002",
      nama: "Suryodiningratan",
      lat: -7.81,
      lng: 110.36,
      kode_pos: "55141",
    },
  ],
  "347102": [
    {
      kode: "3471021001",
      nama: "Panembahan",
      lat: -7.8,
      lng: 110.36,
      kode_pos: "55131",
    },
  ],
};

vi.mock("./nusantarakita-api", () => ({
  getKabupatenKota: vi.fn(async () => mockKotaList),
  getKecamatan: vi.fn(
    async (kode: string) => mockKecamatanMap[kode] || [],
  ),
  getKelurahan: vi.fn(
    async (kode: string) => mockKelurahanMap[kode] || [],
  ),
}));

// ============================================================
// matchAddressToKode
// ============================================================

describe("matchAddressToKode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Happy path: full match ---

  it("matches full address: kota → kecamatan → kelurahan", async () => {
    const result = await matchAddressToKode({
      kota: "Yogyakarta",
      kecamatan: "Mantrijeron",
      kelurahan: "Gedongkiwo",
      postcode: "55142",
    });

    expect(result.kotaKode).toBe("3471");
    expect(result.kota).toBe("Kota Yogyakarta");
    expect(result.kecamatanKode).toBe("347101");
    expect(result.kecamatan).toBe("Mantrijeron");
    expect(result.kelurahanKode).toBe("3471011001");
    expect(result.kelurahan).toBe("Gedongkiwo");
    expect(result.zip).toBe("55142");
  });

  // --- Normalization: prefix stripping ---

  it("matches kota with 'Kota' prefix stripped", async () => {
    const result = await matchAddressToKode({
      kota: "Kota Yogyakarta",
      kecamatan: "Kraton",
    });

    expect(result.kotaKode).toBe("3471");
    expect(result.kecamatanKode).toBe("347102");
  });

  it("matches kota with 'Kabupaten' prefix stripped", async () => {
    const result = await matchAddressToKode({
      kota: "Kabupaten Bantul",
    });

    expect(result.kotaKode).toBe("3402");
    expect(result.kota).toBe("Kabupaten Bantul");
  });

  // --- Normalization: spaces removed ---

  it("matches names with different spacing (GunungKidul vs Gunung Kidul)", async () => {
    const result = await matchAddressToKode({
      kota: "Gunung Kidul", // data has "Kabupaten Gunung Kidul"
    });

    expect(result.kotaKode).toBe("3403");
  });

  // --- Partial match: only kota ---

  it("returns partial result when only kota matches", async () => {
    const result = await matchAddressToKode({
      kota: "Bantul",
    });

    expect(result.kotaKode).toBe("3402");
    expect(result.kecamatanKode).toBe("");
    expect(result.kelurahanKode).toBe("");
  });

  // --- Partial match: kota + kecamatan, no kelurahan ---

  it("returns partial result when kelurahan not found", async () => {
    const result = await matchAddressToKode({
      kota: "Yogyakarta",
      kecamatan: "Mantrijeron",
      kelurahan: "NonExistentVillage",
    });

    expect(result.kotaKode).toBe("3471");
    expect(result.kecamatanKode).toBe("347101");
    expect(result.kelurahanKode).toBe(""); // not found
  });

  // --- No match at all ---

  it("returns empty result when kota not found", async () => {
    const result = await matchAddressToKode({
      kota: "Jakarta",
      kecamatan: "Menteng",
    });

    expect(result.kotaKode).toBe("");
    expect(result.kecamatanKode).toBe("");
  });

  it("returns empty result when no kota provided", async () => {
    const result = await matchAddressToKode({
      kecamatan: "Mantrijeron",
    });

    expect(result.kotaKode).toBe("");
    expect(result.kecamatanKode).toBe("");
  });

  // --- Fallback: OSM swapped kecamatan/kelurahan ---

  it("handles OSM swapped values (kelurahan field = kecamatan name)", async () => {
    // OSM sometimes returns kecamatan in the kelurahan field and vice versa
    const result = await matchAddressToKode({
      kota: "Yogyakarta",
      kecamatan: "Panembahan", // This is actually a kelurahan name
      kelurahan: "Kraton", // This is actually a kecamatan name
    });

    // Should fallback: try kelurahan ("Kraton") as kecamatan → match
    // Then try kecamatan ("Panembahan") as kelurahan → match
    expect(result.kecamatanKode).toBe("347102"); // Kraton
    expect(result.kecamatan).toBe("Kraton");
    expect(result.kelurahanKode).toBe("3471021001"); // Panembahan
    expect(result.kelurahan).toBe("Panembahan");
  });

  // --- Zip code fallback ---

  it("uses kelurahan kode_pos when no postcode provided", async () => {
    const result = await matchAddressToKode({
      kota: "Yogyakarta",
      kecamatan: "Mantrijeron",
      kelurahan: "Suryodiningratan",
      // no postcode
    });

    expect(result.zip).toBe("55141"); // from kelurahan data
  });

  it("keeps provided postcode over kelurahan kode_pos", async () => {
    const result = await matchAddressToKode({
      kota: "Yogyakarta",
      kecamatan: "Mantrijeron",
      kelurahan: "Gedongkiwo",
      postcode: "99999", // explicit postcode
    });

    expect(result.zip).toBe("99999"); // keeps original
  });

  // --- Error handling ---

  it("returns partial results even on API error", async () => {
    // Import and override mock for this test
    const api = await import("./nusantarakita-api");
    vi.mocked(api.getKabupatenKota).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const result = await matchAddressToKode({
      kota: "Yogyakarta",
      kecamatan: "Mantrijeron",
    });

    // Should return empty but not throw
    expect(result.kotaKode).toBe("");
    expect(result.kecamatanKode).toBe("");
  });
});
