import { describe, expect, it } from 'vitest';
import { calculateDeliveryFee } from '@/lib/calculator-logic';

describe('calculateDeliveryFee', () => {
  it('uses four trips, 10 km/l, and Rp10.000/l', () => {
    expect(calculateDeliveryFee(10)).toBe(40_000);
  });

  it('rounds the result up to the nearest Rp1.000', () => {
    expect(calculateDeliveryFee(10.1)).toBe(41_000);
  });

  it('does not charge for a non-positive distance', () => {
    expect(calculateDeliveryFee(0)).toBe(0);
    expect(calculateDeliveryFee(-1)).toBe(0);
  });
});
