'use client';

import { useEffect } from 'react';

// global-error.tsx replaces the entire root layout if an error is thrown above
// the `app/error.tsx` boundary (e.g. the layout itself crashes). It must render
// its own <html>/<body> because it owns the root frame at this point.
// Keep deps minimal; theming/providers are unavailable here.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[app/global-error]', error);
  }, [error]);

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
          background: '#fafaf7',
          color: '#1a1a1a',
        }}
      >
        <main
          style={{
            maxWidth: '32rem',
            padding: '2rem',
            border: '1px solid #e5e5e0',
            borderRadius: '12px',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontStyle: 'italic' }}>Something broke.</h1>
          <p style={{ margin: 0, color: '#555', lineHeight: 1.5 }}>
            The application hit a critical error. Try reloading the page; if it keeps happening, please contact support.
            {error.digest && (
              <span style={{ display: 'block', marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#888' }}>
                Reference: {error.digest}
              </span>
            )}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => reset()}
              style={{ padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid #1a1a1a', background: '#1a1a1a', color: '#fff', cursor: 'pointer' }}
            >
              Try again
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              style={{ padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid #ccc', background: '#fff', color: '#1a1a1a', cursor: 'pointer' }}
            >
              Go home
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
