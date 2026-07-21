import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
