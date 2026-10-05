import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow ngrok for mobile testing
  allowedDevOrigins: ['tracie-proindustry-cohesively.ngrok-free.dev'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(self)' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Specialist subdomain canonical redirects (Edge Network)
      {
        source: '/',
        has: [{ type: 'host', value: 'acara.santiliving.com' }],
        destination: 'https://santiliving.com/id/sewa-perlengkapan-event',
        permanent: true,
      },
      {
        source: '/sewa-perlengkapan-event',
        has: [{ type: 'host', value: 'acara.santiliving.com' }],
        destination: 'https://santiliving.com/id/sewa-perlengkapan-event',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'acara.santiliving.com' }],
        destination: 'https://santiliving.com/id/:path*',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'host', value: 'karpet.santiliving.com' }],
        destination: 'https://santiliving.com/id/sewa-karpet-jogja',
        permanent: true,
      },
      {
        source: '/sewa-karpet-jogja',
        has: [{ type: 'host', value: 'karpet.santiliving.com' }],
        destination: 'https://santiliving.com/id/sewa-karpet-jogja',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'karpet.santiliving.com' }],
        destination: 'https://santiliving.com/id/:path*',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'host', value: 'permadani.santiliving.com' }],
        destination: 'https://santiliving.com/id/sewa-karpet-permadani-jogja',
        permanent: true,
      },
      {
        source: '/sewa-karpet-permadani-jogja',
        has: [{ type: 'host', value: 'permadani.santiliving.com' }],
        destination: 'https://santiliving.com/id/sewa-karpet-permadani-jogja',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'permadani.santiliving.com' }],
        destination: 'https://santiliving.com/id/:path*',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'host', value: 'kipas-angin.santiliving.com' }],
        destination: 'https://santiliving.com/id/sewa-kipas-angin',
        permanent: true,
      },
      {
        source: '/sewa-kipas-angin',
        has: [{ type: 'host', value: 'kipas-angin.santiliving.com' }],
        destination: 'https://santiliving.com/id/sewa-kipas-angin',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'kipas-angin.santiliving.com' }],
        destination: 'https://santiliving.com/id/:path*',
        permanent: true,
      },
      // Legacy path redirects
      { source: '/sewa-kasur', destination: '/', permanent: true },
      { source: '/sewa-kasur/:path*', destination: '/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
