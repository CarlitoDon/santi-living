/**
 * @vitest-environment jsdom
 */
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LOCATION_SELECTION_CACHE_KEY } from '@/lib/location-selection';
import { Calculator } from './Calculator';

const matcherMocks = vi.hoisted(() => ({
  matchAddressToKode: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/services/address-matcher', () => matcherMocks);
vi.mock('./CartSection', () => ({ CartSection: () => null }));
vi.mock('./ScheduleSection', () => ({ ScheduleSection: () => null }));
vi.mock('./CustomerSection', () => ({ CustomerSection: () => null }));
vi.mock('./AddressSection', () => ({ AddressSection: () => null }));
vi.mock('./ResultPanel', () => ({ ResultPanel: () => null }));
vi.mock('@/components/produk/ProductCard', () => ({ ProductModal: () => null }));
vi.mock('@/hooks/useDeliveryQuote', () => ({ useDeliveryQuote: () => 'idle' }));
vi.mock('@/services/erp-api', () => ({ createOrderInERP: vi.fn(), updateOrderInERP: vi.fn() }));
vi.mock('@/scripts/checkout-session', () => ({ saveOrder: vi.fn(), getOrder: vi.fn() }));
vi.mock('@/utils/alert', () => ({ showAlert: vi.fn() }));
vi.mock('@/utils/whatsapp', () => ({
  buildCalculatorWhatsAppMessage: () => '',
  getWhatsAppUrl: () => '#',
}));

const calculatorActions = {
  state: {
    items: [],
    totalQuantity: 0,
    startDate: '',
    endDate: '',
    duration: 1,
    deliveryFee: 0,
    paymentMethod: 'cash',
    total: 0,
    volumeDiscountAmount: 0,
    volumeDiscountLabel: '',
  },
  addItem: vi.fn(),
  removeItem: vi.fn(),
  setDuration: vi.fn(),
  setStartDate: vi.fn(),
  setDeliveryFee: vi.fn(),
};

vi.mock('./useCalculatorState', () => ({
  useCalculatorState: () => calculatorActions,
}));

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

describe('Calculator location selection arbitration', () => {
  beforeEach(() => {
    sessionStorage.clear();
    matcherMocks.matchAddressToKode.mockReset();
  });

  afterEach(() => cleanup());

  it('does not let an older automatic consumer overwrite a later manual selection', async () => {
    const automaticMatch = deferred<typeof matchedAddress>();
    const manualMatch = deferred<typeof matchedAddress>();
    matcherMocks.matchAddressToKode.mockImplementation((address: { kelurahan?: string }) =>
      address.kelurahan === 'Manual' ? manualMatch.promise : automaticMatch.promise,
    );

    render(<Calculator
      products={{ mattressPackages: [], mattressOnly: [], accessories: [] }}
      imageMap={{}}
      imageMapLarge={{}}
    />);

    act(() => {
      window.dispatchEvent(new CustomEvent('location-selected', { detail: {
        coords: { lat: -7.79, lng: 110.37 },
        source: 'automatic',
        address: { street: 'GPS lama', kelurahan: 'Otomatis', provinsi: 'Daerah Istimewa Yogyakarta' },
      } }));
    });
    await waitFor(() => expect(matcherMocks.matchAddressToKode).toHaveBeenCalledTimes(1));

    const manualSelection = {
      coords: { lat: -7.812345, lng: 110.412345 },
      source: 'manual',
      address: { street: 'Titik manual', kelurahan: 'Manual', provinsi: 'Daerah Istimewa Yogyakarta' },
    };
    sessionStorage.setItem(LOCATION_SELECTION_CACHE_KEY, JSON.stringify(manualSelection));
    act(() => {
      window.dispatchEvent(new CustomEvent('location-selected', { detail: manualSelection }));
    });
    await waitFor(() => expect(matcherMocks.matchAddressToKode).toHaveBeenCalledTimes(2));

    await act(async () => manualMatch.resolve(matchedAddress));
    await waitFor(() => {
      const draft = JSON.parse(sessionStorage.getItem('santi-living-draft-customer') ?? 'null');
      expect(draft.address.street).toBe('Titik manual');
      expect(draft.address.lat).toBe('-7.812345');
    });

    await act(async () => automaticMatch.resolve(matchedAddress));
    const finalDraft = JSON.parse(sessionStorage.getItem('santi-living-draft-customer') ?? 'null');
    expect(finalDraft.address.street).toBe('Titik manual');
    expect(finalDraft.address.lat).toBe('-7.812345');
  });
});
