/**
 * @vitest-environment jsdom
 */
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LOCATION_SELECTION_CACHE_KEY } from '@/lib/location-selection';
import { useAutoLocation } from './useAutoLocation';

const geolocationMocks = vi.hoisted(() => ({
  getCurrentLocation: vi.fn(),
  reverseGeocode: vi.fn(),
}));

vi.mock('@/scripts/geolocation', () => geolocationMocks);

const manualSelection = {
  coords: { lat: -7.812345, lng: 110.412345 },
  source: 'manual',
  address: {
    street: 'Titik manual pelanggan',
    kelurahan: 'Caturtunggal',
    kecamatan: 'Depok',
    kota: 'Sleman',
    provinsi: 'Daerah Istimewa Yogyakarta',
    postcode: '55281',
  },
};

describe('useAutoLocation manual selection arbitration', () => {
  beforeEach(() => {
    sessionStorage.clear();
    geolocationMocks.getCurrentLocation.mockReset();
    geolocationMocks.reverseGeocode.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    vi.restoreAllMocks();
  });

  it('replays a cached manual selection when the calculator mounts later', async () => {
    vi.useFakeTimers();
    sessionStorage.setItem(LOCATION_SELECTION_CACHE_KEY, JSON.stringify(manualSelection));
    const locationSelected = vi.fn();

    renderHook(() => useAutoLocation());
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    // Models Calculator/Suspense attaching its listener after the hook mounted.
    window.addEventListener('location-selected', locationSelected);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(locationSelected).toHaveBeenCalledOnce();
    expect((locationSelected.mock.calls[0]?.[0] as CustomEvent).detail).toEqual(manualSelection);
    expect(geolocationMocks.getCurrentLocation).not.toHaveBeenCalled();

    window.removeEventListener('location-selected', locationSelected);
  });

  it('replays the latest manual cache when its original event preceded a late listener', async () => {
    vi.useFakeTimers();
    const newerManualSelection = {
      ...manualSelection,
      coords: { lat: -7.765432, lng: 110.456789 },
      address: { ...manualSelection.address, street: 'Titik manual terbaru' },
    };
    sessionStorage.setItem(LOCATION_SELECTION_CACHE_KEY, JSON.stringify(manualSelection));
    const locationSelected = vi.fn();

    renderHook(() => useAutoLocation());
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
      sessionStorage.setItem(LOCATION_SELECTION_CACHE_KEY, JSON.stringify(newerManualSelection));
      await vi.advanceTimersByTimeAsync(100);
    });
    // The newer map event happened before this simulated Calculator listener.
    window.addEventListener('location-selected', locationSelected);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    expect(locationSelected).toHaveBeenCalledOnce();
    expect((locationSelected.mock.calls[0]?.[0] as CustomEvent).detail).toEqual(
      newerManualSelection,
    );
    expect(JSON.parse(sessionStorage.getItem(LOCATION_SELECTION_CACHE_KEY) ?? 'null')).toEqual(
      newerManualSelection,
    );

    window.removeEventListener('location-selected', locationSelected);
  });

  it.each([
    {
      label: 'outside-DIY',
      coords: { latitude: -6.2272373, longitude: 106.8584421 },
      address: {
        street: 'Jalan Tebet Timur Dalam III M',
        kelurahan: 'Tebet',
        kecamatan: '',
        kota: 'Jakarta Selatan',
        provinsi: 'Daerah Khusus Ibukota Jakarta',
        postcode: '12830',
        fullAddress: 'Jalan Tebet Timur Dalam III M, Jakarta Selatan',
      },
    },
    {
      label: 'DIY',
      coords: { latitude: -7.7956, longitude: 110.3695 },
      address: {
        street: 'Jalan Malioboro',
        kelurahan: 'Sosromenduran',
        kecamatan: 'Gedongtengen',
        kota: 'Kota Yogyakarta',
        provinsi: 'Daerah Istimewa Yogyakarta',
        postcode: '55271',
        fullAddress: 'Jalan Malioboro, Kota Yogyakarta',
      },
    },
  ])('ignores a late $label GPS result after a manual choice', async ({ coords, address }) => {
    let resolveAddress: ((value: typeof address) => void) | undefined;
    geolocationMocks.getCurrentLocation.mockResolvedValue(coords);
    geolocationMocks.reverseGeocode.mockReturnValue(new Promise((resolve) => {
      resolveAddress = resolve;
    }));
    const openPicker = vi.fn();
    const locationSelected = vi.fn();
    window.addEventListener('open-map-picker', openPicker);
    window.addEventListener('location-selected', locationSelected);

    renderHook(() => useAutoLocation());
    act(() => window.dispatchEvent(new Event('scroll')));
    await waitFor(() => expect(geolocationMocks.reverseGeocode).toHaveBeenCalledOnce());

    sessionStorage.setItem(LOCATION_SELECTION_CACHE_KEY, JSON.stringify(manualSelection));
    await act(async () => {
      resolveAddress?.(address);
      await Promise.resolve();
    });

    expect(openPicker).not.toHaveBeenCalled();
    expect(locationSelected).not.toHaveBeenCalled();
    expect(JSON.parse(sessionStorage.getItem(LOCATION_SELECTION_CACHE_KEY) ?? 'null')).toEqual(
      manualSelection,
    );

    window.removeEventListener('open-map-picker', openPicker);
    window.removeEventListener('location-selected', locationSelected);
  });
});
