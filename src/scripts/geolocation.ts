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
              new Error("Izin lokasi ditolak. Silakan ketik alamat manual.")
            );
            break;
          case error.POSITION_UNAVAILABLE:
            reject(
              new Error("Lokasi tidak tersedia. Silakan ketik alamat manual.")
            );
            break;
          case error.TIMEOUT:
            reject(
              new Error("Waktu habis. Coba lagi atau ketik alamat manual.")
            );
            break;
          default:
            reject(
              new Error(
                "Error mendapatkan lokasi. Silakan ketik alamat manual."
              )
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Reverse geocode coordinates to address using Nominatim
 * @param coords GPS coordinates
 * @returns Promise with formatted address
 */
export async function reverseGeocode(
  coords: Coordinates
): Promise<FormattedAddress> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        "Accept-Language": "id",
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mendapatkan alamat dari koordinat");
    }

    const data = await response.json();

    if (!data.address) {
      throw new Error("Alamat tidak ditemukan untuk lokasi ini");
    }

    return formatAddress(data.address);
  } catch (error) {
    throw new Error("Koneksi gagal. Periksa internet Anda.");
  }
}

/**
 * Format Nominatim address to Indonesian address string
 * @param address Nominatim address object
 * @returns Formatted address for Indonesia
 */
function formatAddress(address: any): FormattedAddress {
  // Extract components from Nominatim Indonesia structure
  // Based on actual API response structure:
  // - road: street name (often empty in rural areas)
  // - hamlet/neighbourhood: sub-village area
  // - village: desa/kelurahan name
  // - city/city_district: kelurahan (urban areas)
  // - municipality: kecamatan
  // - county: kabupaten/kota
  // - state: provinsi

  const road = address.road || "";

  // Kelurahan: can be in city, village, hamlet, neighbourhood
  const kelurahan =
    address.city ||
    address.village ||
    address.hamlet ||
    address.neighbourhood ||
    address.suburb ||
    "";

  // Kecamatan: can be in municipality, city_district
  const kecamatan = address.municipality || address.city_district || "";

  // Kabupaten/Kota: county
  const kota = address.county || address.town || "";

  // Provinsi: state
  const provinsi = address.state || "DI Yogyakarta";

  // Kode Pos
  const postcode = address.postcode || "";

  // Build street-level address
  // Use road if available, otherwise use kelurahan name as the area
  const street = road || kelurahan || "Area tidak diketahui";

  // Build full address
  const parts = [street];
  if (kelurahan && kelurahan !== street) parts.push(kelurahan);
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
  lon2: number
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
