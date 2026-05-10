// Single entry-point for client-side error reporting. Routes through
// Sentry when initialized, falls back to console otherwise.
//
// Use this anywhere a non-fatal error should be visible to operators —
// e.g. caught in an axios interceptor, react-query meta.errorMessage hook,
// chat panel attach failure. The named-handler pattern keeps the call
// sites decoupled from the Sentry SDK so the wiring can change later.

import * as Sentry from '@sentry/nextjs';

interface ReportContext {
  /** Lightweight scope tag — e.g. 'socket.connect_error', 'mutation.X'. */
  scope?: string;
  /** Free-form structured payload. PII keys are scrubbed in beforeSend. */
  extra?: Record<string, unknown>;
}

const sentryActive = (): boolean =>
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_SENTRY_DSN &&
  process.env.NODE_ENV !== 'development';

export const reportError = (err: unknown, ctx: ReportContext = {}): void => {
  if (sentryActive()) {
    Sentry.withScope((scope) => {
      if (ctx.scope) scope.setTag('scope', ctx.scope);
      if (ctx.extra) {
        for (const [k, v] of Object.entries(ctx.extra)) scope.setExtra(k, v);
      }
      Sentry.captureException(err);
    });
    return;
  }
  // No DSN configured — log to console so dev still sees the error.
  console.error(`[reportError${ctx.scope ? `:${ctx.scope}` : ''}]`, err, ctx.extra);
};

export const reportMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  ctx: ReportContext = {},
): void => {
  if (sentryActive()) {
    Sentry.withScope((scope) => {
      if (ctx.scope) scope.setTag('scope', ctx.scope);
      if (ctx.extra) {
        for (const [k, v] of Object.entries(ctx.extra)) scope.setExtra(k, v);
      }
      Sentry.captureMessage(message, level);
    });
    return;
  }
  console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log'](
    `[reportMessage${ctx.scope ? `:${ctx.scope}` : ''}]`,
    message,
    ctx.extra,
  );
};
