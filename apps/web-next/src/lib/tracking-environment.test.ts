import { describe, expect, it } from 'vitest';
import { shouldLoadTracking } from './tracking-environment';

describe('shouldLoadTracking', () => {
  it('enables tracking in Vercel production', () => {
    expect(shouldLoadTracking({ VERCEL_ENV: 'production' })).toBe(true);
  });

  it('disables tracking in Vercel previews even when explicitly enabled', () => {
    expect(shouldLoadTracking({
      VERCEL_ENV: 'preview',
      NEXT_PUBLIC_ENABLE_MARKETING_TRACKING: 'true',
    })).toBe(false);
  });

  it('allows explicit tracking for non-preview QA environments', () => {
    expect(shouldLoadTracking({
      NEXT_PUBLIC_ENABLE_MARKETING_TRACKING: 'true',
    })).toBe(true);
  });

  it('keeps tracking disabled by default outside Vercel production', () => {
    expect(shouldLoadTracking({})).toBe(false);
  });
});
