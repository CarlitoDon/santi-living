/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://santiliving.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/cart', '/checkout', '/thank-you', '/pesanan/*'],
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
