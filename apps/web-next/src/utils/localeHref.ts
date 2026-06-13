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

  // Normalize: remove trailing slash (except root)
  const normalized = path === '/' ? '/' : path.replace(/\/$/, '');

  return `/${locale}${normalized}`;
}
