import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [],
  },

  async redirects() {
    return [
      { source: '/sewa-kasur', destination: '/', permanent: true },
      { source: '/sewa-kasur/about', destination: '/about', permanent: true },
      { source: '/sewa-kasur/produk', destination: '/produk', permanent: true },
      { source: '/sewa-kasur/cart', destination: '/cart', permanent: true },
      { source: '/sewa-kasur/checkout', destination: '/checkout', permanent: true },
      { source: '/sewa-kasur/thank-you', destination: '/thank-you', permanent: true },
    ];
  },
};

export default nextConfig;
