/**
 * Thin wrapper around the Meta Pixel global (`fbq`), mirroring `lib/gtag.ts`.
 *
 * The base snippet in `app/layout.tsx` defines `window.fbq` synchronously and
 * queues calls until `fbevents.js` loads, so callers can fire from `useEffect`
 * without racing the async load. Every function here no-ops when the pixel is
 * absent — dev builds, or prod with `NEXT_PUBLIC_META_PIXEL_ID` unset.
 */

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void };
    _fbq?: unknown;
  }
}

const fbqAvailable = (): boolean =>
  typeof window !== 'undefined' && typeof window.fbq === 'function';

/**
 * Fires a `PageView` on App Router navigation. The base snippet fires one on
 * initial load only; without this the pixel would see a single URL per session
 * and undercount everything after it — the same failure `GAPageviewListener`
 * exists to prevent for GA4.
 */
export const fbqPageview = (): void => {
  if (!fbqAvailable()) return;
  window.fbq!('track', 'PageView');
};

/**
 * Meta's consent gate. Until `grant`, a revoked pixel queues calls without
 * sending them. Mirrors the gtag Consent Mode bridge in
 * `CookieConsentBootstrap` so one banner choice governs both vendors.
 */
export const fbqConsent = (granted: boolean): void => {
  if (!fbqAvailable()) return;
  window.fbq!('consent', granted ? 'grant' : 'revoke');
};
