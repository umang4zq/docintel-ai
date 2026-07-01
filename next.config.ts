import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: ['13.235.245.132'],
  },
  async rewrites() {
    return [
      {
        source: '/nim-api/:path*',
        destination: 'https://integrate.api.nvidia.com/v1/:path*'
      }
    ];
  }
};

export default nextConfig;
