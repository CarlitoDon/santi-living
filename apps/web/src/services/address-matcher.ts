/**
 * Address Matcher Service
 * Matches reverse geocoded address names to Nusantarakita kode values
 */

import {
  getKabupatenKota,
  getKecamatan,
  getKelurahan,
  type WilayahItem,
} from "./nusantarakita-api";

export interface GeocodedAddress {
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
  postcode?: string;
}

export interface MatchedAddress {
  kotaKode: string;
  kota: string;
  kecamatanKode: string;
  kecamatan: string;
  kelurahanKode: string;
  kelurahan: string;
  zip: string;
}

/**
 * Normalize a name for matching by:
 * 1. Converting to lowercase
 * 2. Removing common prefixes (Kabupaten, Kota, Kecamatan, Kelurahan, Desa)
 * 3. Removing all spaces to handle "Kulon Progo" vs "Kulonprogo"
 * 4. Trimming whitespace
 */
function normalizeName(name: string): string {
  if (!name) return "";

  return name
    .toLowerCase()
    .replace(/^(kabupaten|kota|kecamatan|kelurahan|desa)\s+/i, "")
    .replace(/\s+/g, "") // Remove all spaces
    .trim();
}

/**
 * Find best match from a list of wilayah items based on normalized name
 * Returns the item with matching normalized name, or null if not found
 */
function findBestMatch(
  searchName: string,
  items: WilayahItem[],
): WilayahItem | null {
  if (!searchName) return null;

  const normalizedSearch = normalizeName(searchName);
  if (!normalizedSearch) return null;

  // Try exact match first (after normalization)
  for (const item of items) {
    const normalizedItem = normalizeName(item.nama);
    if (normalizedItem === normalizedSearch) {
      return item;
    }
  }

  // Try partial match (contains) - mostly for edge cases
  for (const item of items) {
    const normalizedItem = normalizeName(item.nama);
    if (
      normalizedItem.includes(normalizedSearch) ||
      normalizedSearch.includes(normalizedItem)
    ) {
      return item;
    }
  }

  return null;
}

/**
 * Match geocoded address names to Nusantarakita kode values
 * This allows dropdowns to be auto-filled when using GPS or map picker
 */
export async function matchAddressToKode(
  geocodedAddress: GeocodedAddress,
): Promise<MatchedAddress> {
  console.debug("🔍 [address-matcher] Input:", geocodedAddress);

  const result: MatchedAddress = {
    kotaKode: "",
    kota: "",
    kecamatanKode: "",
    kecamatan: "",
    kelurahanKode: "",
    kelurahan: "",
    zip: geocodedAddress.postcode || "",
  };

  try {
    // Step 1: Match Kabupaten/Kota
    if (geocodedAddress.kota) {
      const kotaList = await getKabupatenKota();
      console.debug(
        "📍 [address-matcher] Looking for kota:",
        geocodedAddress.kota,
        "in",
        kotaList.map((k) => k.nama),
      );
      const matchedKota = findBestMatch(geocodedAddress.kota, kotaList);

      if (matchedKota) {
        result.kotaKode = matchedKota.kode;
        result.kota = matchedKota.nama;
        console.debug("✅ [address-matcher] Matched kota:", matchedKota.nama);

        // Step 2: Match Kecamatan (only if we found kota)
        if (geocodedAddress.kecamatan) {
          const kecamatanList = await getKecamatan(matchedKota.kode);
          console.debug(
            "📍 [address-matcher] Looking for kecamatan:",
            geocodedAddress.kecamatan,
            "in",
            kecamatanList.map((k) => k.nama),
          );
          const matchedKecamatan = findBestMatch(
            geocodedAddress.kecamatan,
            kecamatanList,
          );

          if (matchedKecamatan) {
            result.kecamatanKode = matchedKecamatan.kode;
            result.kecamatan = matchedKecamatan.nama;
            console.debug(
              "✅ [address-matcher] Matched kecamatan:",
              matchedKecamatan.nama,
            );

            // Step 3: Match Kelurahan (only if we found kecamatan)
            if (geocodedAddress.kelurahan) {
              const kelurahanList = await getKelurahan(matchedKecamatan.kode);
              console.debug(
                "📍 [address-matcher] Looking for kelurahan:",
                geocodedAddress.kelurahan,
                "in",
                kelurahanList.map((k) => k.nama),
              );
              const matchedKelurahan = findBestMatch(
                geocodedAddress.kelurahan,
                kelurahanList,
              );

              if (matchedKelurahan) {
                result.kelurahanKode = matchedKelurahan.kode;
                result.kelurahan = matchedKelurahan.nama;
                console.debug(
                  "✅ [address-matcher] Matched kelurahan:",
                  matchedKelurahan.nama,
                );
                // Use kelurahan's postal code if available and not already set
                if (matchedKelurahan.kode_pos && !result.zip) {
                  result.zip = matchedKelurahan.kode_pos;
                }
              } else {
                console.warn(
                  "❌ [address-matcher] No match for kelurahan:",
                  geocodedAddress.kelurahan,
                );
              }
            } else {
              console.warn(
                "⚠️ [address-matcher] No kelurahan in geocoded address",
              );
            }
          } else {
            console.warn(
              "❌ [address-matcher] No match for kecamatan:",
              geocodedAddress.kecamatan,
            );
          }
        }
      } else {
        console.warn(
          "❌ [address-matcher] No match for kota:",
          geocodedAddress.kota,
        );
      }
    }
  } catch (error) {
    console.warn("Error matching address to kode:", error);
    // Return partial results even if there's an error
  }

  console.debug("📦 [address-matcher] Result:", result);
  return result;
}
