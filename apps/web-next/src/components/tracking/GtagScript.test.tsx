/**
 * @vitest-environment jsdom
 */
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { GtagScript } from './GtagScript';

vi.mock('next/script', () => ({
  default: ({ children, id }: { children?: string; id?: string }) => (
    <script id={id}>{children}</script>
  ),
}));

describe('GtagScript WhatsApp location flow', () => {
  type TestWindow = Window & {
    __waTestUrl?: string;
    gtag?: Mock;
    __santiTrackClarityEvent?: (eventName: string) => void;
  };

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
    (window as TestWindow).gtag = vi.fn((...args: unknown[]) => {
      const params = args[2] as { event_callback?: () => void } | undefined;
      params?.event_callback?.();
    });
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: undefined,
    });
    delete (window as Window & { __waTestUrl?: string }).__waTestUrl;
    Object.defineProperty(document, 'referrer', {
      configurable: true,
      value: '',
    });
    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      value: undefined,
    });
  });

  afterEach(() => {
    cleanup();
    delete (window as TestWindow).gtag;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('proceeds to WhatsApp for current Jakarta GPS without blocking', async () => {
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

    expect(openPicker).not.toHaveBeenCalled();
    await waitFor(() => expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeDefined());
    expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toContain('/api/wa');

    window.removeEventListener('open-map-picker', openPicker);
  });

  it('emits a qualified conversion only after a persisted service-area lead', async () => {
    sessionStorage.setItem('sl_auto_location_result', JSON.stringify({
      coords: { lat: -7.812345, lng: 110.412345 },
      source: 'manual',
      address: {
        street: 'Titik manual pelanggan',
        kota: 'Sleman',
        provinsi: 'Daerah Istimewa Yogyakarta',
      },
    }));
    let conversionCallback: (() => void) | undefined;
    const gtag = vi.fn((...args: unknown[]) => {
      const params = args[2] as { event_callback?: () => void } | undefined;
      if (typeof params?.event_callback !== 'function') return;
      if (args[1] === 'santi_whatsapp_qualified') {
        params.event_callback();
        return;
      }
      conversionCallback = params.event_callback;
    });
    (window as TestWindow).gtag = gtag;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        persisted: true,
        cityClassification: 'service_area',
      }),
    } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=Halo';
    link.dataset.waSource = 'test';
    document.body.appendChild(link);
    fireEvent.click(link);

    await waitFor(() => expect(gtag).toHaveBeenCalledWith(
      'event',
      'santi_whatsapp_qualified',
      expect.objectContaining({
        city_classification: 'service_area',
        persistence_status: 'confirmed',
      }),
    ));
    expect((window as TestWindow).__waTestUrl).toBeUndefined();

    const qualifiedCall = gtag.mock.calls.find((call) => call[1] === 'santi_whatsapp_qualified');
    const conversionCall = gtag.mock.calls.find((call) => call[1] === 'conversion');
    const qualifiedParams = qualifiedCall?.[2] as { event_id?: string } | undefined;
    expect(conversionCall?.[2]).toMatchObject({
      send_to: 'AW-17865321955/y7bwCKTm3J0cEOPb7MZC',
      event_id: qualifiedParams?.event_id,
    });
    expect(conversionCallback).toBeTypeOf('function');
    conversionCallback?.();
    await waitFor(() => expect((window as TestWindow).__waTestUrl).toContain('/api/wa'));
    expect(fetchMock).toHaveBeenCalledWith('/api/lead/track', expect.objectContaining({
      method: 'POST',
    }));
    expect((window as TestWindow).__waTestUrl).toContain('/api/wa');
  });

  it('forwards WhatsApp funnel milestones to Clarity without attribution payloads', async () => {
    sessionStorage.setItem('sl_auto_location_result', JSON.stringify({
      coords: { lat: -7.812345, lng: 110.412345 },
      source: 'manual',
      address: {
        street: 'Titik manual pelanggan',
        kota: 'Sleman',
        provinsi: 'Daerah Istimewa Yogyakarta',
      },
    }));
    const clarityEvent = vi.fn();
    (window as TestWindow).__santiTrackClarityEvent = clarityEvent;
    (window as TestWindow).gtag = vi.fn();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        persisted: true,
        cityClassification: 'service_area',
      }),
    } as Response));

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=Halo';
    document.body.appendChild(link);
    fireEvent.click(link);

    await waitFor(() => expect(clarityEvent).toHaveBeenCalledWith('santi_whatsapp_qualified'));
    expect(clarityEvent).toHaveBeenCalledWith('whatsapp_click');
    expect(clarityEvent.mock.calls.flat()).toEqual(
      expect.arrayContaining(['whatsapp_click', 'santi_whatsapp_qualified']),
    );
  });

  it('navigates without a conversion when lead persistence is not confirmed', async () => {
    sessionStorage.setItem('sl_auto_location_result', JSON.stringify({
      coords: { lat: -7.812345, lng: 110.412345 },
      source: 'manual',
      address: {
        street: 'Titik manual pelanggan',
        kota: 'Sleman',
        provinsi: 'Daerah Istimewa Yogyakarta',
      },
    }));
    const gtag = vi.fn();
    (window as TestWindow).gtag = gtag;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        persisted: false,
        cityClassification: 'service_area',
      }),
    } as Response));

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=Halo';
    document.body.appendChild(link);
    fireEvent.click(link);

    await waitFor(() => expect((window as TestWindow).__waTestUrl).toContain('/api/wa'));
    expect(gtag.mock.calls.some((call) => call[1] === 'santi_whatsapp_qualified')).toBe(false);
    expect(gtag.mock.calls.some((call) => call[1] === 'conversion')).toBe(false);
  });

  it('infers carpet metadata from a locale-prefixed WhatsApp path', async () => {
    window.history.replaceState({}, '', '/id/sewa-karpet-merah-jogja');
    sessionStorage.setItem('sl_auto_location_result', JSON.stringify({
      coords: { lat: -7.812345, lng: 110.412345 },
      source: 'manual',
      address: {
        street: 'Titik manual pelanggan',
        kota: 'Sleman',
        provinsi: 'Daerah Istimewa Yogyakarta',
      },
    }));
    const gtag = vi.fn();
    (window as TestWindow).gtag = gtag;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        persisted: false,
        cityClassification: 'service_area',
      }),
    } as Response));

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=Halo';
    document.body.appendChild(link);
    fireEvent.click(link);

    await waitFor(() => expect(gtag).toHaveBeenCalledWith(
      'event',
      'whatsapp_click',
      expect.objectContaining({
        product_category: 'karpet',
        page_type: 'subcategory_page',
        intent: 'sewa_karpet_permadani_merah',
      }),
    ));
  });

  it('keeps a generic multi-service homepage inquiry unclassified', async () => {
    sessionStorage.setItem('sl_auto_location_result', JSON.stringify({
      coords: { lat: -7.812345, lng: 110.412345 },
      source: 'manual',
      address: {
        street: 'Titik manual pelanggan',
        kota: 'Sleman',
        provinsi: 'Daerah Istimewa Yogyakarta',
      },
    }));
    const gtag = vi.fn();
    (window as TestWindow).gtag = gtag;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        persisted: false,
        cityClassification: 'service_area',
      }),
    } as Response));

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=' + encodeURIComponent('Kebutuhan saya: {kasur / kursi / karpet}');
    link.dataset.waSource = 'homepage_services';
    document.body.appendChild(link);
    fireEvent.click(link);

    await waitFor(() => expect(gtag).toHaveBeenCalledWith(
      'event',
      'whatsapp_click',
      expect.objectContaining({
        product_category: 'general',
        page_type: 'homepage',
        intent: 'general_rental_inquiry',
      }),
    ));
  });

  it('infers chair metadata from a locale-prefixed WhatsApp path', async () => {
    window.history.replaceState({}, '', '/id/sewa-kursi-acara');
    sessionStorage.setItem('sl_auto_location_result', JSON.stringify({
      coords: { lat: -7.812345, lng: 110.412345 },
      source: 'manual',
      address: {
        street: 'Titik manual pelanggan',
        kota: 'Sleman',
        provinsi: 'Daerah Istimewa Yogyakarta',
      },
    }));
    const gtag = vi.fn();
    (window as TestWindow).gtag = gtag;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        persisted: false,
        cityClassification: 'service_area',
      }),
    } as Response));

    const link = document.createElement('a');
    link.href = '/api/wa?to=6289519119092&text=Halo';
    document.body.appendChild(link);
    fireEvent.click(link);

    await waitFor(() => expect(gtag).toHaveBeenCalledWith(
      'event',
      'whatsapp_click',
      expect.objectContaining({
        product_category: 'kursi',
        page_type: 'service_page',
        intent: 'sewa_kursi_acara',
      }),
    ));
  });

  it('infers event metadata from a locale-prefixed phone path', () => {
    window.history.replaceState({}, '', '/id/sewa-perlengkapan-event');
    const gtag = vi.fn();
    (window as TestWindow).gtag = gtag;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true } as Response));

    const link = document.createElement('a');
    link.href = 'tel:+6289519119092';
    document.body.appendChild(link);
    fireEvent.click(link);

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'phone_click',
      expect.objectContaining({
        product_category: 'event',
        page_type: 'landing',
        intent: 'paket_perlengkapan_acara',
      }),
    );
  });

  it.each([
    {
      label: 'unsupported geolocation',
      geolocation: undefined,
    },
    {
      label: 'denied geolocation',
      geolocation: {
        getCurrentPosition: vi.fn((_success: PositionCallback, error: PositionErrorCallback) => {
          error({ code: 1, message: 'denied', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 });
        }),
      },
    },
    {
      label: 'timed-out geolocation',
      geolocation: {
        getCurrentPosition: vi.fn((_success: PositionCallback, error: PositionErrorCallback) => {
          error({ code: 3, message: 'timeout', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 });
        }),
      },
    },
    {
      label: 'geolocation exception',
      geolocation: {
        getCurrentPosition: vi.fn(() => {
          throw new Error('geolocation failed');
        }),
      },
    },
  ])('proceeds to WhatsApp for $label without blocking', async ({ geolocation }) => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: geolocation,
    });
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

    expect(openPicker).not.toHaveBeenCalled();
    await waitFor(() => expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeDefined());
    expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toContain('/api/wa');

    window.removeEventListener('open-map-picker', openPicker);
  });

  it('proceeds to WhatsApp for a Central Java point inside the broad DIY coordinate box', async () => {
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

    expect(openPicker).not.toHaveBeenCalled();
    await waitFor(() => expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeDefined());
    expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toContain('/api/wa');

    window.removeEventListener('open-map-picker', openPicker);
  });

  it('proceeds to WhatsApp when a point inside the broad bounds cannot be verified', async () => {
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

    expect(openPicker).not.toHaveBeenCalled();
    await waitFor(() => expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeDefined());
    expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toContain('/api/wa');

    window.removeEventListener('open-map-picker', openPicker);
  });

  it('proceeds to WhatsApp for an existing Jakarta cache previously mislabeled as DIY', async () => {
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

    expect(openPicker).not.toHaveBeenCalled();
    await waitFor(() => expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeDefined());
    expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toContain('/api/wa');

    window.removeEventListener('open-map-picker', openPicker);
  });

  it('proceeds to WhatsApp for an unversioned automatic Central Java cache mislabeled as DIY', async () => {
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

    expect(openPicker).not.toHaveBeenCalled();
    await waitFor(() => expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeDefined());
    expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toContain('/api/wa');

    window.removeEventListener('open-map-picker', openPicker);
  });

  it('falls back to keepalive fetch when the beacon queue rejects a lead event', async () => {
    const sendBeacon = vi.fn(() => false);
    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      value: sendBeacon,
    });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const link = document.createElement('a');
    link.href = 'tel:+6289519119092';
    link.dataset.phoneSource = 'test';
    document.body.appendChild(link);
    fireEvent.click(link);

    expect(sendBeacon).toHaveBeenCalledOnce();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      '/api/lead/track',
      expect.objectContaining({ method: 'POST', keepalive: true }),
    ));
  });

  it('keeps a manual DIY point when late GPS resolves in Jakarta', async () => {
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
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/lead/track');
    await waitFor(() => expect((window as TestWindow).__waTestUrl).toContain('/api/wa'));
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
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => new Promise<Response>((resolve) => {
        resolveReverseGeocode = resolve;
      }))
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          ok: true,
          persisted: false,
          cityClassification: 'service_area',
        }),
      } as Response);
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
    await waitFor(() => expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toContain('/api/wa'));
    const navigatedUrl = new URL(
      (window as Window & { __waTestUrl?: string }).__waTestUrl ?? 'http://localhost/',
    );
    expect(navigatedUrl.searchParams.get('latitude')).toBe('-7.812345');
    expect(navigatedUrl.searchParams.get('longitude')).toBe('110.412345');
    expect(navigatedUrl.searchParams.get('address_text')).toContain('Titik manual pelanggan');

    window.removeEventListener('location-selected', locationEvent);
  });

  describe('attribution fallback', () => {
    it('falls back to direct/none when attribution is empty and no referrer', async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
      vi.stubGlobal('fetch', fetchMock);

      const link = document.createElement('a');
      link.href = '/api/wa?to=6289519119092&text=Halo';
      document.body.appendChild(link);
      fireEvent.click(link);

      await waitFor(() => expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeDefined());
      const navigatedUrl = new URL((window as Window & { __waTestUrl?: string }).__waTestUrl!);
      expect(navigatedUrl.searchParams.get('source')).toBe('direct');
      expect(navigatedUrl.searchParams.get('medium')).toBe('none');

      const gtagCalls = (window as TestWindow).gtag?.mock.calls ?? [];
      const waClickCall = gtagCalls.find((call) => call[1] === 'whatsapp_click');
      expect(waClickCall?.[2]).toMatchObject({
        utm_source: 'direct',
        utm_medium: 'none',
      });

      expect(fetchMock).toHaveBeenCalledWith('/api/lead/track', expect.objectContaining({
        body: expect.stringContaining('"source":"direct"'),
      }));
      const leadPayload = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(leadPayload.source).toBe('direct');
      expect(leadPayload.medium).toBe('none');
    });

    it('uses stored utm_source and utm_medium from sl_attribution_v1', async () => {
      localStorage.setItem('sl_attribution_v1', JSON.stringify({
        last: {
          source: 'facebook',
          medium: 'cpc',
          campaign: 'kasur_promo',
        },
      }));
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
      vi.stubGlobal('fetch', fetchMock);

      const link = document.createElement('a');
      link.href = '/api/wa?to=6289519119092&text=Halo';
      document.body.appendChild(link);
      fireEvent.click(link);

      await waitFor(() => expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeDefined());
      const navigatedUrl = new URL((window as Window & { __waTestUrl?: string }).__waTestUrl!);
      expect(navigatedUrl.searchParams.get('source')).toBe('facebook');
      expect(navigatedUrl.searchParams.get('medium')).toBe('cpc');
      expect(navigatedUrl.searchParams.get('campaign')).toBe('kasur_promo');

      const gtagCalls = (window as TestWindow).gtag?.mock.calls ?? [];
      const waClickCall = gtagCalls.find((call) => call[1] === 'whatsapp_click');
      expect(waClickCall?.[2]).toMatchObject({
        utm_source: 'facebook',
        utm_medium: 'cpc',
        utm_campaign: 'kasur_promo',
      });

      const leadPayload = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(leadPayload.source).toBe('facebook');
      expect(leadPayload.medium).toBe('cpc');
      expect(leadPayload.campaign).toBe('kasur_promo');
    });

    it('falls back to google/cpc when paid click ID is present in URL or attr', async () => {
      window.history.replaceState({}, '', '/id?gclid=test-gclid-123');
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
      vi.stubGlobal('fetch', fetchMock);

      const link = document.createElement('a');
      link.href = '/api/wa?to=6289519119092&text=Halo';
      document.body.appendChild(link);
      fireEvent.click(link);

      await waitFor(() => expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeDefined());
      const navigatedUrl = new URL((window as Window & { __waTestUrl?: string }).__waTestUrl!);
      expect(navigatedUrl.searchParams.get('source')).toBe('google');
      expect(navigatedUrl.searchParams.get('medium')).toBe('cpc');
      expect(navigatedUrl.searchParams.get('gclid')).toBe('test-gclid-123');

      const gtagCalls = (window as TestWindow).gtag?.mock.calls ?? [];
      const waClickCall = gtagCalls.find((call) => call[1] === 'whatsapp_click');
      expect(waClickCall?.[2]).toMatchObject({
        utm_source: 'google',
        utm_medium: 'cpc',
        gclid: 'test-gclid-123',
      });

      const leadPayload = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(leadPayload.source).toBe('google');
      expect(leadPayload.medium).toBe('cpc');
      expect(leadPayload.gclid).toBe('test-gclid-123');
    });

    it('falls back to google/organic when document.referrer contains google', async () => {
      Object.defineProperty(document, 'referrer', {
        configurable: true,
        value: 'https://www.google.co.id/search?q=santi+living+jogja',
      });
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
      vi.stubGlobal('fetch', fetchMock);

      const link = document.createElement('a');
      link.href = '/api/wa?to=6289519119092&text=Halo';
      document.body.appendChild(link);
      fireEvent.click(link);

      await waitFor(() => expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeDefined());
      const navigatedUrl = new URL((window as Window & { __waTestUrl?: string }).__waTestUrl!);
      expect(navigatedUrl.searchParams.get('source')).toBe('google');
      expect(navigatedUrl.searchParams.get('medium')).toBe('organic');

      const gtagCalls = (window as TestWindow).gtag?.mock.calls ?? [];
      const waClickCall = gtagCalls.find((call) => call[1] === 'whatsapp_click');
      expect(waClickCall?.[2]).toMatchObject({
        utm_source: 'google',
        utm_medium: 'organic',
      });

      const leadPayload = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(leadPayload.source).toBe('google');
      expect(leadPayload.medium).toBe('organic');
    });

    it('falls back to domain/referral when document.referrer is another domain', async () => {
      Object.defineProperty(document, 'referrer', {
        configurable: true,
        value: 'https://instagram.com/p/abc123xyz',
      });
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
      vi.stubGlobal('fetch', fetchMock);

      const link = document.createElement('a');
      link.href = '/api/wa?to=6289519119092&text=Halo';
      document.body.appendChild(link);
      fireEvent.click(link);

      await waitFor(() => expect((window as Window & { __waTestUrl?: string }).__waTestUrl).toBeDefined());
      const navigatedUrl = new URL((window as Window & { __waTestUrl?: string }).__waTestUrl!);
      expect(navigatedUrl.searchParams.get('source')).toBe('instagram.com');
      expect(navigatedUrl.searchParams.get('medium')).toBe('referral');

      const gtagCalls = (window as TestWindow).gtag?.mock.calls ?? [];
      const waClickCall = gtagCalls.find((call) => call[1] === 'whatsapp_click');
      expect(waClickCall?.[2]).toMatchObject({
        utm_source: 'instagram.com',
        utm_medium: 'referral',
      });

      const leadPayload = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(leadPayload.source).toBe('instagram.com');
      expect(leadPayload.medium).toBe('referral');
    });

    it('applies resolved attribution to enriched lead payload in reverse geocode callback', async () => {
      sessionStorage.setItem('sl_auto_location_result', JSON.stringify({
        coords: { lat: -7.812345, lng: 110.412345 },
        source: 'manual',
        address: {
          street: 'Titik manual pelanggan',
          kota: 'Sleman',
          provinsi: 'Daerah Istimewa Yogyakarta',
        },
      }));
      localStorage.setItem('sl_attribution_v1', JSON.stringify({
        last: {
          source: 'google',
          medium: 'cpc',
          campaign: 'kasur_diy',
        },
      }));
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          ok: true,
          persisted: true,
          cityClassification: 'service_area',
        }),
      } as Response);
      vi.stubGlobal('fetch', fetchMock);

      const link = document.createElement('a');
      link.href = '/api/wa?to=6289519119092&text=Halo';
      document.body.appendChild(link);
      fireEvent.click(link);

      await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/lead/track', expect.anything()));
      const leadPayload = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(leadPayload.source).toBe('google');
      expect(leadPayload.medium).toBe('cpc');
      expect(leadPayload.campaign).toBe('kasur_diy');
    });
  });
});
