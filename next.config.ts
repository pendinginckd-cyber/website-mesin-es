import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost', '192.168.1.12', '192.168.1.17', '192.168.1.*'],
  assetPrefix: '',
  experimental: {
    optimizePackageImports: ['lucide-react', 'zod', 'react-hook-form', 'rc-slider'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/mesin-es-kristal-web.firebasestorage.app/o/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;