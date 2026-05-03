'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';
import * as S from '../error.styles';

export default function AuthError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[(auth)/error]', error);
  }, [error]);

  return (
    <S.Container>
      <S.Card>
        <S.Title>Couldn&apos;t load this page.</S.Title>
        <S.Body>
          The auth flow hit an error. Try again, or come back to the login screen if it keeps happening.
          {error.digest && <S.Digest>Reference: {error.digest}</S.Digest>}
        </S.Body>
        <S.Actions>
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="secondary" onClick={() => (window.location.href = '/login')}>
            Back to login
          </Button>
        </S.Actions>
      </S.Card>
    </S.Container>
  );
}
