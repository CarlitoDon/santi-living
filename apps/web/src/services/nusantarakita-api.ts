/**
 * Location Data Service (Static JSON)
 *
 * Provides data for Indonesian administrative regions in DIY (Yogyakarta).
 * Uses static JSON data sourced from NusantaraKita CSV files:
 * https://github.com/Yuefii/NusantaraKita/tree/main/data/csv
 *
 * This replaces the previous API-based implementation that was unreliable
 * (NusantaraKita public API returning 500 errors).
 */

import kabupatenKotaData from "@/data/locations/kabupaten-kota.json";
import kecamatanData from "@/data/locations/kecamatan.json";
import kelurahanData from "@/data/locations/kelurahan.json";

const DIY_PROVINCE_CODE = "34";

export interface WilayahItem {
  kode: string;
  nama: string;
  lat: number;
  lng: number;
  kode_pos?: string; // Only on kelurahan/desa
}

/**
 * Get all Kabupaten/Kota in DIY (Daerah Istimewa Yogyakarta)
 */
export async function getKabupatenKota(): Promise<WilayahItem[]> {
  return kabupatenKotaData as WilayahItem[];
}

/**
 * Get all Kecamatan in a Kabupaten/Kota
 */
export async function getKecamatan(
  kodeKabKota: string,
): Promise<WilayahItem[]> {
  const data = (kecamatanData as Record<string, WilayahItem[]>)[kodeKabKota];
  return data || [];
}

/**
 * Get all Kelurahan/Desa in a Kecamatan
 */
export async function getKelurahan(
  kodeKecamatan: string,
): Promise<WilayahItem[]> {
  const data = (kelurahanData as Record<string, WilayahItem[]>)[kodeKecamatan];
  return data || [];
}

/**
 * DIY Province constant
 */
export const DIY_PROVINCE = {
  kode: DIY_PROVINCE_CODE,
  nama: "Daerah Istimewa Yogyakarta",
};
