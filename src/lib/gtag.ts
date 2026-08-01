/**
 * Thin wrapper around the gtag.js global. Covers the two tags configured in
 * `app/layout.tsx` — Google Ads and GA4 — both of which are required env.
 *
 * The bootstrap script in layout.tsx defines `window.gtag` synchronously
 * and queues calls into `dataLayer`, so callers can fire events from
 * `useEffect` without racing the async gtag.js load.
 */

import { NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_GOOGLE_ADS_ID } from '@/conf/env';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const gtagAvailable = (): boolean =>
  typeof window !== 'undefined' && typeof window.gtag === 'function';

/**
 * Both destinations, named explicitly on every event.
 *
 * Do not rely on an omitted `send_to` to broadcast. With the Ads tag
 * configured first, every `sign_up` hit observed in the browser carried
 * `tid=AW-16959354608` and GA4 recorded no `sign_up` at all — across 70
 * signups the property's event list held only its own enhanced-measurement
 * events (page_view, scroll, form_start …), so it looked healthy while every
 * custom event the app sent was missing. Naming the targets puts `sign_up`
 * into the GA4 batch; verified in a real browser against the live tag IDs.
 */
const ALL_TARGETS = [NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_GOOGLE_ADS_ID];

/**
 * Fires a `page_view` event on every App Router navigation. The gtag
 * config in layout.tsx sets `send_page_view: false`, so this function is
 * the single source of truth for pageview emission.
 */
export const gtagPageview = (path: string): void => {
  if (!gtagAvailable()) return;
  window.gtag!('event', 'page_view', {
    send_to: ALL_TARGETS,
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
  });
};

/**
 * Fires an arbitrary gtag event to both tags. Pass `send_to` in `params` to
 * scope to a single one.
 */
export const gtagEvent = (name: string, params: Record<string, unknown> = {}): void => {
  if (!gtagAvailable()) return;
  window.gtag!('event', name, { send_to: ALL_TARGETS, ...params });
};
