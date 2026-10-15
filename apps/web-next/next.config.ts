import type { NextConfig } from 'next';

const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms https://snap.licdn.com https://maps.googleapis.com https://app.midtrans.com https://app.sandbox.midtrans.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://c.bing.com https://maps.googleapis.com https://*.googleapis.com https://app.midtrans.com https://app.sandbox.midtrans.com https://api.midtrans.com https://api.sandbox.midtrans.com https://api.whatsapp.com https://wa.me",
  "frame-src https://www.google.com https://maps.google.com https://www.youtube.com https://app.midtrans.com https://app.sandbox.midtrans.com https://wa.me https://api.whatsapp.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://wa.me https://api.whatsapp.com",
  "upgrade-insecure-requests",
].join('; ');

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Content-Security-Policy', value: cspHeader },
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
