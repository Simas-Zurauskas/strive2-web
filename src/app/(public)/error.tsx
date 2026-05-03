'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';
import * as S from '../error.styles';

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[(public)/error]', error);
  }, [error]);

  return (
    <S.Container>
      <S.Card>
        <S.Title>Something went wrong.</S.Title>
        <S.Body>
          We couldn&apos;t render this page. Please try again.
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
