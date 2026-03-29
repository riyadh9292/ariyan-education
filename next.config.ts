import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**', // This allows all paths under this hostname
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com',
        port: '',
        pathname: '/**',
      },

    ],
  },
};
export default nextConfig;
