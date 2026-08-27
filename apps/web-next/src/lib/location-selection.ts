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

export type LocationPickerReason = 'manual' | 'outside-diy';

export const LOCATION_SELECTION_CACHE_KEY = 'sl_auto_location_result';
export const LOCATION_PICKER_PROMPT_KEY = 'sl_location_picker_prompt';
let latestSelectionSource: LocationSelectionSource | undefined;

export function isDiyProvince(value?: string): boolean {
  const normalized = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  return [
    'daerah istimewa yogyakarta',
    'di yogyakarta',
    'd i yogyakarta',
    'diy',
    'yogyakarta',
  ].includes(normalized);
}

export function requestLocationPicker(reason: LocationPickerReason): void {
  try {
    window.sessionStorage.setItem(LOCATION_PICKER_PROMPT_KEY, reason);
  } catch {
    // The live event still opens the picker when storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent('open-map-picker', { detail: { reason } }));
}

export function consumeLocationPickerReason(): LocationPickerReason | null {
  try {
    const reason = window.sessionStorage.getItem(LOCATION_PICKER_PROMPT_KEY);
    window.sessionStorage.removeItem(LOCATION_PICKER_PROMPT_KEY);
    return reason === 'outside-diy' || reason === 'manual' ? reason : null;
  } catch {
    return null;
  }
}

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
  try {
    window.sessionStorage.removeItem(LOCATION_PICKER_PROMPT_KEY);
  } catch {
    // Storage is optional; publishing the in-page event is still sufficient.
  }
  window.dispatchEvent(
    new CustomEvent('location-selected', { detail: { ...detail, source } }),
  );
  return true;
}
