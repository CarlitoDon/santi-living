/**
 * @vitest-environment jsdom
 */
import { act, cleanup, fireEvent, render } from '@testing-library/react';
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

  it('creates a fresh manual announcement and leaves it unchanged during autoplay', () => {
    const { container, getByLabelText } = render(<HeroBackground />);
    const secondSlide = getByLabelText('Tampilkan gambar 2 dari 4');

    fireEvent.click(secondSlide);
    expect(container.querySelector('[data-announcement-sequence="1"]')?.textContent).toBe('Gambar 2 dari 4');

    fireEvent.click(secondSlide);
    expect(container.querySelector('[data-announcement-sequence="2"]')?.textContent).toBe('Gambar 2 dari 4');

    act(() => vi.advanceTimersByTime(8500));

    expect(container.querySelector('.home-hero-switcher-count')?.textContent).toContain('03 / 04');
    expect(container.querySelector('[data-announcement-sequence="2"]')?.textContent).toBe('Gambar 2 dari 4');
  });
});
