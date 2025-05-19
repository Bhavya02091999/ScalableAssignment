import type { NextConfig } from "next";

const getApiUrl = (url: string | undefined, defaultPort: string) => {
  // If URL is not provided, use localhost with default port
  if (!url || url === 'undefined') return `http://localhost:${defaultPort}`;
  
  // Ensure the URL has a protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `http://${url}`;
  }
  
  return url;
};

const nextConfig: NextConfig = {
  async rewrites() {
    // Define the default ports for each service
    const services = [
      {
        source: '/api/auth/:path*',
        env: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
        port: '3001'
      },
      {
        source: '/api/courses/:path*',
        env: process.env.NEXT_PUBLIC_COURSE_SERVICE_URL,
        port: '3002'
      },
      {
        source: '/api/feedback/:path*',
        env: process.env.NEXT_PUBLIC_FEEDBACK_SERVICE_URL,
        port: '3003'
      },
      {
        source: '/api/admin/:path*',
        env: process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL,
        port: '3004'
      }
    ];

    // Generate rewrites only for services with valid URLs
    const rewrites = services.map(({ source, env, port }) => {
      const destination = getApiUrl(env, port);
      return {
        source,
        destination: `${destination}${source}`
      };
    });

    console.log('Generated rewrites:', JSON.stringify(rewrites, null, 2));
    return rewrites;
  },
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;