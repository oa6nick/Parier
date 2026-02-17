const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin('./i18n.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Reduce preload warnings
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Proxy API to backend (optional - avoids CORS when backend runs on different port)
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      return [
        { source: '/api/v1/:path*', destination: `${apiUrl}/api/v1/:path*` },
      ];
    }
    return [];
  },
};

module.exports = withNextIntl(nextConfig);
