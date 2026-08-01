'use client';

import Link from 'next/link';
import { AuthMoment } from '@/components';

/**
 * Confirmation page for the unsubscribe link in a promotional email.
 *
 * Reached by a REDIRECT from `GET /api/auth/marketing/unsubscribe`, which
 * has already applied the opt-out — this page renders no state and makes no
 * request, so it is correct for a logged-out recipient with no session and
 * no JS-side data fetching.
 *
 * It deliberately says nothing about *which* address was unsubscribed, and
 * nothing that differs between a valid and an invalid link. The API answers
 * uniformly for exactly that reason (no address-existence oracle), and a
 * page that said "we couldn't find that subscriber" would hand back the
 * oracle the API just refused to be.
 *
 * Uses the AuthMoment vocabulary — this is the same shape of screen
 * (arrived from an email link, one fact to state, one way onward) as the
 * verify-email and check-email moments.
 */
export const UnsubscribedScreen = () => (
  <AuthMoment.Centered>
    <AuthMoment.Wrap>
      <AuthMoment.Rule aria-hidden />
      <AuthMoment.Eyebrow>Email preferences</AuthMoment.Eyebrow>
      <AuthMoment.Title>You&rsquo;re unsubscribed.</AuthMoment.Title>
      <AuthMoment.Lead>
        You won&rsquo;t receive product updates or announcements from Strive any more.
      </AuthMoment.Lead>

      <AuthMoment.Hint>
        Account messages &mdash; email verification, password resets and security codes &mdash;
        still send, because they&rsquo;re part of keeping your account working.
      </AuthMoment.Hint>

      <AuthMoment.FootLine>
        Changed your mind? You can turn product updates back on any time under{' '}
        <Link href="/profile?tab=account">Email preferences</Link> in your profile.
      </AuthMoment.FootLine>
    </AuthMoment.Wrap>
  </AuthMoment.Centered>
);
