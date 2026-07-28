'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { recordAttribution } from '@/api/routes/auth';
import { useAuth } from '@/hooks';
import { analytics } from '@/lib/analytics';
import { getAttribution } from '@/lib/attribution';

/**
 * Bridges Mixpanel identity to NextAuth + getMe state:
 *   - signup   → `analytics.identify(userId, true)` (alias then identify)
 *   - signin (or page reload while authed) → `analytics.identify(userId)`
 *   - logout   → `analytics.reset()`
 *
 * The alias on signup is what merges the anonymous landing-page timeline
 * (`$device:<uuid>`) into the new user's, so the pre-signup funnel — auth modal
 * opened, pricing viewed — and the post-signup funnel belong to one person
 * rather than two unrelated profiles. It fires from `session.isNewUser`, which
 * the API reports and the NextAuth callbacks carry through; there is no other
 * signal for it, because Google sign-in and sign-up are one endpoint and 92%
 * of accounts arrive that way.
 *
 * The same moment is when first-touch attribution is persisted to the user
 * record — it is the only point where the browser holds both the captured
 * campaign parameters and an authenticated session.
 *
 * People-properties refresh whenever the userId transitions — refreshing
 * `$email`, `$name`, `email_verified`, `plan`, `is_admin` keeps cohort
 * filters in sync without waiting for the next server-side event.
 *
 * Must mount inside `QueryClientProvider` — `useAuth` reads from React
 * Query's cache.
 */
export const AnalyticsIdentitySync = () => {
  const { user } = useAuth();
  const { data: session, update } = useSession();
  const previousIdRef = useRef<string | null>(null);
  // Guards the once-per-signup work below. A ref rather than the session flag
  // alone because clearing the flag is an async round trip — without this,
  // re-renders between the call and its clear would repeat both the alias and
  // the attribution write.
  const signupHandledRef = useRef(false);

  const isNewSignup = session?.isNewUser === true;

  useEffect(() => {
    if (user && previousIdRef.current !== user._id) {
      analytics.identify(user._id, isNewSignup);
      analytics.setUserProps({
        $email: user.email,
        ...(user.name ? { $name: user.name } : {}),
        email_verified: user.emailVerified === true,
        plan: user.subscription?.plan ?? 'free',
        is_admin: user.isAdmin === true,
        $created: user.createdAt,
      });
      previousIdRef.current = user._id;
    } else if (!user && previousIdRef.current) {
      analytics.reset();
      previousIdRef.current = null;
      signupHandledRef.current = false;
    }
  }, [user, isNewSignup]);

  useEffect(() => {
    if (!user || !isNewSignup || signupHandledRef.current) return;
    signupHandledRef.current = true;

    // Fire-and-forget in both directions. A visitor with no campaign
    // parameters has nothing to send, and a failed write must never surface to
    // someone who has just created an account — the attribution is a marketing
    // nicety, the signup is the thing that mattered.
    const attribution = getAttribution();
    const written = attribution
      ? recordAttribution(attribution).catch(() => undefined)
      : Promise.resolve();

    // Clear the flag only after the write has settled, so a reload mid-flight
    // still finds `isNewUser` set and retries rather than losing the record.
    void written.then(() => update({ consumeNewUser: true })).catch(() => undefined);
  }, [user, isNewSignup, update]);

  return null;
};
