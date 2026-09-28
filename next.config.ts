import type { NextConfig } from "next";

/**
 * The visible frontend of this project is the legacy Nirmaan Setu static UI
 * (previously the `project-reality-os` repository). Those pages now live in
 * `public/` and are served as-is. The App Router screens under `src/app` are
 * kept in the repository but are no longer part of the product surface, so
 * every route they own is redirected to the equivalent legacy page.
 */
const legacy = (page: string) => `/nirmaan-setu-${page}.html`;

const nextConfig: NextConfig = {
  // Next 15.2's ESLint runner is incompatible with the project's ESLint 9
  // flat-config toolchain. Linting remains available as an explicit CI check.
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],

  async redirects() {
    return [
      // --- Nirmaan Setu portal routes -> legacy screens ---------------------
      { source: '/projects', destination: legacy('dashboard'), permanent: false },
      { source: '/projects/:path*', destination: legacy('weekly'), permanent: false },
      { source: '/reviewer-queue', destination: legacy('planner-review'), permanent: false },
      { source: '/field-log', destination: legacy('site-report'), permanent: false },
      { source: '/knowledge-base', destination: legacy('history'), permanent: false },
      { source: '/evidence', destination: legacy('history'), permanent: false },
      { source: '/account', destination: legacy('settings'), permanent: false },

      // --- Legacy auth screens ---------------------------------------------
      { source: '/login', destination: legacy('auth'), permanent: false },
      { source: '/signup', destination: legacy('auth-signup'), permanent: false },
      { source: '/password-reset', destination: legacy('auth-reset'), permanent: false },
      { source: '/request-password-reset', destination: legacy('auth-reset'), permanent: false },
      { source: '/email-verification', destination: legacy('auth-otp'), permanent: false },

      // --- Open SaaS template leftovers (no legacy equivalent) --------------
      { source: '/pricing', destination: legacy('landing'), permanent: false },
      { source: '/checkout', destination: legacy('landing'), permanent: false },
      { source: '/file-upload', destination: legacy('landing'), permanent: false },
      { source: '/demo-app', destination: legacy('landing'), permanent: false },
      { source: '/admin', destination: legacy('landing'), permanent: false },
      { source: '/admin/:path*', destination: legacy('landing'), permanent: false },
    ];
  },

  async rewrites() {
    return {
      // beforeFiles so the landing page can own the site root, which also has
      // an App Router page (`src/app/page.tsx`).
      beforeFiles: [
        { source: '/', destination: legacy('landing') },

        // The legacy site shipped with `cleanUrls`, so keep extension-free
        // URLs working: /nirmaan-setu-dashboard -> /nirmaan-setu-dashboard.html
        { source: '/:page(nirmaan-setu-[a-z-]+)', destination: '/:page.html' },

        // Short aliases for the screens that have no App Router route.
        { source: '/help', destination: legacy('faq') },
        { source: '/faq', destination: legacy('faq') },
        { source: '/onboarding', destination: legacy('onboarding') },
        { source: '/settings', destination: legacy('settings') },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
