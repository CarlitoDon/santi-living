/**
 * @vitest-environment jsdom
 */
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HeroBackground } from './HeroBackground';

describe('HeroBackground', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('renders properly and advances the slide after the timer interval', () => {
    const { getByAltText, queryByAltText } = render(<HeroBackground />);

    expect(getByAltText('Pengiriman kasur Santi Living di Yogyakarta')).toBeTruthy();
    expect(queryByAltText('Kasur sewa yang sudah rapi dan siap digunakan')).toBeNull();

    act(() => {
      vi.advanceTimersByTime(8500);
    });

    expect(queryByAltText('Pengiriman kasur Santi Living di Yogyakarta')).toBeNull();
    expect(getByAltText('Kasur sewa yang sudah rapi dan siap digunakan')).toBeTruthy();
  });
});
