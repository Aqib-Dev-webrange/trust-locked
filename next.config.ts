import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
};

export default nextConfig;
