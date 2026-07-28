'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import { captureAttribution, clearAttribution, toSuperProperties } from '@/lib/attribution';
import { subscribeConsent } from '@/lib/cookieConsent';

/**
 * Registers Mixpanel "super properties" — values automatically attached
 * to every event fired from this device. Runs once at app boot, before
 * `AnalyticsIdentitySync` issues its first identify, so the very first
 * event already carries platform/build context.
 *
 * `app_version` lets us isolate a regression to a specific deploy in
 * the funnel views. `platform` separates web from any future native
 * surface without changing the event taxonomy.
 *
 * Build SHA comes from `NEXT_PUBLIC_RELEASE_SHA` if CI sets it; falls
 * back to a sentinel so events still group cleanly in dev.
 *
 * Also the first-touch attribution capture point. It belongs here rather than
 * on the landing page because campaign traffic does not only land on `/` — the
 * `/learn/<slug>` pages are the intended Search destinations, and a
 * landing-only capture would miss every one of them. Registering the campaign
 * as super properties means every later event (wizard steps, lesson opens)
 * carries it, so funnels segment by campaign without joining anything.
 */
export const AnalyticsBootstrap = () => {
  useEffect(() => {
    analytics.registerSuper({
      platform: 'web',
      app_version: process.env.NEXT_PUBLIC_RELEASE_SHA ?? 'dev',
    });

    const attribution = captureAttribution();
    if (attribution) {
      analytics.registerSuper(toSuperProperties(attribution));
    }

    // Under the opt-out model a capture can already have happened by the time
    // someone picks "essential only", so withdrawal has to actively discard it.
    return subscribeConsent((value) => {
      if (value === 'essential') clearAttribution();
    });
  }, []);
  return null;
};
