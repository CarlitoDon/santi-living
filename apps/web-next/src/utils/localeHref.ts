/**
 * Prefix an internal path with the current locale.
 * External URLs (http/https/mailto/tel) and hash-only anchors are returned as-is.
 */
export function localeHref(path: string, locale: string): string {
  // Skip external, protocol-relative, or hash-only
  if (
    path.startsWith('http') ||
    path.startsWith('//') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('#')
  ) {
    return path;
  }

  // Prepend locale and clean up slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  let result = `/${locale}${cleanPath}`;

  // Clean trailing slashes
  result = result.replace(/\/+$/, '');
  // Clean /# target structures (e.g. /en/#calculator -> /en#calculator)
  result = result.replace(/\/+#/, '#');

  if (result === '') return '/';

  return result;
}
