/**
 * Thin wrapper around the gtag.js global. Covers two tags configured in
 * `app/layout.tsx`: a Google Ads tag (always on) and an optional GA4
 * tag (opt-in via `NEXT_PUBLIC_GA_MEASUREMENT_ID`).
 *
 * The bootstrap script in layout.tsx defines `window.gtag` synchronously
 * and queues calls into `dataLayer`, so callers can fire events from
 * `useEffect` without racing the async gtag.js load.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const gtagAvailable = (): boolean =>
  typeof window !== 'undefined' && typeof window.gtag === 'function';

/**
 * Fires a `page_view` event on every App Router navigation. The gtag
 * config in layout.tsx sets `send_page_view: false`, so this function is
 * the single source of truth for pageview emission. No `send_to`: the
 * event broadcasts to every configured tag (Ads + GA4).
 */
export const gtagPageview = (path: string): void => {
  if (!gtagAvailable()) return;
  window.gtag!('event', 'page_view', {
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
  });
};

/**
 * Fires an arbitrary gtag event. Pass `send_to` in `params` to scope to
 * a single tag; omit to broadcast.
 */
export const gtagEvent = (name: string, params: Record<string, unknown> = {}): void => {
  if (!gtagAvailable()) return;
  window.gtag!('event', name, params);
};

/**
 * Fires a Google Ads Conversion Action. `sendTo` is the per-action
 * identifier from the Ads UI, shaped like `AW-16959354608/AbC-DefG`.
 * Use at signup-success, checkout-success, etc. once the corresponding
 * Conversion Actions exist in the Ads account.
 */
export const adsConversion = (
  sendTo: string,
  params: { value?: number; currency?: string; transaction_id?: string } = {},
): void => {
  if (!gtagAvailable()) return;
  window.gtag!('event', 'conversion', { send_to: sendTo, ...params });
};
