'use client';

import { useEffect } from 'react';
import { colorsLib, themeColors } from '@/theme';

// global-error.tsx replaces the entire root layout if an error is thrown above
// the `app/error.tsx` boundary (e.g. the layout itself crashes). It must render
// its own <html>/<body> because it owns the root frame at this point — and at
// that point the styled-components ThemeProvider + GlobalStyles are NOT mounted,
// so CSS variables (`var(--background)`, etc.) are unavailable. Pulling literal
// values straight from `colorsLib`/`themeColors` keeps this file aligned with
// the rest of the design system without depending on a runtime that has crashed.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[app/global-error]', error);
  }, [error]);

  const c = themeColors.light;

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          minHeight: '100vh',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: c.background,
          color: c.foreground,
        }}
      >
        <main
          style={{
            maxWidth: '32rem',
            padding: '2rem',
            border: `1px solid ${c.surfaceBorder}`,
            borderRadius: '12px',
            background: c.surface,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontStyle: 'italic' }}>Something broke.</h1>
          <p style={{ margin: 0, color: c.muted, lineHeight: 1.5 }}>
            The application hit a critical error. Try reloading the page; if it keeps happening, please contact support.
            {error.digest && (
              <span style={{ display: 'block', marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem', color: c.muted }}>
                Reference: {error.digest}
              </span>
            )}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => reset()}
              style={{ padding: '0.5rem 1rem', borderRadius: 6, border: `1px solid ${c.foreground}`, background: c.foreground, color: colorsLib.white, cursor: 'pointer' }}
            >
              Try again
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              style={{ padding: '0.5rem 1rem', borderRadius: 6, border: `1px solid ${c.border}`, background: c.surface, color: c.foreground, cursor: 'pointer' }}
            >
              Go home
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
