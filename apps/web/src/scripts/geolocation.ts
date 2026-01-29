// ==========================================================================
// Geolocation - Santi Living
// ==========================================================================

/**
 * Coordinates result from GPS
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Formatted address from reverse geocoding
 */
export interface FormattedAddress {
  street: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  postcode: string;
  fullAddress: string;
}

/**
 * Get current GPS location
 * @returns Promise with coordinates
 */
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation tidak didukung browser Anda"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new Error("Izin lokasi ditolak. Silakan ketik alamat manual."),
            );
            break;
          case error.POSITION_UNAVAILABLE:
            reject(
              new Error("Lokasi tidak tersedia. Silakan ketik alamat manual."),
            );
            break;
          case error.TIMEOUT:
            reject(
              new Error("Waktu habis. Coba lagi atau ketik alamat manual."),
            );
            break;
          default:
            reject(
              new Error(
                "Error mendapatkan lokasi. Silakan ketik alamat manual.",
              ),
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
}

/**
 * Reverse geocode coordinates to address using Nominatim
 * @param coords GPS coordinates
 * @returns Promise with formatted address
 */
export async function reverseGeocode(
  coords: Coordinates,
): Promise<FormattedAddress> {
  // Use local proxy to avoid CORS issues with Nominatim
  const url = `/api/reverse-geocode?lat=${coords.latitude}&lng=${coords.longitude}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Gagal mendapatkan alamat dari koordinat");
    }

    const data = await response.json();

    if (!data.address) {
      throw new Error("Alamat tidak ditemukan untuk lokasi ini");
    }

    return formatAddress(data.address, data.display_name);
  } catch {
    throw new Error("Koneksi gagal. Periksa internet Anda.");
  }
}

/**
 * Normalize a name for comparison
 * Removes common prefixes and standardizes spacing/casing
 */
function normalizeName(name: string | undefined): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/^(kabupaten|kota|kecamatan|kelurahan|desa)\s+/i, "")
    .replace(/\s+/g, "")
    .trim();
}

/**
 * Extract kelurahan from display_name when village field equals municipality
 * display_name format: "Road, Desa, Kecamatan, Kabupaten, Provinsi, Postcode, Country"
 *
 * Example: "Kalibawang, Banjaroyo, Kalibawang, Kulon Progo, Daerah Istimewa Yogyakarta, ..."
 * Parts: [road/area, desa, kecamatan, kabupaten, ...]
 *
 * We look for a part that comes BEFORE the kecamatan and is different from it
 */
function extractKelurahanFromDisplayName(
  displayName: string,
  kecamatanName: string,
): string {
  const parts = displayName.split(",").map((p) => p.trim());
  const normalizedKecamatan = normalizeName(kecamatanName);

  // Find the index of kecamatan in display_name
  let kecamatanIndex = -1;
  for (let i = 0; i < parts.length; i++) {
    if (normalizeName(parts[i]) === normalizedKecamatan) {
      kecamatanIndex = i;
      break;
    }
  }

  // If we found kecamatan and there's a part before it that's different from kecamatan
  if (kecamatanIndex > 0) {
    // Check the part immediately before kecamatan
    const potentialDesa = parts[kecamatanIndex - 1];
    if (
      normalizeName(potentialDesa) !== normalizedKecamatan &&
      potentialDesa.length > 0
    ) {
      console.debug(
        "[geolocation] Extracted desa from display_name:",
        potentialDesa,
        "at index",
        kecamatanIndex - 1,
      );
      return potentialDesa;
    }

    // If immediately before is same as kecamatan, try one more step back
    if (kecamatanIndex > 1) {
      const potentialDesa2 = parts[kecamatanIndex - 2];
      if (
        normalizeName(potentialDesa2) !== normalizedKecamatan &&
        potentialDesa2.length > 0
      ) {
        console.debug(
          "[geolocation] Extracted desa from display_name (2nd attempt):",
          potentialDesa2,
        );
        return potentialDesa2;
      }
    }
  }

  return "";
}

/**
 * Format Nominatim address to Indonesian address string
 * @param address Nominatim address object
 * @returns Formatted address for Indonesia
 *
 * Nominatim Indonesia structure varies by area type:
 *
 * URBAN areas (e.g., Kota Yogyakarta):
 * - road: street name
 * - neighbourhood: kampung/area kecil (e.g., "Kampung Tegal Kemuning")
 * - suburb: kelurahan (e.g., "Tegalpanggung")
 * - city_district: kecamatan (e.g., "Danurejan")
 * - city: kota (e.g., "Kota Yogyakarta") - NOTE: no county in urban areas!
 * - state: provinsi
 *
 * RURAL areas (e.g., Sleman, Bantul, etc.):
 * - road: street name
 * - hamlet: dusun
 * - village: desa/kelurahan (e.g., "Sendangarum")
 * - city: larger village area (NOT kabupaten!) - can be confusing
 * - municipality: kecamatan (e.g., "Minggir")
 * - county: kabupaten (e.g., "Sleman")
 * - state: provinsi
 */
function formatAddress(
  address: Record<string, string>,
  displayName?: string,
): FormattedAddress {
  const road = address.road || "";

  // Detect if we have an ambiguous village/municipality situation
  // This happens when Nominatim returns kecamatan name in village field
  const villageEqualsKecamatan =
    address.village &&
    address.municipality &&
    normalizeName(address.village) === normalizeName(address.municipality);

  // Try to extract actual kelurahan from display_name if village is ambiguous
  let extractedKelurahan = "";
  if (villageEqualsKecamatan && displayName) {
    extractedKelurahan = extractKelurahanFromDisplayName(
      displayName,
      address.municipality || "",
    );
    console.debug(
      "[geolocation] Village equals kecamatan, extracted kelurahan from display_name:",
      extractedKelurahan,
    );
  }

  // Kelurahan/Desa:
  // - Urban: suburb (kelurahan)
  // - Rural: village (desa) > hamlet (dusun)
  // - Fallback: extracted from display_name when village == municipality
  const kelurahan =
    address.suburb ||
    (villageEqualsKecamatan && extractedKelurahan
      ? extractedKelurahan
      : address.village) ||
    address.hamlet ||
    "";

  // Kecamatan:
  // - Urban: city_district
  // - Rural: municipality
  const kecamatan = address.city_district || address.municipality || "";

  // Kabupaten/Kota:
  // - Rural: county (e.g., "Sleman") - this should take priority!
  // - Urban: city (e.g., "Kota Yogyakarta") - only when county doesn't exist
  // NOTE: In rural areas, "city" field is NOT kabupaten - it's a village area!
  const kota = address.county || address.city || address.town || "";

  // Provinsi: state
  const provinsi = address.state || "DI Yogyakarta";

  // Kode Pos
  const postcode = address.postcode || "";

  // Build street-level address
  // Use road if available, otherwise use neighbourhood or kelurahan name as the area
  const street =
    road || address.neighbourhood || kelurahan || "Area tidak diketahui";

  // Build full address
  const parts = [street];
  // Add neighbourhood if we used road and neighbourhood exists
  if (road && address.neighbourhood) parts.push(address.neighbourhood);
  if (kelurahan && kelurahan !== street && kelurahan !== address.neighbourhood)
    parts.push(kelurahan);
  if (kecamatan) parts.push(kecamatan);
  if (kota) parts.push(kota);
  if (provinsi) parts.push(provinsi);
  if (postcode) parts.push(postcode);

  const fullAddress = parts.join(", ");

  return {
    street,
    kelurahan,
    kecamatan,
    kota,
    provinsi,
    postcode,
    fullAddress,
  };
}

/**
 * Calculate distance between two coordinates in km (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get current location and reverse geocode to address
 * @returns Promise with formatted address
 */
export async function getAddressFromCurrentLocation(): Promise<string> {
  const coords = await getCurrentLocation();
  const address = await reverseGeocode(coords);
  return address.fullAddress;
}
