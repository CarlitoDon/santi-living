/** @vitest-environment jsdom */
import { act, cleanup, render, screen } from '@testing-library/react';
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
  afterEach(() => cleanup());

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
});
