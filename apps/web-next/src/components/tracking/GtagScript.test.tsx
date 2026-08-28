/**
 * @vitest-environment jsdom
 */
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { GtagScript } from './GtagScript';

vi.mock('next/script', () => ({
  default: ({ children, id }: { children?: string; id?: string }) => (
    <script id={id}>{children}</script>
  ),
}));

describe('GtagScript WhatsApp location flow', () => {
  beforeAll(() => {
    const { unmount } = render(<GtagScript />);
    const trackerScript = document.querySelector<HTMLScriptElement>('#wa-conversion-tracker');
    expect(trackerScript?.textContent).toBeTruthy();
    const executableTracker = (trackerScript?.textContent ?? '').replace(
      'window.location.href = url.toString();',
      'window.__waTestUrl = url.toString();',
    );
    window.eval(executableTracker);
    unmount();
  });

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    document.body.innerHTML = '';
    window.history.replaceState({}, '', '/id');
    delete (window as Window & { __waTestUrl?: string }).__waTestUrl;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('opens the outside-DIY picker instead of WhatsApp for current Jakarta GPS', () => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: vi.fn((success: PositionCallback) => {
          success({
            coords: {
              accuracy: 10,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              latitude: -6.2272373,
              longitude: 106.8584421,
              speed: null,
              toJSON: () => ({}),
            },
            timestamp: Date.now(),
            toJSON: () => ({}),
          } as GeolocationPosition);
        }),
      },
    });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const openPicker = vi.fn();
    window.addEventListener('open-map-picker', openPicker);

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=Halo';
    link.textContent = 'Chat WhatsApp';
    document.body.appendChild(link);
    fireEvent.click(link);

    expect(openPicker).toHaveBeenCalledOnce();
    expect((openPicker.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({ reason: 'outside-diy' });
    expect(sessionStorage.getItem('sl_location_picker_prompt')).toBe('outside-diy');
    expect(fetchMock).not.toHaveBeenCalled();
    expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeUndefined();

    window.removeEventListener('open-map-picker', openPicker);
  });

  it('fails closed for a Central Java point inside the broad DIY coordinate box', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: vi.fn((success: PositionCallback) => {
          success({
            coords: {
              accuracy: 10,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              latitude: -7.7,
              longitude: 110.6,
              speed: null,
              toJSON: () => ({}),
            },
            timestamp: Date.now(),
            toJSON: () => ({}),
          } as GeolocationPosition);
        }),
      },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        display_name: 'Klaten, Jawa Tengah, Indonesia',
        address: {
          road: 'Jalan Klaten',
          county: 'Klaten',
          'ISO3166-2-lvl4': 'ID-JT',
        },
      }),
    } as Response));
    const openPicker = vi.fn();
    window.addEventListener('open-map-picker', openPicker);

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=Halo';
    link.textContent = 'Chat WhatsApp';
    document.body.appendChild(link);
    fireEvent.click(link);

    await waitFor(() => expect(openPicker).toHaveBeenCalledOnce());
    expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeUndefined();

    window.removeEventListener('open-map-picker', openPicker);
  });

  it('opens the picker when a point inside the broad bounds cannot be verified', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: vi.fn((success: PositionCallback) => {
          success({
            coords: {
              accuracy: 10,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              latitude: -7.7,
              longitude: 110.6,
              speed: null,
              toJSON: () => ({}),
            },
            timestamp: Date.now(),
            toJSON: () => ({}),
          } as GeolocationPosition);
        }),
      },
    });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network unavailable')));
    const openPicker = vi.fn();
    window.addEventListener('open-map-picker', openPicker);

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=Halo';
    link.textContent = 'Chat WhatsApp';
    document.body.appendChild(link);
    fireEvent.click(link);

    await waitFor(() => expect(openPicker).toHaveBeenCalledOnce());
    expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeUndefined();

    window.removeEventListener('open-map-picker', openPicker);
  });

  it('rejects an existing Jakarta cache that was previously mislabeled as DIY', () => {
    sessionStorage.setItem('sl_auto_location_result', JSON.stringify({
      coords: { lat: -6.2272373, lng: 106.8584421 },
      source: 'automatic',
      address: {
        street: 'Jalan Tebet Timur Dalam III M',
        kota: 'Jakarta Selatan',
        provinsi: 'DI Yogyakarta',
        postcode: '12830',
      },
    }));
    const openPicker = vi.fn();
    window.addEventListener('open-map-picker', openPicker);

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=Halo';
    link.textContent = 'Chat WhatsApp';
    document.body.appendChild(link);
    fireEvent.click(link);

    expect(openPicker).toHaveBeenCalledOnce();
    expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeUndefined();

    window.removeEventListener('open-map-picker', openPicker);
  });

  it('does not trust an unversioned automatic Central Java cache mislabeled as DIY', () => {
    sessionStorage.setItem('sl_auto_location_result', JSON.stringify({
      coords: { lat: -7.7, lng: 110.6 },
      source: 'automatic',
      address: {
        street: 'Cache lama',
        kota: 'Klaten',
        provinsi: 'DI Yogyakarta',
      },
    }));
    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      value: vi.fn(() => true),
    });
    const openPicker = vi.fn();
    window.addEventListener('open-map-picker', openPicker);

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=Halo';
    link.textContent = 'Chat WhatsApp';
    document.body.appendChild(link);
    fireEvent.click(link);

    expect(openPicker).toHaveBeenCalledOnce();
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeUndefined();

    window.removeEventListener('open-map-picker', openPicker);
  });

  it('keeps a manual DIY point when late GPS resolves in Jakarta', () => {
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
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const openPicker = vi.fn();
    window.addEventListener('open-map-picker', openPicker);

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=Halo';
    link.textContent = 'Chat WhatsApp';
    document.body.appendChild(link);
    fireEvent.click(link);

    const manual = {
      coords: { lat: -7.812345, lng: 110.412345 },
      source: 'manual',
      address: {
        street: 'Titik manual pelanggan',
        kota: 'Sleman',
        provinsi: 'Daerah Istimewa Yogyakarta',
      },
    };
    sessionStorage.setItem('sl_auto_location_result', JSON.stringify(manual));
    geolocationSuccess?.({
      coords: {
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: -6.2272373,
        longitude: 106.8584421,
        speed: null,
        toJSON: () => ({}),
      },
      timestamp: Date.now(),
      toJSON: () => ({}),
    } as GeolocationPosition);

    expect(openPicker).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    const navigatedUrl = new URL(
      (window as Window & { __waTestUrl?: string }).__waTestUrl ?? 'http://localhost/',
    );
    expect(navigatedUrl.searchParams.get('latitude')).toBe('-7.812345');
    expect(navigatedUrl.searchParams.get('longitude')).toBe('110.412345');

    window.removeEventListener('open-map-picker', openPicker);
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
