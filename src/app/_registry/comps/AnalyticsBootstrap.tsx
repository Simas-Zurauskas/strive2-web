'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

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
 */
export const AnalyticsBootstrap = () => {
  useEffect(() => {
    analytics.registerSuper({
      platform: 'web',
      app_version: process.env.NEXT_PUBLIC_RELEASE_SHA ?? 'dev',
    });
  }, []);
  return null;
};
