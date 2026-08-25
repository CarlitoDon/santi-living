/**
 * @vitest-environment jsdom
 */
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StickyWhatsApp } from './StickyWhatsApp';

vi.mock('@/hooks/useHostCta', () => ({
  useHostCta: () => ({ waText: 'Halo', stickyAriaLabel: 'Chat WhatsApp' }),
}));

vi.mock('@/utils/whatsapp', () => ({
  getWhatsAppUrl: () => '/api/wa?text=Halo',
}));

describe('StickyWhatsApp', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.history.replaceState({}, '', '/id');
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 200 });
  });

  afterEach(() => {
    cleanup();
  });

  it('stays visible and moves above an active cart bar', async () => {
    const cartBar = document.createElement('div');
    cartBar.className = 'cart-bar';
    cartBar.setAttribute('aria-hidden', 'false');
    cartBar.getBoundingClientRect = vi.fn(() => ({
      bottom: 844,
      height: 72,
      left: 0,
      right: 390,
      top: 772,
      width: 390,
      x: 0,
      y: 772,
      toJSON: () => ({}),
    }));
    document.body.appendChild(cartBar);

    const { getByLabelText } = render(<StickyWhatsApp />);
    const link = getByLabelText('Chat WhatsApp');

    await waitFor(() => {
      expect(link.getAttribute('aria-hidden')).toBe('false');
      expect(link.getAttribute('data-state')).toBe('entered');
      expect(link.style.getPropertyValue('--sticky-wa-bottom')).toBe('84px');
    });
  });
});
