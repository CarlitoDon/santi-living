import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow ngrok for mobile testing
  allowedDevOrigins: ['tracie-proindustry-cohesively.ngrok-free.dev'],
  images: {
    formats: ['image/webp'],
    remotePatterns: [],
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
      { source: '/sewa-kasur', destination: '/', permanent: true },
      { source: '/sewa-kasur/:path*', destination: '/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
