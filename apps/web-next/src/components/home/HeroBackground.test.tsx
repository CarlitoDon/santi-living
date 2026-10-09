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
    const { getByAltText } = render(<HeroBackground />);

    const firstSlide = getByAltText('Pengiriman kasur Santi Living di Yogyakarta');
    const secondSlide = getByAltText('Kasur sewa yang sudah rapi dan siap digunakan');

    expect(firstSlide.closest('[aria-hidden]')?.getAttribute('aria-hidden')).toBe('false');
    expect(secondSlide.closest('[aria-hidden]')?.getAttribute('aria-hidden')).toBe('true');

    act(() => {
      vi.advanceTimersByTime(8500);
    });

    expect(firstSlide.closest('[aria-hidden]')?.getAttribute('aria-hidden')).toBe('true');
    expect(secondSlide.closest('[aria-hidden]')?.getAttribute('aria-hidden')).toBe('false');
  });
});
