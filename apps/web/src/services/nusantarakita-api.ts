/**
 * Nusantarakita API Service
 * Provides data for Indonesian administrative regions (provinsi, kab/kota, kecamatan, kelurahan)
 * API Docs: https://nusantarakita.vercel.app
 */

const BASE_URL = "https://api-nusantarakita.vercel.app/v2";
const DIY_PROVINCE_CODE = "34";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms

export interface WilayahItem {
  kode: string;
  nama: string;
  lat: number;
  lng: number;
  kode_pos?: string; // Only on kelurahan/desa
}

interface ApiResponse {
  pagination: {
    total_item: number;
    total_halaman: number;
    halaman_saat_ini: number;
    ukuran_halaman: number;
  };
  data: WilayahItem[];
}

interface CacheEntry {
  data: WilayahItem[];
  timestamp: number;
}

/**
 * Get cached data or null if expired/not found
 */
function getFromCache(key: string): WilayahItem[] | null {
  try {
    const cached = localStorage.getItem(`nusantarakita_${key}`);
    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(`nusantarakita_${key}`);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Save data to cache
 */
function saveToCache(key: string, data: WilayahItem[]): void {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    localStorage.setItem(`nusantarakita_${key}`, JSON.stringify(entry));
  } catch {
    // Ignore cache errors (e.g., quota exceeded)
  }
}

/**
 * Fetch all pages from API (handles pagination)
 */
async function fetchAllPages(endpoint: string): Promise<WilayahItem[]> {
  const allData: WilayahItem[] = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const url = `${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}halaman=${currentPage}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const json: ApiResponse = await response.json();
    allData.push(...json.data);

    totalPages = json.pagination.total_halaman;
    currentPage++;
  } while (currentPage <= totalPages);

  return allData;
}

/**
 * Get all Kabupaten/Kota in DIY (Daerah Istimewa Yogyakarta)
 */
export async function getKabupatenKota(): Promise<WilayahItem[]> {
  const cacheKey = `kab_kota_${DIY_PROVINCE_CODE}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const data = await fetchAllPages(`/${DIY_PROVINCE_CODE}/kab-kota`);
  saveToCache(cacheKey, data);
  return data;
}

/**
 * Get all Kecamatan in a Kabupaten/Kota
 */
export async function getKecamatan(
  kodeKabKota: string,
): Promise<WilayahItem[]> {
  const cacheKey = `kecamatan_${kodeKabKota}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const data = await fetchAllPages(`/${kodeKabKota}/kecamatan`);
  saveToCache(cacheKey, data);
  return data;
}

/**
 * Get all Kelurahan/Desa in a Kecamatan
 */
export async function getKelurahan(
  kodeKecamatan: string,
): Promise<WilayahItem[]> {
  const cacheKey = `kelurahan_${kodeKecamatan}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const data = await fetchAllPages(`/${kodeKecamatan}/desa-kel`);
  saveToCache(cacheKey, data);
  return data;
}

/**
 * DIY Province constant
 */
export const DIY_PROVINCE = {
  kode: DIY_PROVINCE_CODE,
  nama: "Daerah Istimewa Yogyakarta",
};
