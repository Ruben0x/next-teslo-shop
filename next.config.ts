import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/**')]
  },
  /* config options here */
  devIndicators: false
};

export default nextConfig;
