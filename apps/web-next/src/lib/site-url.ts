import type { Locale } from '@/locales/dictionary';

/** The only public origin used by canonical URLs and structured data. */
export const PRIMARY_SITE_URL = 'https://santiliving.com';

function normalisePath(path: string): string {
  if (!path || path === '/') return '';
  return `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

/** Build a primary-domain URL without adding a locale prefix. */
export function primarySiteUrl(path = ''): string {
  return `${PRIMARY_SITE_URL}${normalisePath(path)}`;
}

/** Build a primary-domain URL for a locale-prefixed page. */
export function localizedSiteUrl(path: string, locale: Locale | string): string {
  const safeLocale = locale === 'en' ? 'en' : 'id';
  return `${PRIMARY_SITE_URL}/${safeLocale}${normalisePath(path)}`;
}
