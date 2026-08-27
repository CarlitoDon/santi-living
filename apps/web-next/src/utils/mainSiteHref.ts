import { localeHref } from '@/utils/localeHref';

export interface BrowserLocationLike {
  hostname: string;
  protocol?: string;
  port?: string;
}

const SPECIALIZED_PRODUCTION_HOSTS = new Set([
  'acara.santiliving.com',
  'karpet.santiliving.com',
  'permadani.santiliving.com',
  'kipas-angin.santiliving.com',
]);

const SPECIALIZED_LOCAL_HOSTS = new Set([
  'acara.localhost',
  'karpet.localhost',
  'permadani.localhost',
  'kipas-angin.localhost',
]);

/**
 * Resolve links owned by the primary Santi Living site.
 * Specialized subdomains must cross back to the primary host instead of
 * letting their host rewrite capture a relative path.
 */
export function mainSiteHref(
  path: string,
  locale: string,
  location?: BrowserLocationLike | null,
): string {
  const localizedPath = localeHref(path, locale);
  if (!localizedPath.startsWith('/') || !location) return localizedPath;

  const hostname = location.hostname.toLowerCase();
  if (SPECIALIZED_PRODUCTION_HOSTS.has(hostname)) {
    return `https://santiliving.com${localizedPath}`;
  }

  if (SPECIALIZED_LOCAL_HOSTS.has(hostname)) {
    const protocol = location.protocol || 'http:';
    const port = location.port ? `:${location.port}` : '';
    return `${protocol}//localhost${port}${localizedPath}`;
  }

  return localizedPath;
}
