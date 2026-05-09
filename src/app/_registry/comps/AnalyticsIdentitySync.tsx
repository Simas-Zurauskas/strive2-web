'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks';
import { analytics } from '@/lib/analytics';

/**
 * Bridges Mixpanel identity to NextAuth + getMe state:
 *   - signin (or page reload while authed) → `analytics.identify(userId)`
 *   - logout → `analytics.reset()`
 *
 * `isNew=true` (alias-then-identify) is NOT handled here. Signup-completion
 * is wired explicitly from the SignUpForm onSuccess handler so the alias
 * call merges anonymous landing-page events into the new user's timeline
 * before any post-signup event fires. By the time this component sees the
 * new userId, the alias has already happened and a plain `identify()` is
 * sufficient.
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
  const previousIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (user && previousIdRef.current !== user._id) {
      analytics.identify(user._id);
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
    }
  }, [user]);

  return null;
};
