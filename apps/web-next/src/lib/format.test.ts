import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate } from './format';

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('formats numbers using id-ID grouping', () => {
      expect(formatCurrency(1500000)).toBe('1.500.000');
      expect(formatCurrency(0)).toBe('0');
    });
  });

  describe('formatDate', () => {
    it('returns "-" for null or undefined or empty', () => {
      expect(formatDate(null)).toBe('-');
      expect(formatDate(undefined)).toBe('-');
      expect(formatDate('')).toBe('-');
    });

    it('returns "-" for invalid date string', () => {
      expect(formatDate('invalid-date')).toBe('-');
    });

    it('formats valid date string with default options', () => {
      const res = formatDate('2026-10-15');
      expect(res).toContain('15');
      expect(res).toContain('Okt');
    });

    it('formats Date object with custom options', () => {
      const date = new Date('2026-10-15T00:00:00Z');
      const res = formatDate(date, { day: 'numeric', month: 'short' });
      expect(res).toContain('15');
    });
  });
});
