'use client';

import { useEffect } from 'react';
import { reportError } from '@/lib/errorReporter';

/**
 * Wires `window.onerror` and `unhandledrejection` to the central error
 * reporter so unhandled exceptions and rejected promises become visible
 * to operators instead of vanishing into the console. Sentry's auto-
 * instrumentation also captures these, but routing through reportError
 * keeps a single shape for both DSN-on and DSN-off operation and lets
 * us add per-event scoping later without reworking the listeners.
 */
export const GlobalErrorListener = () => {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      reportError(event.error ?? new Error(event.message), {
        scope: 'window.error',
        extra: { filename: event.filename, lineno: event.lineno, colno: event.colno },
      });
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      reportError(event.reason, { scope: 'unhandledrejection' });
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);
  return null;
};
