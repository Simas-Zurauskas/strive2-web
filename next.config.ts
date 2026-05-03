import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      { source: '/faq', destination: '/help', permanent: true },
      { source: '/faq/:path*', destination: '/help/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
