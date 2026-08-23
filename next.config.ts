import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow access from network IP
  allowedDevOrigins: ['192.168.1.12', 'localhost'],
  
  // Turbopack config (required for Next.js 16+ with custom config)
  turbopack: {},
  
  // Allow static files to be served correctly
  assetPrefix: '',
};

export default nextConfig;