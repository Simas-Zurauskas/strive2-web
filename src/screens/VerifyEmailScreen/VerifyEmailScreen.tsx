'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { verifyEmail } from '@/api/routes/auth';
import { AuthForm, AuthFormFooter, AuthFormTitle, AuthSubmitBtn } from '@/components';

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
    <AuthForm as="div">
      <AuthFormTitle>
        {status === 'verifying' && 'Verifying...'}
        {status === 'success' && 'Email verified'}
        {status === 'expired' && 'Link expired'}
        {status === 'already-verified' && 'Already verified'}
        {status === 'error' && 'Verification failed'}
      </AuthFormTitle>

      {status !== 'verifying' && <AuthFormFooter>{message}</AuthFormFooter>}

      {(status === 'success' || status === 'already-verified') && (
        <AuthSubmitBtn as="button" type="button" onClick={handleContinue}>
          {isAuthenticated ? 'Continue' : 'Continue to sign in'}
        </AuthSubmitBtn>
      )}

      {status === 'expired' && (
        <Link href="/login">
          <AuthSubmitBtn as="span">Back to sign in</AuthSubmitBtn>
        </Link>
      )}

      {status === 'error' && (
        <Link href="/signup">
          <AuthSubmitBtn as="span">Back to sign up</AuthSubmitBtn>
        </Link>
      )}
    </AuthForm>
  );
};
