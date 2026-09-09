/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MapPicker } from './MapPicker';

vi.mock('@/lib/google-maps-loader', () => ({
  loadGoogleMaps: vi.fn().mockRejectedValue(new Error('not configured in test')),
}));

vi.mock('@/hooks/usePresence', () => ({
  usePresence: (isOpen: boolean) => ({
    shouldRender: isOpen,
    state: isOpen ? 'entered' : 'exited',
  }),
}));

vi.mock('@/hooks/useDialogFocus', () => ({ useDialogFocus: vi.fn() }));
vi.mock('@/hooks/useBodyScrollLock', () => ({ useBodyScrollLock: vi.fn() }));

describe('MapPicker', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  async function openPicker() {
    await act(async () => {
      window.dispatchEvent(new CustomEvent('open-map-picker', {
        detail: { reason: 'manual' },
      }));
      await Promise.resolve();
    });
  }

  it('uses the outside-Jogja copy and a Google Maps surface', async () => {
    render(<MapPicker />);

    await act(async () => {
      window.dispatchEvent(new CustomEvent('open-map-picker', {
        detail: { reason: 'outside-diy' },
      }));
      await Promise.resolve();
    });

    expect(screen.getByRole('heading', { name: 'Kamu lagi di luar Jogja, ya?' })).toBeTruthy();
    expect(screen.getByLabelText('Peta Google untuk memilih lokasi sewa')).toBeTruthy();
    expect(document.querySelector('[data-map-provider="google"]')).toBeTruthy();
    expect(document.querySelector('.leaflet-container')).toBeNull();
  });

  it('keeps the result dropdown closed after selecting a Google result', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{
        id: 'gamping',
        name: 'Kecamatan Gamping',
        address: 'Kec. Gamping, Kabupaten Sleman, Daerah Istimewa Yogyakarta',
        lat: -7.795,
        lng: 110.325,
      }] }),
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<MapPicker />);
    await openPicker();

    const input = screen.getByRole('combobox', { name: 'Cari lokasi sewa' });
    fireEvent.change(input, { target: { value: 'gamping' } });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole('option', { name: /Kecamatan Gamping/ }));
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(screen.queryByRole('option')).toBeNull();
  });

  it('selects the first Google result when the user presses Enter', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{
        id: 'godean',
        name: 'Kapanewon Godean',
        address: 'Kec. Godean, Kabupaten Sleman, Daerah Istimewa Yogyakarta',
        lat: -7.768,
        lng: 110.296,
      }] }),
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<MapPicker />);
    await openPicker();

    const input = screen.getByRole('combobox', { name: 'Cari lokasi sewa' });
    fireEvent.change(input, { target: { value: 'godean' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    await waitFor(() => expect((input as HTMLInputElement).value).toBe('Kapanewon Godean'));

    expect(screen.queryByRole('option')).toBeNull();
  });
});
