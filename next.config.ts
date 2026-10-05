import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local network access for mobile testing
  experimental: {
    allowedDevOrigins: ['192.168.1.107', 'localhost', '127.0.0.1'],
  } as any,
  allowedDevOrigins: ['192.168.1.107', 'localhost', '127.0.0.1'] as any,
  
  // Remove the floating Next.js build indicator
  devIndicators: {
    
    buildActivity: false,
  },
};

export default nextConfig;
