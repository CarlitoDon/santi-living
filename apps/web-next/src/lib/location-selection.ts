export interface LocationSelection {
  coords: { lat: number; lng: number };
  address: {
    street?: string;
    kelurahan?: string;
    kecamatan?: string;
    kota?: string;
    provinsi?: string;
    postcode?: string;
  };
  source?: LocationSelectionSource;
}

export type LocationSelectionSource = 'automatic' | 'manual';

export const LOCATION_SELECTION_CACHE_KEY = 'sl_auto_location_result';
let latestSelectionSource: LocationSelectionSource | undefined;

/**
 * Keep the location used by the calculator and WhatsApp in lockstep.
 * An explicit map selection must replace any older automatic GPS result.
 */
export function publishLocationSelection(
  detail: LocationSelection,
  source: LocationSelectionSource,
): boolean {
  let existingSource: LocationSelectionSource | undefined;

  try {
    const cached = window.sessionStorage.getItem(LOCATION_SELECTION_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as { source?: unknown };
      if (parsed.source === 'automatic' || parsed.source === 'manual') {
        existingSource = parsed.source;
      }
    }

    // An explicit customer choice owns the location for the rest of the page
    // session. A GPS request that started earlier must not win a late race.
    if (
      source === 'automatic' &&
      (latestSelectionSource === 'manual' || existingSource === 'manual')
    ) return false;

    window.sessionStorage.setItem(
      LOCATION_SELECTION_CACHE_KEY,
      JSON.stringify({ ...detail, source }),
    );
  } catch {
    // Storage can be unavailable in private/restricted browsing. The calculator
    // should still receive the selected location in the current page.
  }

  latestSelectionSource = source;
  window.dispatchEvent(
    new CustomEvent('location-selected', { detail: { ...detail, source } }),
  );
  return true;
}
