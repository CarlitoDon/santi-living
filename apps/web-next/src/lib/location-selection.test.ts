/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  consumeLocationPickerReason,
  isDiyProvince,
  LOCATION_SELECTION_CACHE_KEY,
  LOCATION_PICKER_PROMPT_KEY,
  publishLocationSelection,
  requestLocationPicker,
  type LocationSelection,
} from './location-selection';

describe('publishLocationSelection', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it.each([
    'Daerah Istimewa Yogyakarta',
    'DI Yogyakarta',
    'D.I. Yogyakarta',
    'DIY',
    'Yogyakarta',
  ])('recognizes %s as the DIY province', (province) => {
    expect(isDiyProvince(province)).toBe(true);
  });

  it.each(['Jawa Tengah', 'DKI Jakarta', '', undefined])(
    'does not classify %s as DIY',
    (province) => expect(isDiyProvince(province)).toBe(false),
  );

  it('persists and emits an outside-DIY prompt until consumed', () => {
    const listener = vi.fn();
    window.addEventListener('open-map-picker', listener);
    requestLocationPicker('outside-diy');
    expect(sessionStorage.getItem(LOCATION_PICKER_PROMPT_KEY)).toBe('outside-diy');
    expect(listener).toHaveBeenCalledOnce();
    expect(consumeLocationPickerReason()).toBe('outside-diy');
    expect(sessionStorage.getItem(LOCATION_PICKER_PROMPT_KEY)).toBeNull();
    window.removeEventListener('open-map-picker', listener);
  });

  it('replaces stale GPS coordinates before publishing a manual map selection', () => {
    const staleGps: LocationSelection = {
      coords: { lat: -7.7, lng: 110.3 },
      address: { street: 'Alamat GPS lama' },
    };
    const manualSelection: LocationSelection = {
      coords: { lat: -7.812345, lng: 110.412345 },
      address: {
        street: 'Jalan Pilihan Pelanggan',
        kelurahan: 'Caturtunggal',
        kecamatan: 'Depok',
        kota: 'Sleman',
        provinsi: 'Daerah Istimewa Yogyakarta',
        postcode: '55281',
      },
    };
    sessionStorage.setItem(LOCATION_SELECTION_CACHE_KEY, JSON.stringify(staleGps));

    const listener = vi.fn();
    window.addEventListener('location-selected', listener);

    publishLocationSelection(manualSelection, 'manual');

    expect(JSON.parse(sessionStorage.getItem(LOCATION_SELECTION_CACHE_KEY) ?? 'null')).toEqual({
      ...manualSelection,
      source: 'manual',
    });
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent<LocationSelection>).detail).toEqual({
      ...manualSelection,
      source: 'manual',
    });

    window.removeEventListener('location-selected', listener);
  });

  it('does not let a late automatic GPS result overwrite a manual selection', () => {
    const manualSelection: LocationSelection = {
      coords: { lat: -7.812345, lng: 110.412345 },
      address: { street: 'Titik manual pelanggan' },
    };
    const lateGps: LocationSelection = {
      coords: { lat: -7.7, lng: 110.3 },
      address: { street: 'Hasil GPS yang terlambat' },
    };
    const listener = vi.fn();
    window.addEventListener('location-selected', listener);

    expect(publishLocationSelection(manualSelection, 'manual')).toBe(true);
    expect(publishLocationSelection(lateGps, 'automatic')).toBe(false);

    expect(JSON.parse(sessionStorage.getItem(LOCATION_SELECTION_CACHE_KEY) ?? 'null')).toEqual({
      ...manualSelection,
      source: 'manual',
    });
    expect(listener).toHaveBeenCalledOnce();

    window.removeEventListener('location-selected', listener);
  });
});
