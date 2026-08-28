/**
 * @vitest-environment jsdom
 */
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LOCATION_SELECTION_CACHE_KEY,
  LOCATION_SELECTION_CLASSIFICATION_VERSION,
} from '@/lib/location-selection';
import { StepAddress } from './StepAddress';

const matcherMocks = vi.hoisted(() => ({
  matchAddressToKode: vi.fn(),
}));
const contextMocks = vi.hoisted(() => ({
  useCalculatorContext: vi.fn(),
}));

vi.mock('@/services/address-matcher', () => matcherMocks);
vi.mock('@/contexts/CalculatorContext', () => contextMocks);
vi.mock('@/components/calculator/useAddressDropdown', () => ({
  useAddressDropdown: () => ({
    kotaOptions: [], kecamatanOptions: [], kelurahanOptions: [],
    isLoadingKota: false, isLoadingKecamatan: false, isLoadingKelurahan: false,
    kotaKode: '', kecamatanKode: '', kelurahanKode: '',
    handleKotaChange: vi.fn(), handleKecamatanChange: vi.fn(), handleKelurahanChange: vi.fn(),
    error: null,
  }),
}));
vi.mock('@/components/calculator/SearchableDropdown', () => ({ SearchableDropdown: () => null }));
vi.mock('@/hooks/useDeliveryQuote', () => ({ useDeliveryQuote: () => 'idle' }));
vi.mock('@/utils/alert', () => ({ showAlert: vi.fn() }));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

const matchedAddress = {
  kelurahan: 'Caturtunggal',
  kelurahanKode: '3404072001',
  kecamatan: 'Depok',
  kecamatanKode: '340407',
  kota: 'Sleman',
  kotaKode: '3404',
  zip: '55281',
};

const automaticSelection = {
  coords: { lat: -7.79, lng: 110.37 },
  source: 'automatic' as const,
  classificationVersion: LOCATION_SELECTION_CLASSIFICATION_VERSION,
  address: {
    street: 'GPS lama',
    kelurahan: 'Otomatis',
    provinsi: 'Daerah Istimewa Yogyakarta',
  },
};
const manualSelection = {
  coords: { lat: -7.812345, lng: 110.412345 },
  source: 'manual' as const,
  address: {
    street: 'Titik manual',
    kelurahan: 'Manual',
    provinsi: 'Daerah Istimewa Yogyakarta',
  },
};

describe('StepAddress location selection arbitration', () => {
  const setCustomer = vi.fn();

  beforeEach(() => {
    sessionStorage.clear();
    setCustomer.mockReset();
    matcherMocks.matchAddressToKode.mockReset();
    contextMocks.useCalculatorContext.mockReturnValue({
      customer: {
        name: '', whatsapp: '', notes: '',
        address: {
          street: '', kelurahan: '', kelurahanKode: '', kecamatan: '', kecamatanKode: '',
          kota: '', kotaKode: '', provinsi: 'Daerah Istimewa Yogyakarta', provinsiKode: '34',
          zip: '', lat: '', lng: '',
        },
      },
      setCustomer,
      actions: { state: { deliveryFee: 0 }, setDeliveryFee: vi.fn() },
    });
  });

  afterEach(() => cleanup());

  function renderStep() {
    return render(<StepAddress
      errors={{}}
      setErrors={vi.fn()}
      onClearError={vi.fn()}
      onNext={vi.fn()}
      onBack={vi.fn()}
    />);
  }

  function configureDeferredMatches() {
    const automaticMatch = deferred<typeof matchedAddress>();
    const manualMatch = deferred<typeof matchedAddress>();
    matcherMocks.matchAddressToKode.mockImplementation((address: { kelurahan?: string }) =>
      address.kelurahan === 'Manual' ? manualMatch.promise : automaticMatch.promise,
    );
    return { automaticMatch, manualMatch };
  }

  async function publishManualAndResolve(manualMatch: ReturnType<typeof deferred<typeof matchedAddress>>) {
    sessionStorage.setItem(LOCATION_SELECTION_CACHE_KEY, JSON.stringify(manualSelection));
    act(() => {
      window.dispatchEvent(new CustomEvent('location-selected', { detail: manualSelection }));
    });
    await waitFor(() => expect(matcherMocks.matchAddressToKode).toHaveBeenCalledTimes(2));
    await act(async () => manualMatch.resolve(matchedAddress));
    await waitFor(() => expect(setCustomer).toHaveBeenCalledOnce());
    expect(setCustomer.mock.calls[0]?.[0].address.street).toBe('Titik manual');
  }

  it('keeps a later manual event authoritative over an older automatic consumer', async () => {
    const { automaticMatch, manualMatch } = configureDeferredMatches();
    renderStep();

    act(() => {
      window.dispatchEvent(new CustomEvent('location-selected', { detail: automaticSelection }));
    });
    await waitFor(() => expect(matcherMocks.matchAddressToKode).toHaveBeenCalledOnce());

    await publishManualAndResolve(manualMatch);
    await act(async () => automaticMatch.resolve(matchedAddress));
    expect(setCustomer).toHaveBeenCalledOnce();
  });

  it('does not let an in-flight automatic cache prefill overwrite a manual event', async () => {
    const { automaticMatch, manualMatch } = configureDeferredMatches();
    sessionStorage.setItem(LOCATION_SELECTION_CACHE_KEY, JSON.stringify(automaticSelection));
    renderStep();
    await waitFor(() => expect(matcherMocks.matchAddressToKode).toHaveBeenCalledOnce());

    await publishManualAndResolve(manualMatch);
    await act(async () => automaticMatch.resolve(matchedAddress));
    expect(setCustomer).toHaveBeenCalledOnce();
  });

  it('rejects a stale Jakarta cache and opens the outside-DIY picker', async () => {
    const openPicker = vi.fn();
    window.addEventListener('open-map-picker', openPicker);
    sessionStorage.setItem(LOCATION_SELECTION_CACHE_KEY, JSON.stringify({
      coords: { lat: -6.2272373, lng: 106.8584421 },
      source: 'automatic',
      address: {
        street: 'Jalan Tebet Timur Dalam III M',
        kota: 'Jakarta Selatan',
        provinsi: 'DI Yogyakarta',
      },
    }));

    renderStep();

    await waitFor(() => expect(openPicker).toHaveBeenCalledOnce());
    expect(matcherMocks.matchAddressToKode).not.toHaveBeenCalled();
    expect(setCustomer).not.toHaveBeenCalled();
    window.removeEventListener('open-map-picker', openPicker);
  });

  it('rejects an unversioned automatic Central Java cache that was mislabeled as DIY', async () => {
    const openPicker = vi.fn();
    window.addEventListener('open-map-picker', openPicker);
    sessionStorage.setItem(LOCATION_SELECTION_CACHE_KEY, JSON.stringify({
      coords: { lat: -7.7, lng: 110.6 },
      source: 'automatic',
      address: {
        street: 'Cache lama',
        kota: 'Klaten',
        provinsi: 'DI Yogyakarta',
      },
    }));

    renderStep();

    await waitFor(() => expect(openPicker).toHaveBeenCalledOnce());
    expect(matcherMocks.matchAddressToKode).not.toHaveBeenCalled();
    expect(setCustomer).not.toHaveBeenCalled();
    window.removeEventListener('open-map-picker', openPicker);
  });
});
