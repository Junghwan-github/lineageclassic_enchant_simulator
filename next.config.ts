import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ls-sim-assets.s3.ap-northeast-2.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
