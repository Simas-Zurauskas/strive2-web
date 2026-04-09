'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { verifyEmail } from '@/api/routes/auth';
import * as S from '../LoginScreen/LoginScreen.styles';

type Status = 'verifying' | 'success' | 'error' | 'expired' | 'already-verified';

export const VerifyEmailScreen = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [status, setStatus] = useState<Status>('verifying');
  const [message, setMessage] = useState('');
  const calledRef = useRef(false);
  const isAuthenticated = sessionStatus === 'authenticated';

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setStatus('error'); // eslint-disable-line react-hooks/set-state-in-effect -- async verification flow
      setMessage('Invalid verification link.');
      return;
    }

    verifyEmail({ token, email })
      .then(() => {
        setStatus('success');
        setMessage('Your email has been verified.');
      })
      .catch((err) => {
        const errorCode = err?.errorCode as string | undefined;

        if (errorCode === 'EMAIL_VERIFICATION_EXPIRED') {
          setStatus('expired');
          setMessage('This verification link has expired. Please sign in and request a new one.');
        } else if (errorCode === 'EMAIL_ALREADY_VERIFIED') {
          setStatus('already-verified');
          setMessage('Your email is already verified.');
        } else {
          setStatus('error');
          setMessage(err?.message || 'Verification failed. Please try again.');
        }
      });
  }, [searchParams]);

  const handleContinue = () => {
    if (isAuthenticated) {
      router.push('/');
    } else {
      router.push('/login');
    }
  };

  return (
    <S.Form as="div">
      <h1 className="form__title">
        {status === 'verifying' && 'Verifying...'}
        {status === 'success' && 'Email verified'}
        {status === 'expired' && 'Link expired'}
        {status === 'already-verified' && 'Already verified'}
        {status === 'error' && 'Verification failed'}
      </h1>

      {status !== 'verifying' && <p className="form__footer">{message}</p>}

      {(status === 'success' || status === 'already-verified') && (
        <S.SubmitBtn as="button" type="button" onClick={handleContinue}>
          {isAuthenticated ? 'Continue' : 'Continue to sign in'}
        </S.SubmitBtn>
      )}

      {status === 'expired' && (
        <Link href="/login">
          <S.SubmitBtn as="span">Back to sign in</S.SubmitBtn>
        </Link>
      )}

      {status === 'error' && (
        <Link href="/signup">
          <S.SubmitBtn as="span">Back to sign up</S.SubmitBtn>
        </Link>
      )}
    </S.Form>
  );
};
