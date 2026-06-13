/**
 * Unified currency formatting for Santi Living
 * @param price - numeric price value
 * @param locale - 'id' for ID format (dot sep), 'en' for EN format (comma sep)
 */
export function formatPrice(price: number, locale: string = 'id'): string {
  const localeMap: Record<string, string> = {
    id: 'id-ID',
    en: 'en-ID',
  };
  return new Intl.NumberFormat(localeMap[locale] || 'id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
