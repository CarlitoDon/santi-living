/** @type {import('next-sitemap').IConfig} */
const KARPET_SITE_URL = 'https://karpet.santiliving.com';
const KARPET_ROUTES = new Set([
  '/sewa-karpet-jogja',
  '/sewa-karpet-merah-jogja',
  '/sewa-karpet-permadani-jogja',
]);

function isKarpetRoute(loc) {
  try {
    const url = new URL(loc, 'https://santiliving.com');
    return KARPET_ROUTES.has(url.pathname);
  } catch {
    return false;
  }
}

function toKarpetLoc(loc) {
  const url = new URL(loc, 'https://santiliving.com');
  return `${KARPET_SITE_URL}${url.pathname}${url.search}`;
}

const config = {
  siteUrl: 'https://santiliving.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/cart', '/checkout', '/thank-you', '/pesanan/*', '/sewa-karpet'],
  transform: async (config, loc) => ({
    loc: isKarpetRoute(loc) ? toKarpetLoc(loc) : loc,
    changefreq: config.changefreq,
    priority: isKarpetRoute(loc) ? 0.9 : config.priority,
    lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    alternateRefs: config.alternateRefs ?? [],
  }),
  robotsTxtOptions: {
    additionalSitemaps: [],
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
