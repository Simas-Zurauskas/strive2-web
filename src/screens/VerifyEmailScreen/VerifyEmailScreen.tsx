'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { verifyEmail } from '@/api/routes/auth';
import { AuthMoment } from '@/components';
import { safeRedirect } from '@/lib/safeRedirect';

const REDIRECT_STORAGE_KEY = 'pendingPostAuthRedirect';

type Status = 'verifying' | 'success' | 'error' | 'expired' | 'already-verified';

interface CopyForState {
  eyebrow: string;
  title: string;
  lead: string;
}

const COPY: Record<Exclude<Status, 'verifying'>, CopyForState> = {
  success: {
    eyebrow: 'Email verified',
    title: "You're all set.",
    lead: 'Your account is ready. Continue to start generating courses.',
  },
  'already-verified': {
    eyebrow: 'Already verified',
    title: 'No action needed.',
    lead: 'This email is already verified — sign in to pick up where you left off.',
  },
  expired: {
    eyebrow: 'Link expired',
    title: 'This link is no longer valid.',
    lead: 'Verification links expire after 24 hours. Sign in again and request a fresh one.',
  },
  error: {
    eyebrow: 'Verification failed',
    title: 'We couldn’t verify this link.',
    lead: 'The link may be malformed or already used. Sign up again to send a new verification email.',
  },
};

export const VerifyEmailScreen = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [status, setStatus] = useState<Status>('verifying');
  const [errorOverride, setErrorOverride] = useState<string | null>(null);
  const calledRef = useRef(false);
  const isAuthenticated = sessionStatus === 'authenticated';

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const token = searchParams.get('token');

    if (!token) {
      setStatus('error'); // eslint-disable-line react-hooks/set-state-in-effect -- async verification flow
      setErrorOverride('Invalid verification link.');
      return;
    }

    verifyEmail({ token })
      .then(() => {
        setStatus('success');
      })
      .catch((err) => {
        const errorCode = err?.errorCode as string | undefined;

        if (errorCode === 'EMAIL_VERIFICATION_EXPIRED') {
          setStatus('expired');
        } else if (errorCode === 'EMAIL_ALREADY_VERIFIED') {
          setStatus('already-verified');
        } else {
          setStatus('error');
          if (typeof err?.message === 'string') setErrorOverride(err.message);
        }
      });
  }, [searchParams]);

  // Pop the stashed redirect from the original /signup or /login entry point
  // (set by SignUpScreen before navigating to /signup/check-email). We always
  // clear it after reading so a stale value can't redirect a future flow.
  const popPendingRedirect = (): string | null => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem(REDIRECT_STORAGE_KEY);
    sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
    if (!stored) return null;
    const safe = safeRedirect(stored, '/');
    return safe === '/' ? null : safe;
  };

  const handleContinue = () => {
    const stashed = popPendingRedirect();
    if (isAuthenticated) {
      router.push(stashed ?? '/');
    } else {
      // Forward the redirect into the login screen so it survives one more hop.
      const target = stashed
        ? `/?redirect=${encodeURIComponent(stashed)}`
        : '/';
      router.push(target);
    }
  };

  if (status === 'verifying') {
    return (
      <AuthMoment.Centered>
      <AuthMoment.Wrap>
        <AuthMoment.VerifyingTrack aria-hidden>
          <AuthMoment.VerifyingFill />
        </AuthMoment.VerifyingTrack>
        <AuthMoment.Eyebrow>One moment</AuthMoment.Eyebrow>
        <AuthMoment.Title>Verifying your email.</AuthMoment.Title>
        <AuthMoment.Lead>This usually takes a second.</AuthMoment.Lead>
      </AuthMoment.Wrap>
      </AuthMoment.Centered>
    );
  }

  const copy = COPY[status];
  const lead = errorOverride && status === 'error' ? errorOverride : copy.lead;

  return (
    <AuthMoment.Centered>
    <AuthMoment.Wrap>
      <AuthMoment.Rule aria-hidden />
      <AuthMoment.Eyebrow>{copy.eyebrow}</AuthMoment.Eyebrow>
      <AuthMoment.Title>{copy.title}</AuthMoment.Title>
      <AuthMoment.Lead>{lead}</AuthMoment.Lead>

      {(status === 'success' || status === 'already-verified') && (
        <AuthMoment.PrimaryButton type="button" onClick={handleContinue}>
          {isAuthenticated ? 'Continue' : 'Continue to sign in'}
        </AuthMoment.PrimaryButton>
      )}

      {status === 'expired' && (
        <Link href="/" passHref legacyBehavior>
          <AuthMoment.PrimaryButton as="a">Back to sign in</AuthMoment.PrimaryButton>
        </Link>
      )}

      {status === 'error' && (
        <Link href="/" passHref legacyBehavior>
          <AuthMoment.PrimaryButton as="a">Back to sign up</AuthMoment.PrimaryButton>
        </Link>
      )}

      {(status === 'expired' || status === 'error') && (
        <AuthMoment.FootLine>
          Need help? <Link href="/help">Visit the help center</Link>
        </AuthMoment.FootLine>
      )}
    </AuthMoment.Wrap>
    </AuthMoment.Centered>
  );
};
