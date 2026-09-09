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

function localizedPath(path: string, locale: string): string {
  return /^\/(?:id|en)(?:\/|$)/.test(path) ? path : localeHref(path, locale);
}

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
  let localized = localeHref(path, locale);

  try {
    const url = new URL(path);
    const hostname = url.hostname.toLowerCase();
    if (SPECIALIZED_PRODUCTION_HOSTS.has(hostname) || SPECIALIZED_LOCAL_HOSTS.has(hostname)) {
      localized = localizedPath(`${url.pathname}${url.search}${url.hash}`, locale);
      if (SPECIALIZED_PRODUCTION_HOSTS.has(hostname)) {
        return `https://santiliving.com${localized}`;
      }

      const protocol = location?.protocol || url.protocol || 'http:';
      const port = location?.port ? `:${location.port}` : url.port ? `:${url.port}` : '';
      return `${protocol}//localhost${port}${localized}`;
    }
  } catch {
    // Relative paths are handled below.
  }

  if (!localized.startsWith('/') || !location) return localized;

  const hostname = location.hostname.toLowerCase();
  if (SPECIALIZED_PRODUCTION_HOSTS.has(hostname)) {
    return `https://santiliving.com${localized}`;
  }

  if (SPECIALIZED_LOCAL_HOSTS.has(hostname)) {
    const protocol = location.protocol || 'http:';
    const port = location.port ? `:${location.port}` : '';
    return `${protocol}//localhost${port}${localized}`;
  }

  return localized;
}
