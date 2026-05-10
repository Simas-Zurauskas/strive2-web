// Server-side Sentry initialization for the Next.js node runtime.
// Mirrors sentry.client.config.ts: gated on SENTRY_DSN, scrubs PII.
// The API tier has its own Sentry; this only catches errors that happen
// inside the Next.js Node server (route handlers, server components,
// metadata generation). NEXT_PUBLIC_SENTRY_DSN can be reused or split.

import * as Sentry from '@sentry/nextjs';

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;
const isDev = process.env.NODE_ENV === 'development';

if (dsn && !isDev) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENV ?? process.env.NODE_ENV ?? 'production',
    tracesSampleRate: 0,
  });
}
