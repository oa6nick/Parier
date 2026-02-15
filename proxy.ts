import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ru'],

  // Used when no locale matches
  defaultLocale: 'en'
});

export const config = {
  // Match only internationalized pathnames
  // Exclude API routes, static files, and Next.js internals
  matcher: ['/', '/(ru|en)/:path*', '/((?!api|v1|_next|_vercel|.*\\..*).*)']
};
