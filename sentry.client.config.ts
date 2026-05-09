// Browser-side Sentry initialization.
//
// Initialized only when NEXT_PUBLIC_SENTRY_DSN is set — without a DSN, this
// is a no-op and ships zero overhead. Wires unhandled errors and promise
// rejections automatically; manual capture is via `errorReporter.ts`.
//
// Source map upload is intentionally NOT configured via withSentryConfig
// because the client uses Turbopack for build, which is not yet fully
// compatible with Sentry's webpack plugin. Source maps can be uploaded
// separately via @sentry/cli in CI when needed.

import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? 'production',
    // Defensive hygiene: explicitly opt out of the default-PII auto-capture
    // (IP address, headers, etc.). The current @sentry/nextjs default is
    // already false, but pinning it here insulates us against an SDK
    // upgrade that flips the default. Mirrors the server config at
    // api/src/conf/sentry.ts.
    sendDefaultPii: false,
    // Tracing is opt-in to keep bundle weight and event volume down. Flip
    // to a non-zero value once budgeting is decided.
    tracesSampleRate: 0,
    // Capture replays only on errors — full-session recording is overkill
    // for early production. Reasses once the rate is understood.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.1,
    // PII scrubbing: drop common credential keys before they leave the
    // browser. The API has its own scrubber on the server-side reporter;
    // mirror the same key list to keep parity.
    beforeSend(event) {
      const SENSITIVE = [
        'password',
        'token',
        'authorization',
        'cookie',
        'secret',
        'api_key',
        'apiKey',
        'session',
        'credit_card',
        'creditCard',
        'cvv',
      ];
      const scrub = (obj: unknown): unknown => {
        if (!obj || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(scrub);
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
          if (SENSITIVE.some((s) => k.toLowerCase().includes(s.toLowerCase()))) {
            out[k] = '[REDACTED]';
          } else {
            out[k] = scrub(v);
          }
        }
        return out;
      };
      if (event.request) event.request = scrub(event.request) as typeof event.request;
      if (event.extra) event.extra = scrub(event.extra) as typeof event.extra;
      return event;
    },
  });
}
