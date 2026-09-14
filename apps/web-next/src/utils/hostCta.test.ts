import { describe, expect, it } from 'vitest';
import { getHostCta } from './hostCta';

describe('host CTA context', () => {
  it('recognizes the chair landing page after a locale prefix', () => {
    const cta = getHostCta('', '/id/sewa-kursi-acara', 'id');

    expect(cta.context).toBe('kursi');
    expect(cta.desktopLabel).toBe('Cek kursi acara');
    expect(cta.waText).toContain('Jenis kursi:');
  });

  it('keeps existing carpet context after a locale prefix', () => {
    expect(getHostCta('', '/en/sewa-karpet-jogja', 'en').context).toBe('karpet');
  });
});
