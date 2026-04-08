import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow HMR from network IP (e.g. mobile testing on same WiFi)
  allowedDevOrigins: ['10.19.32.249'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
