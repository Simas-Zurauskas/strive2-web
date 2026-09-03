/**
 * Cookie-consent state machine. Read by `lib/analytics.ts` and the gtag
 * Consent Mode v2 bridge before any non-essential script fires.
 *
 * Three states (opt-out model — analytics default ON):
 *   - `null`        — user has not chosen yet; banner is shown, but
 *                     Mixpanel, GA4, and Google Ads already fire. Only an
 *                     explicit "essential only" turns them off.
 *   - `'all'`       — user accepted analytics + marketing.
 *   - `'essential'` — user rejected non-essential. Sentry + Stripe +
 *                     NextAuth + theme persistence stay on; Mixpanel,
 *                     GA4, Google Ads, and Appzi do not fire.
 *
 * Persisted to `localStorage` so the choice survives reloads. Cross-tab
 * sync is handled by the storage event automatically; same-tab consumers
 * subscribe via the custom event below.
 */

import { NEXT_PUBLIC_API_URL } from '@/conf/env';

const CONSENT_KEY = 'strive:cookie-consent';
const ANON_ID_KEY = 'strive:anonymous-id';
const CHANGE_EVENT = 'strive:cookie-consent-changed';
// The POLICY_VERSION the stored choice was made under. Kept in a second
// key rather than folded into CONSENT_KEY's value so every already-stored
// choice stays readable by the old parser (and by analytics.ts, which
// only ever goes through getConsent()).
const CONSENT_VERSION_KEY = 'strive:cookie-consent-version';

// Bumped manually whenever the cookie-consent UX or the policy text it
// references changes substantively. Persisted with each consent record so
// past consents can be tied to the policy that was in effect at the time.
const POLICY_VERSION = '2026-07-30';

export type ConsentValue = 'all' | 'essential';

const safeUUID = (): string => {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through to weak fallback */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

const getOrCreateAnonymousId = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const existing = window.localStorage.getItem(ANON_ID_KEY);
    if (existing) return existing;
    const fresh = safeUUID();
    window.localStorage.setItem(ANON_ID_KEY, fresh);
    return fresh;
  } catch {
    return null;
  }
};

export const getConsent = (): ConsentValue | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (raw !== 'all' && raw !== 'essential') return null;
    const storedVersion = window.localStorage.getItem(CONSENT_VERSION_KEY);
    if (storedVersion === null) {
      // Migration: records written before the version key existed. Adopt
      // them under the current policy rather than re-prompting the entire
      // installed base on the deploy that ships this change; enforcement
      // starts at the next POLICY_VERSION bump.
      try {
        window.localStorage.setItem(CONSENT_VERSION_KEY, POLICY_VERSION);
      } catch {
        /* private mode — the grandfather just doesn't stick */
      }
      return raw;
    }
    // Consent given under an older policy is no longer a valid basis for
    // processing — the information the user agreed to has changed. Report
    // it as "no choice yet" so the banner re-prompts on the next bump.
    // Before this key existed, bumping POLICY_VERSION could not re-prompt
    // anyone: it was written into the server audit row and nowhere else.
    if (storedVersion !== POLICY_VERSION) return null;
    return raw;
  } catch {
    return null;
  }
};

/**
 * GDPR Art. 7(1) requires the controller to be able to demonstrate that
 * consent was given. localStorage alone fails that test ("I never
 * accepted"). Mirror every choice to the server via a best-effort POST.
 * Failures are swallowed — the local choice still applies; demonstrability
 * for that one record is lost. `keepalive: true` lets the fetch survive
 * a tab-close mid-flight (essential for the banner-then-leave path).
 */
const recordConsentToServer = (value: ConsentValue): void => {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
  const anonymousId = getOrCreateAnonymousId();
  try {
    void fetch(`${NEXT_PUBLIC_API_URL}/api/auth/consent-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      // Attach Authorization if a NextAuth token is available — the
      // optionalProtect middleware on the route lifts userId off it. We
      // don't have a synchronous accessor here, so the anonymous record
      // covers the common path; an authed user simply gets two records
      // (one anonymous from before sign-in, one tied to userId post-auth).
      body: JSON.stringify({ value, anonymousId, policyVersion: POLICY_VERSION }),
    }).catch(() => {
      /* best-effort — local choice still applies */
    });
  } catch {
    /* same — never block UX on the audit-log side-effect */
  }
};

export const setConsent = (value: ConsentValue): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.localStorage.setItem(CONSENT_VERSION_KEY, POLICY_VERSION);
  } catch {
    /* private mode etc. — fall through; consent is in-memory for this tab */
  }
  recordConsentToServer(value);
  window.dispatchEvent(new CustomEvent<ConsentValue>(CHANGE_EVENT, { detail: value }));
};

/**
 * GDPR Art. 7(3): "It shall be as easy to withdraw as to give consent." Clears
 * the local choice so the banner reappears on the next mount and re-prompts.
 *
 * Caveat: scripts already loaded in the current page (Mixpanel, gtag, Appzi
 * once consent was 'all') stay in memory until reload. The banner UX should
 * therefore advise a reload — or this helper can be paired with
 * `window.location.reload()` at the call site for true revoke.
 */
export const clearConsent = (): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
    window.localStorage.removeItem(CONSENT_VERSION_KEY);
  } catch {
    /* same — we only get best-effort under private mode */
  }
  // Mirror the revoke server-side so the audit trail captures the
  // withdrawal as a distinct event (value: null).
  if (typeof fetch !== 'undefined') {
    const anonymousId = getOrCreateAnonymousId();
    try {
      void fetch(`${NEXT_PUBLIC_API_URL}/api/auth/consent-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ value: null, anonymousId, policyVersion: POLICY_VERSION }),
      }).catch(() => {});
    } catch {
      /* best-effort */
    }
  }
  window.dispatchEvent(new CustomEvent<ConsentValue | null>(CHANGE_EVENT, { detail: null }));
};

// Opt-out model: analytics fire by default and stay on unless the user
// explicitly chooses "essential only". `null` (no choice yet) counts as ON.
export const hasAnalyticsConsent = (): boolean => getConsent() !== 'essential';

/**
 * Subscribe to consent changes. Fires for both same-tab `setConsent`
 * calls (via the custom event) and cross-tab writes (via the storage
 * event). Returns the unsubscribe function.
 */
export const subscribeConsent = (cb: (value: ConsentValue | null) => void): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;
  const onCustom = (e: Event) => cb((e as CustomEvent<ConsentValue>).detail);
  const onStorage = (e: StorageEvent) => {
    // `key === null` is a localStorage.clear() from another tab.
    if (e.key !== null && e.key !== CONSENT_KEY && e.key !== CONSENT_VERSION_KEY) return;
    // Re-read rather than trusting newValue — the answer now depends on
    // two keys, and only one of them fires per event.
    cb(getConsent());
  };
  window.addEventListener(CHANGE_EVENT, onCustom);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onCustom);
    window.removeEventListener('storage', onStorage);
  };
};
