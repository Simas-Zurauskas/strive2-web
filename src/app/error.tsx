'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';
import * as S from './error.styles';

// Top-level Next.js error boundary. Catches any thrown render error in the
// segment tree below `app/layout.tsx` (route-group-specific error boundaries
// supersede this for their subtrees). For uncaught render errors at the root
// HTML layer, Next.js falls back to `app/global-error.tsx`.
export default function GlobalAppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface to the browser console; Next.js already logs the full stack
    // server-side and reports the digest to the user.
    console.error('[app/error]', error);
  }, [error]);

  return (
    <S.Container>
      <S.Card>
        <S.Title>Something broke.</S.Title>
        <S.Body>
          The page hit an unexpected error. You can retry, or head back home if it keeps happening.
          {error.digest && <S.Digest>Reference: {error.digest}</S.Digest>}
        </S.Body>
        <S.Actions>
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="secondary" onClick={() => (window.location.href = '/')}>
            Go home
          </Button>
        </S.Actions>
      </S.Card>
    </S.Container>
  );
}
