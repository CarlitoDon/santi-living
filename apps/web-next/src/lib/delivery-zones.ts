/**
 * Delivery Zones — Quick Ongkir Estimate Without GPS
 *
 * Static list of kecamatan in the Greater Yogyakarta area with approximate
 * road distances from the store (Jl. Godean KM 10, Sleman).
 *
 * Used by the quick-estimate dropdown so users can get an instant ongkir
 * figure without granting GPS or picking a pin on the map.
 */

import { calculateDeliveryFee } from "./calculator-logic";

export interface DeliveryZone {
  /** Kecamatan name as displayed in the dropdown */
  kecamatan: string;
  /** Kabupaten / Kota the kecamatan belongs to */
  kota: string;
  /** Approximate road distance in km from the store */
  distanceKm: number;
}

/**
 * Approximate road distances from Jl. Godean KM 10, Sleman.
 * Distances are rough estimates based on common driving routes and
 * may vary ±2 km depending on exact destination within the kecamatan.
 */
export const DELIVERY_ZONES: DeliveryZone[] = [
  // ---- Kab. Sleman (nearest → farthest) ----
  { kecamatan: "Godean", kota: "Kab. Sleman", distanceKm: 2 },
  { kecamatan: "Minggir", kota: "Kab. Sleman", distanceKm: 5 },
  { kecamatan: "Seyegan", kota: "Kab. Sleman", distanceKm: 5.5 },
  { kecamatan: "Sleman", kota: "Kab. Sleman", distanceKm: 7 },
  { kecamatan: "Mlati", kota: "Kab. Sleman", distanceKm: 8 },
  { kecamatan: "Ngaglik", kota: "Kab. Sleman", distanceKm: 9 },
  { kecamatan: "Depok", kota: "Kab. Sleman", distanceKm: 10 },
  { kecamatan: "Kalasan", kota: "Kab. Sleman", distanceKm: 12 },
  { kecamatan: "Berbah", kota: "Kab. Sleman", distanceKm: 14 },
  { kecamatan: "Prambanan", kota: "Kab. Sleman", distanceKm: 16 },
  { kecamatan: "Pakem", kota: "Kab. Sleman", distanceKm: 17 },
  { kecamatan: "Cangkringan", kota: "Kab. Sleman", distanceKm: 20 },

  // ---- Kab. Bantul ----
  { kecamatan: "Bantul", kota: "Kab. Bantul", distanceKm: 10 },
  { kecamatan: "Sewon", kota: "Kab. Bantul", distanceKm: 11 },
  { kecamatan: "Kasihan", kota: "Kab. Bantul", distanceKm: 10 },
  { kecamatan: "Banguntapan", kota: "Kab. Bantul", distanceKm: 12 },
  { kecamatan: "Pleret", kota: "Kab. Bantul", distanceKm: 14 },
  { kecamatan: "Sedayu", kota: "Kab. Bantul", distanceKm: 8 },

  // ---- Kota Yogyakarta ----
  { kecamatan: "Gondokusuman", kota: "Kota Yogyakarta", distanceKm: 8 },
  { kecamatan: "Danurejan", kota: "Kota Yogyakarta", distanceKm: 9 },
  { kecamatan: "Gedongtengen", kota: "Kota Yogyakarta", distanceKm: 8 },
  { kecamatan: "Ngupasan", kota: "Kota Yogyakarta", distanceKm: 7 },
  { kecamatan: "Tegalrejo", kota: "Kota Yogyakarta", distanceKm: 8 },
  { kecamatan: "Kotagede", kota: "Kota Yogyakarta", distanceKm: 11 },
  { kecamatan: "Mergangsan", kota: "Kota Yogyakarta", distanceKm: 9 },
  { kecamatan: "Mantrijeron", kota: "Kota Yogyakarta", distanceKm: 10 },
  { kecamatan: "Ngampilan", kota: "Kota Yogyakarta", distanceKm: 8 },
  { kecamatan: "Pakualaman", kota: "Kota Yogyakarta", distanceKm: 7 },
  { kecamatan: "Jetis", kota: "Kota Yogyakarta", distanceKm: 8 },
  { kecamatan: "Nusukan", kota: "Kota Yogyakarta", distanceKm: 8 },
  { kecamatan: "KRATON", kota: "Kota Yogyakarta", distanceKm: 9 },
  { kecamatan: "Wirobrajan", kota: "Kota Yogyakarta", distanceKm: 8 },
];

export interface EstimateResult {
  /** Estimated delivery fee in Rupiah */
  fee: number;
  /** Estimated distance in km */
  distanceKm: number;
  /** Human-readable fee string e.g. "GRATIS" or "Rp 15.000" */
  feeLabel: string;
}

/**
 * Look up a kecamatan by name (case-insensitive) and return the estimated
 * delivery fee using the standard fuel-cost formula.
 *
 * @returns {EstimateResult} if the kecamatan is found, otherwise null.
 */
export function getEstimateByKecamatan(
  kecamatan: string,
): EstimateResult | null {
  const zone = DELIVERY_ZONES.find(
    (z) => z.kecamatan.toLowerCase() === kecamatan.toLowerCase(),
  );

  if (!zone) return null;

  const fee = calculateDeliveryFee(zone.distanceKm);

  return {
    fee,
    distanceKm: zone.distanceKm,
    feeLabel: fee === 0 ? "GRATIS" : `Rp ${fee.toLocaleString("id-ID")}`,
  };
}
