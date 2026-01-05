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
  suburb: string;
  city: string;
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
  // Extract components (Nominatim structure)
  const road = address.road || "";
  const suburb =
    address.suburb || address.neighbourhood || address.village || "";
  const city =
    address.city ||
    address.town ||
    address.municipality ||
    address.county ||
    "Yogyakarta";

  // Build street-level address
  const street = road || suburb || "Area tidak diketahui";

  // Build full address
  const parts = [street];
  if (suburb && suburb !== street) {
    parts.push(suburb);
  }
  if (city) {
    parts.push(city);
  }

  const fullAddress = parts.join(", ");

  return {
    street,
    suburb,
    city,
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
