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

async function getBlogArticlePaths() {
  const fs = await import('node:fs');
  const blogDir = `${__dirname}/src/content/blog`;
  const paths = [];

  const idDir = `${blogDir}/id`;
  if (fs.existsSync(idDir)) {
    fs.readdirSync(idDir)
      .filter((file) => file.endsWith('.md'))
      .forEach((file) => {
        paths.push(`/artikel/${file.replace(/\.md$/, '')}`);
      });
  }

  const enDir = `${blogDir}/en`;
  if (fs.existsSync(enDir)) {
    fs.readdirSync(enDir)
      .filter((file) => file.endsWith('.md'))
      .forEach((file) => {
        paths.push(`/en/artikel/${file.replace(/\.md$/, '')}`);
      });
  }

  return paths.sort();
}

const config = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  alternateRefs: [
    {
      href: 'https://santiliving.com/id',
      hreflang: 'id',
    },
    {
      href: 'https://santiliving.com/en',
      hreflang: 'en',
    },
  ],
  exclude: ['/cart', '/checkout', '/thank-you', '/pesanan/*', '/sewa-karpet'],
  additionalPaths: async (config) => {
    const seen = new Set();
    const paths = [];

    for (const loc of await getBlogArticlePaths()) {
      if (seen.has(loc)) {
        continue;
      }
      seen.add(loc);
      paths.push(await config.transform(config, loc));
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
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  robotsTxtOptions: {
    additionalSitemaps: [
      `${KARPET_SITE_URL}/sitemap-0.xml`,
      `${PERMADANI_SITE_URL}/sitemap-0.xml`,
      `${ACARA_SITE_URL}/sitemap-0.xml`,
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
