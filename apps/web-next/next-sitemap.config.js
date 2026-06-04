/** @type {import('next-sitemap').IConfig} */
const SITE_URL = 'https://santiliving.com';
const KARPET_SITE_URL = 'https://karpet.santiliving.com';
const PERMADANI_SITE_URL = 'https://permadani.santiliving.com';
const ACARA_SITE_URL = 'https://acara.santiliving.com';

const ROUTE_HOSTS = new Map([
  ['/sewa-karpet-jogja', KARPET_SITE_URL],
  ['/sewa-karpet-merah-jogja', KARPET_SITE_URL],
  ['/sewa-karpet-permadani-jogja', PERMADANI_SITE_URL],
  ['/sewa-perlengkapan-event', ACARA_SITE_URL],
]);

function getPreferredHost(loc) {
  try {
    const url = new URL(loc, SITE_URL);
    return ROUTE_HOSTS.get(url.pathname) || SITE_URL;
  } catch {
    return SITE_URL;
  }
}

function toPreferredLoc(loc) {
  const url = new URL(loc, SITE_URL);
  const host = getPreferredHost(loc);
  return `${host}${url.pathname}${url.search}`;
}

const config = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/cart', '/checkout', '/thank-you', '/pesanan/*', '/sewa-karpet'],
  transform: async (config, loc) => {
    const preferredHost = getPreferredHost(loc);
    const isSpecialHostRoute = preferredHost !== SITE_URL;

    return {
      loc: toPreferredLoc(loc),
      changefreq: config.changefreq,
      priority: isSpecialHostRoute ? 0.9 : config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  robotsTxtOptions: {
    additionalSitemaps: [
      `${KARPET_SITE_URL}/sitemap.xml`,
      `${PERMADANI_SITE_URL}/sitemap.xml`,
      `${ACARA_SITE_URL}/sitemap.xml`,
    ],
    transformRobotsTxt: async (_config, robotsTxt) =>
      robotsTxt.replace(/\n# Host\nHost: https:\/\/santiliving\.com\n/, '\n'),
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cart', '/checkout', '/pesanan/', '/api/'],
      },
    ],
  },
};

module.exports = config;
