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

const LANDING_SLUGS = [
  'sewa-bantal-jogja',
  'sewa-cooling',
  'sewa-karpet-jogja',
  'sewa-karpet-merah-jogja',
  'sewa-karpet-permadani-jogja',
  'sewa-kasur-bulanan',
  'sewa-kasur-lipat',
  'sewa-kasur-terdekat',
  'sewa-kipas-angin',
  'sewa-perlengkapan-event',
  'sewa-selimut-jogja',
  'sewa-tv',
];

function getPreferredHost(loc) {
  try {
    const url = new URL(loc, SITE_URL);
    const path = url.pathname;
    // Check exact path first, then try removing locale prefix
    const host = ROUTE_HOSTS.get(path) || (
      path.startsWith('/id/') || path.startsWith('/en/')
        ? ROUTE_HOSTS.get(path.substring(3))
        : undefined
    );
    return host || SITE_URL;
  } catch {
    return SITE_URL;
  }
}

function toPreferredLoc(loc) {
  const url = new URL(loc, SITE_URL);
  const host = getPreferredHost(loc);
  return `${host}${url.pathname}${url.search}`;
}

function getAlternateRefs(loc) {
  const url = new URL(loc, SITE_URL);
  const path = url.pathname;

  if (path.startsWith('/id/')) {
    const enPath = path.replace('/id/', '/en/');
    return [
      { href: `${SITE_URL}${path}`, hreflang: 'id', hrefIsAbsolute: true },
      { href: `${SITE_URL}${enPath}`, hreflang: 'en', hrefIsAbsolute: true },
    ];
  }
  if (path.startsWith('/en/')) {
    const idPath = path.replace('/en/', '/id/');
    return [
      { href: `${SITE_URL}${idPath}`, hreflang: 'id', hrefIsAbsolute: true },
      { href: `${SITE_URL}${path}`, hreflang: 'en', hrefIsAbsolute: true },
    ];
  }
  // Root or non-locale path — link to both locale roots
  return [
    { href: `${SITE_URL}/id`, hreflang: 'id', hrefIsAbsolute: true },
    { href: `${SITE_URL}/en`, hreflang: 'en', hrefIsAbsolute: true },
  ];
}

const config = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  // Per-URL hreflang handled in transform — no global alternateRefs
  exclude: ['/cart', '/checkout', '/thank-you', '/pesanan/*', '/sewa-karpet', '/artikel/*'],
  additionalPaths: async (config) => {
    const seen = new Set();
    const paths = [];

    // Add landing pages (both locale variants)
    for (const slug of LANDING_SLUGS) {
      for (const locale of ['id', 'en']) {
        const loc = `/${locale}/${slug}`;
        if (seen.has(loc)) continue;
        seen.add(loc);
        paths.push(await config.transform(config, loc));
      }
    }

    return paths;
  },
  transform: async (config, loc) => {
    const preferredHost = getPreferredHost(loc);
    const isSpecialHostRoute = preferredHost !== SITE_URL;

    return {
      loc: toPreferredLoc(loc),
      changefreq: config.changefreq,
      priority: isSpecialHostRoute ? 0.9 : config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: getAlternateRefs(loc),
    };
  },
  robotsTxtOptions: {
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
