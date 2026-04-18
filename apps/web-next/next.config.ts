import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [],
  },

  async redirects() {
    return [
      { source: '/sewa-kasur', destination: '/', permanent: true },
      { source: '/sewa-kasur/:path*', destination: '/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
