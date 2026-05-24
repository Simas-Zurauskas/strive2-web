'use client';

import { useEffect } from 'react';
import { getConsent, subscribeConsent, type ConsentValue } from '@/lib/cookieConsent';

/**
 * Bridges the localStorage consent flag to runtime tracking surfaces:
 *
 *   - **gtag (Google Ads + GA4)**: the inline bootstrap in `app/layout.tsx`
 *     defaults every storage signal to `'granted'` (Consent Mode v2,
 *     opt-out). This component keeps them granted for `'all'` and the
 *     default (`null`) state, and flips `ad_storage` / `ad_user_data` /
 *     `ad_personalization` / `analytics_storage` to `'denied'` only on an
 *     explicit `'essential'` choice; gtag.js then runs cookieless.
 *
 *   - **Mixpanel**: `lib/analytics.ts` checks `hasAnalyticsConsent()` on
 *     every call. On consent grant, this component re-fires the SPA's
 *     initial pageview so the very first event is captured (otherwise
 *     gtag's first `page_view` already happened in the denied state).
 *
 * Mounted at the same Registry layer as `AnalyticsBootstrap` so it runs
 * on every route, public + protected.
 */
export const CookieConsentBootstrap = () => {
  useEffect(() => {
    const apply = (value: ConsentValue | null): void => {
      if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
      if (value === 'essential') {
        window.gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
        });
      } else {
        // 'all' and the default null (no choice yet) both keep tracking on.
        window.gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted',
        });
      }
    };
    apply(getConsent());
    return subscribeConsent(apply);
  }, []);

  return null;
};
