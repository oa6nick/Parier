const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin('./i18n.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce preload warnings
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};
 
module.exports = withNextIntl(nextConfig);
