/**
 * @vitest-environment jsdom
 */
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GtagScript } from './GtagScript';

vi.mock('next/script', () => ({
  default: ({ children, id }: { children?: string; id?: string }) => (
    <script id={id}>{children}</script>
  ),
}));

describe('GtagScript WhatsApp location flow', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    document.body.innerHTML = '';
    window.history.replaceState({}, '', '/id');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('preserves a manual map point when WA-click GPS reverse geocoding finishes later', async () => {
    let geolocationSuccess: PositionCallback | undefined;
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: vi.fn((success: PositionCallback) => {
          geolocationSuccess = success;
        }),
      },
    });
    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      value: vi.fn(() => true),
    });

    let resolveReverseGeocode: ((value: Response) => void) | undefined;
    const fetchMock = vi.fn(() => new Promise<Response>((resolve) => {
      resolveReverseGeocode = resolve;
    }));
    vi.stubGlobal('fetch', fetchMock);

    const locationEvent = vi.fn();
    window.addEventListener('location-selected', locationEvent);

    render(<GtagScript />);
    const trackerScript = document.querySelector<HTMLScriptElement>('#wa-conversion-tracker');
    expect(trackerScript?.textContent).toBeTruthy();
    const executableTracker = (trackerScript?.textContent ?? '').replace(
      'window.location.href = url.toString();',
      'window.__waTestUrl = url.toString();',
    );
    window.eval(executableTracker);

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=Halo';
    link.dataset.waSource = 'test';
    link.textContent = 'Chat WhatsApp';
    document.body.appendChild(link);

    fireEvent.click(link);
    expect(geolocationSuccess).toBeTypeOf('function');

    geolocationSuccess?.({
      coords: {
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: -7.7,
        longitude: 110.3,
        speed: null,
        toJSON: () => ({}),
      },
      timestamp: Date.now(),
      toJSON: () => ({}),
    } as GeolocationPosition);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());

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
    sessionStorage.setItem('sl_auto_location_result', JSON.stringify(manualSelection));

    await act(async () => {
      resolveReverseGeocode?.({
        ok: true,
        json: async () => ({
          display_name: 'Hasil GPS lama',
          address: { road: 'Jalan GPS Lama', city: 'Yogyakarta' },
        }),
      } as Response);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(JSON.parse(sessionStorage.getItem('sl_auto_location_result') ?? 'null')).toEqual(
      manualSelection,
    );
    expect(locationEvent).not.toHaveBeenCalled();
    const navigatedUrl = new URL(
      (window as Window & { __waTestUrl?: string }).__waTestUrl ?? 'http://localhost/',
    );
    expect(navigatedUrl.searchParams.get('latitude')).toBe('-7.812345');
    expect(navigatedUrl.searchParams.get('longitude')).toBe('110.412345');
    expect(navigatedUrl.searchParams.get('address_text')).toContain('Titik manual pelanggan');

    window.removeEventListener('location-selected', locationEvent);
  });
});
