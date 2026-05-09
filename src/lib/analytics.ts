/**
 * Mixpanel browser wrapper. Centralises identity, super-property
 * registration, and the project-token guard so call sites stay terse:
 *
 *   import { analytics } from '@/lib/analytics';
 *   analytics.track('lesson_completed', { lesson_id, time_on_lesson_seconds });
 *
 * The wrapper is the only place that imports `mixpanel-browser`. If we
 * swap providers later (PostHog, Segment, etc.), every call site stays
 * unchanged.
 *
 * Identity model — see [mixpanel.md](../../../mixpanel.md):
 *   - Anonymous landing visit       → mixpanel auto-assigns `$device:<uuid>`
 *   - Sign-up complete              → analytics.identify(userId, true)
 *                                     calls alias() then identify() so the
 *                                     anonymous landing-page funnel merges
 *                                     into the same timeline.
 *   - Sign-in (return)              → analytics.identify(userId)
 *   - Logout                        → analytics.reset()
 */

import mixpanel from 'mixpanel-browser';
import { NEXT_PUBLIC_MIXPANEL_TOKEN } from '@/conf/env';
import { hasAnalyticsConsent } from '@/lib/cookieConsent';

let initialised = false;

/**
 * Mixpanel is gated behind cookie consent (`'all'`). Without consent
 * every export below is a no-op — no init, no localStorage write, no
 * network call. The consent bridge re-runs initialisation when the
 * user grants consent later (see `_registry/comps/CookieConsentBootstrap`).
 */
const ensureInit = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (!hasAnalyticsConsent()) return false;
  if (initialised) return true;
  mixpanel.init(NEXT_PUBLIC_MIXPANEL_TOKEN, {
    persistence: 'localStorage',
    track_pageview: false,
    ignore_dnt: false,
    api_host: 'https://api-eu.mixpanel.com',
  });
  initialised = true;
  return true;
};

export const analytics = {
  /**
   * Bind the current session to a user. Pass `isNew=true` exactly once at
   * sign-up completion so anonymous events recorded against the device id
   * merge into this user's timeline.
   */
  identify: (userId: string, isNew = false): void => {
    if (!ensureInit()) return;
    if (isNew) mixpanel.alias(userId);
    mixpanel.identify(userId);
  },

  /** Drop session identity. Call on logout to start a fresh device id. */
  reset: (): void => {
    if (!initialised || typeof window === 'undefined') return;
    mixpanel.reset();
  },

  track: (event: string, props: Record<string, unknown> = {}): void => {
    if (!ensureInit()) return;
    mixpanel.track(event, props);
  },

  /** Set people properties (`$set`). Use for plan, email_verified, etc. */
  setUserProps: (props: Record<string, unknown>): void => {
    if (!ensureInit()) return;
    mixpanel.people.set(props);
  },

  /**
   * Increment a numeric people property. Used for cumulative counters
   * like `total_courses_created` that shouldn't require a query-time
   * aggregation to use as a cohort filter.
   */
  incrementUserProp: (prop: string, by = 1): void => {
    if (!ensureInit()) return;
    mixpanel.people.increment(prop, by);
  },

  /**
   * Register a super property — automatically attached to every event
   * fired afterwards from this device. Use for app version, platform.
   */
  registerSuper: (props: Record<string, unknown>): void => {
    if (!ensureInit()) return;
    mixpanel.register(props);
  },
};
