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
  const road = address.road || "";
  const kelurahan =
    address.hamlet || address.neighbourhood || address.suburb || "";
  const kecamatan = address.village || address.city_district || "";
  const kota =
    address.county ||
    address.city ||
    address.town ||
    address.municipality ||
    "";
  const provinsi = address.state || "DI Yogyakarta";
  const postcode = address.postcode || "";

  // Build street-level address
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
 * Get current location and reverse geocode to address
 * @returns Promise with formatted address
 */
export async function getAddressFromCurrentLocation(): Promise<string> {
  const coords = await getCurrentLocation();
  const address = await reverseGeocode(coords);
  return address.fullAddress;
}
