import type { NextConfig } from 'next';

// Production security headers.
//
// CSP is intentionally NOT set here yet — it requires per-environment
// tuning (Stripe.js, mermaid eval, styled-components inline styles, theme
// bootstrap inline script in app/layout.tsx, Socket.io WSS) and breaks
// pages without careful staging. Add CSP via report-only rollout once the
// staging/prod hosts are stable. The headers below are safe to ship today.
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=()',
  },
];

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: '/faq', destination: '/help', permanent: true },
      { source: '/faq/:path*', destination: '/help/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
