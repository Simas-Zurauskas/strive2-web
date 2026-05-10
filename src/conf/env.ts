/**
 * Public environment variables — safe to import from client and server code.
 *
 * NEXT_PUBLIC_* vars are inlined at build time by Next.js via static
 * string replacement. They MUST be referenced as full literals
 * (e.g. `process.env.NEXT_PUBLIC_API_URL`) — dynamic access like
 * `process.env[key]` will not be replaced and will be undefined
 * in the browser.
 *
 * For server-only variables, import from `@/conf/env.server`.
 */

const _apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!_apiUrl) {
  throw new Error('Missing required environment variable: NEXT_PUBLIC_API_URL');
}

export const NEXT_PUBLIC_API_URL = _apiUrl;

export const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

/**
 * Google Ads conversion tag, e.g. `AW-1234567890`. Required — drives the
 * gtag bootstrap and any future `adsConversion()` calls. Format-validated
 * so a typo fails fast at module load rather than silently mis-attributing.
 */
const _adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

if (!_adsId) {
  throw new Error('Missing required environment variable: NEXT_PUBLIC_GOOGLE_ADS_ID');
}

export const NEXT_PUBLIC_GOOGLE_ADS_ID = _adsId;

/**
 * GA4 Measurement ID, e.g. `G-XXXXXXXXXX`. Required — registered in the
 * gtag bootstrap as a second `config` call so pageviews and events
 * broadcast to GA4 alongside the Ads tag. Format-validated.
 */
const _gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

if (!_gaId) {
  throw new Error('Missing required environment variable: NEXT_PUBLIC_GA_MEASUREMENT_ID');
}

export const NEXT_PUBLIC_GA_MEASUREMENT_ID = _gaId;

/**
 * Mixpanel project token. Same value as the api's MIXPANEL_PROJECT_TOKEN —
 * project tokens are write-only and safe to expose to the browser.
 * Required so the wrapper at `lib/analytics.ts` can initialise without
 * runtime guards.
 */
const _mpToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

if (!_mpToken) {
  throw new Error('Missing required environment variable: NEXT_PUBLIC_MIXPANEL_TOKEN');
}

export const NEXT_PUBLIC_MIXPANEL_TOKEN = _mpToken;

/**
 * Appzi feedback widget button GUID. Optional — when set, the navbar
 * Feedback button calls `window.appzi.openWidget(<guid>)` to surface the
 * configured widget. Get the GUID from the Appzi dashboard: Buttons →
 * Embed → "Trigger from a Custom Element". Without it the button hides.
 */
const _appziButtonId = process.env.NEXT_PUBLIC_APPZI_BUTTON_ID;

if (!_appziButtonId) {
  throw new Error('Missing required environment variable: NEXT_PUBLIC_APPZI_BUTTON_ID');
}

export const NEXT_PUBLIC_APPZI_BUTTON_ID = _appziButtonId;
