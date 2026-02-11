const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');
let proxy = [
  {
    source: "/v1/:path*",
    destination: "http://localhost:18081/api/v1/:path*", // Proxy to Backend
  },
  {
    source: "/ws",
    destination: "http://localhost:18082/api/v1/chat/ws", // Proxy to AI
    ws: true,
  }
];
if (process.env.PROXY) {
  try {
    proxy = JSON.parse(process.env.PROXY)
  } catch (error) {
    console.error(error, process.env.PROXY)
  }
}
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  rewrites: async () => proxy,
  env: {
    OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID,
    OIDC_ISSUER: process.env.OIDC_ISSUER,
  },
  // Reduce preload warnings
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = withNextIntl(nextConfig);
