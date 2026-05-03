'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';
import * as S from '../error.styles';

// Error boundary for everything inside (protected). Supersedes the root
// app/error.tsx for this segment so the navbar (rendered in (protected)/layout)
// stays mounted while the failing page is replaced with this fallback.
export default function ProtectedError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[(protected)/error]', error);
  }, [error]);

  return (
    <S.Container>
      <S.Card>
        <S.Title>This page failed to load.</S.Title>
        <S.Body>
          Something broke while rendering this page. You can retry it; if it keeps failing, head back to the home screen.
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
