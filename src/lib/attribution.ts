/**
 * First-touch marketing attribution capture.
 *
 * Answers "which campaign, referrer, or ad click produced this account" — the
 * question every paid-acquisition decision depends on and which nothing in the
 * app could answer before this existed. Without it every visit that isn't a
 * direct type-in collapses into GA's "Direct" bucket, because the campaign
 * parameters live in the landing URL and are gone the moment the visitor
 * navigates.
 *
 * **First touch, not last.** The record is written once and never overwritten:
 * a visitor who arrives from a Meta ad, leaves, and comes back a week later via
 * organic search is still attributed to the ad that found them. The server
 * enforces the same rule independently (`POST /api/auth/me/attribution` matches
 * on `attribution: { $exists: false }`), so a cleared localStorage cannot
 * relabel an existing account either.
 *
 * **Consent.** Capture is gated on `hasAnalyticsConsent()` — the same opt-out
 * flag that gates Mixpanel and gtag. A visitor who has chosen "essential only"
 * gets no localStorage write and no attribution field on their user record.
 */

import { hasAnalyticsConsent } from '@/lib/cookieConsent';

const STORAGE_KEY = 'strive:attribution';

/**
 * The wire shape, matching the API's `attributionSchema` field-for-field.
 * Every field is optional because campaign parameters are inherently partial:
 * organic traffic carries a referrer and nothing else, while a Google Ads click
 * can carry a `gclid` with no UTM tags at all.
 */
export interface Attribution {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landingPath?: string;
  capturedAt?: string;
}

// Mirrors the server-side caps in `api/src/controlers/auth/validation.ts`.
// Trimming here as well keeps an over-long value from being stored locally and
// then silently rejected by the API at sign-up, which would look like a
// capture failure rather than a length problem.
const MAX_FIELD = 200;
const MAX_REFERRER = 500;

const clamp = (value: string | null, max: number): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
};

/**
 * Same-origin referrers are internal navigation, not acquisition. They appear
 * on a full page load from an in-app link (an SPA route change leaves
 * `document.referrer` untouched), and recording one would attribute the account
 * to our own site.
 */
const externalReferrer = (): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const ref = document.referrer;
  if (!ref) return undefined;
  try {
    if (new URL(ref).origin === window.location.origin) return undefined;
  } catch {
    return undefined;
  }
  return clamp(ref, MAX_REFERRER);
};

const readStored = (): Attribution | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    // Anything can be written to localStorage by anything. Accept only a plain
    // object and let the field readers below ignore non-string members, rather
    // than trusting the shape and shipping garbage to the API.
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Attribution)
      : null;
  } catch {
    return null;
  }
};

/** True when the record carries something worth attributing an account to. */
const hasSignal = (a: Attribution): boolean =>
  Boolean(a.source || a.medium || a.campaign || a.term || a.content || a.gclid || a.fbclid || a.referrer);

/**
 * Capture the current URL's campaign parameters if — and only if — nothing has
 * been captured before. Safe to call on every mount and every route change;
 * after the first successful capture it is a single localStorage read.
 *
 * Returns the stored record (existing or freshly written), or `null` when
 * there is nothing to attribute or consent is withheld.
 */
export const captureAttribution = (): Attribution | null => {
  if (typeof window === 'undefined') return null;
  if (!hasAnalyticsConsent()) return null;

  const existing = readStored();
  if (existing) return existing;

  const params = new URLSearchParams(window.location.search);
  const captured: Attribution = {
    source: clamp(params.get('utm_source'), MAX_FIELD),
    medium: clamp(params.get('utm_medium'), MAX_FIELD),
    campaign: clamp(params.get('utm_campaign'), MAX_FIELD),
    term: clamp(params.get('utm_term'), MAX_FIELD),
    content: clamp(params.get('utm_content'), MAX_FIELD),
    gclid: clamp(params.get('gclid'), MAX_FIELD),
    fbclid: clamp(params.get('fbclid'), MAX_FIELD),
    referrer: externalReferrer(),
    landingPath: clamp(window.location.pathname, MAX_FIELD),
    capturedAt: new Date().toISOString(),
  };

  // A direct type-in has no UTMs, no click id, and no external referrer. There
  // is nothing to attribute, and writing an empty record would burn the
  // one-shot first-touch slot — so the visitor stays uncaptured until they
  // arrive via something identifiable.
  if (!hasSignal(captured)) return null;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
  } catch {
    // Private mode or a full quota. The record is still returned so this
    // page-load's events carry it; only cross-session persistence is lost.
  }
  return captured;
};

/** Read the stored first-touch record without attempting a capture. */
export const getAttribution = (): Attribution | null => readStored();

/**
 * Drop the stored record. Called when a visitor switches to "essential only"
 * after a capture already happened — under the opt-out model the default is
 * consent, so a record can legitimately exist at the moment consent is
 * withdrawn, and leaving it behind would keep marketing data the user has just
 * refused.
 */
export const clearAttribution = (): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode — nothing was persisted to remove */
  }
};

/**
 * Flatten to Mixpanel super properties. Prefixed `first_touch_` so they never
 * collide with per-event properties, and omitting absent fields so events from
 * unattributed visitors don't carry a row of nulls.
 */
export const toSuperProperties = (a: Attribution): Record<string, string> => {
  const entries: [string, string | undefined][] = [
    ['first_touch_source', a.source],
    ['first_touch_medium', a.medium],
    ['first_touch_campaign', a.campaign],
    ['first_touch_term', a.term],
    ['first_touch_content', a.content],
    ['first_touch_gclid', a.gclid],
    ['first_touch_fbclid', a.fbclid],
    ['first_touch_referrer', a.referrer],
    ['first_touch_landing_path', a.landingPath],
  ];
  return Object.fromEntries(
    entries.filter((e): e is [string, string] => typeof e[1] === 'string' && e[1].length > 0),
  );
};
