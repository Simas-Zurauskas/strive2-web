'use client';

import { useMutation } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { resendVerificationAuthenticated } from '@/api/routes/auth';
import { ClientApiError } from '@/api/types';
import { AuthMoment } from '@/components';
import { TOASTS } from '@/constants/toasts';

// Mirrors the server-side spacing on /resend-verification-authenticated
// (60 seconds between sends per user). Mashing the button locally just
// fires guaranteed 429s, so we disable it for the same window — the
// countdown also makes the wait visible instead of silent.
const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Post-signup success page. Reached via `router.push('/signup/check-email')`
 * after a successful credentials sign-up. Uses the shared AuthMoment
 * vocabulary (gold rule → eyebrow → italic-serif title) so all
 * post-action auth screens read as a family.
 */
export const CheckEmailScreen = () => {
  const [email, setEmail] = useState<string | null>(null);
  // Cooldown is wall-clock relative to "last successful send" so a tab
  // refresh can't reset it. We tick `now` every second while a cooldown
  // is active so the countdown re-renders.
  const [resendUntil, setResendUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  // Read the address the user just signed up with so we can echo it back —
  // the previous page set this just before navigating. SessionStorage is
  // window-only so this runs after mount.
  useEffect(() => {
    const stored = window.sessionStorage.getItem('pendingVerificationEmail');
    if (stored) setEmail(stored); // eslint-disable-line react-hooks/set-state-in-effect -- one-shot read of storage on mount
  }, []);

  useEffect(() => {
    if (resendUntil <= now) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [resendUntil, now]);

  const resendMutation = useMutation({
    mutationFn: resendVerificationAuthenticated,
    onSuccess: () => {
      toast(TOASTS.VERIFICATION_SENT_SHORT);
      setResendUntil(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
    },
    onError: (err) => {
      const apiError = err as ClientApiError;
      if (apiError.status === 401 || apiError.message === 'Unauthorized') {
        toast.error(TOASTS.SESSION_EXPIRED);
      }
      // Server-side spacing kicked in (e.g. user reloaded mid-cooldown).
      // Mirror the remaining window into local state so the button stays
      // disabled instead of letting them click into another 429.
      if (apiError.errorCode === 'VERIFICATION_RESEND_TOO_SOON') {
        const meta = (apiError as { meta?: { retryAfterSeconds?: number } }).meta;
        const wait = typeof meta?.retryAfterSeconds === 'number'
          ? meta.retryAfterSeconds
          : RESEND_COOLDOWN_SECONDS;
        setResendUntil(Date.now() + wait * 1000);
      }
    },
    meta: { errorMessage: TOASTS.RESEND_ERROR },
  });
  const cooldownRemaining = Math.max(0, Math.ceil((resendUntil - now) / 1000));
  const onCooldown = cooldownRemaining > 0;
  const resending = resendMutation.isPending;
  const resendDisabled = resending || onCooldown;

  const resendLabel = resending
    ? 'Sending…'
    : onCooldown
      ? `Resend in ${cooldownRemaining}s`
      : 'Resend verification email';

  return (
    <AuthMoment.Wrap>
      <AuthMoment.Rule aria-hidden />
      <AuthMoment.Eyebrow>Account created</AuthMoment.Eyebrow>
      <AuthMoment.Title>Check your email.</AuthMoment.Title>
      <AuthMoment.Lead>
        We sent a verification link
        {email ? (
          <>
            {' '}to{' '}
            <AuthMoment.InlineMark>{email}</AuthMoment.InlineMark>
          </>
        ) : null}
        . Click it to activate your account &mdash; once verified you can start generating courses.
      </AuthMoment.Lead>

      <AuthMoment.Hint>
        Didn&rsquo;t get it? Check your spam folder, or resend below. Links expire after 24 hours.
      </AuthMoment.Hint>

      <AuthMoment.SecondaryButton
        type="button"
        $loading={resending}
        disabled={resendDisabled}
        onClick={() => resendMutation.mutate()}
      >
        {resendLabel}
      </AuthMoment.SecondaryButton>

      <AuthMoment.FootLine>
        Wrong email or already verified?{' '}
        {/* signOut before going to /login: while the user holds an
            unverified credentials session, the proxy redirects /login →
            / and the (protected) layout immediately bounces them back
            here, trapping them on this page. Clearing the session
            breaks the loop. We also wipe the pendingVerificationEmail
            stash so the prefilled email doesn't bleed into the next
            sign-up attempt with a different address. */}
        <AuthMoment.InlineLinkButton
          type="button"
          onClick={() => {
            window.sessionStorage.removeItem('pendingVerificationEmail');
            signOut({ callbackUrl: '/login' });
          }}
        >
          Back to sign in
        </AuthMoment.InlineLinkButton>
      </AuthMoment.FootLine>
    </AuthMoment.Wrap>
  );
};
