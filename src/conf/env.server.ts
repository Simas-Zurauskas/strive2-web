/**
 * Server-only environment variables.
 *
 * Only import this from server-side code (API routes, middleware, SSR).
 * Importing from client components will throw because these vars
 * are not exposed to the browser.
 */

const getServerEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const NEXTAUTH_SECRET = getServerEnv('NEXTAUTH_SECRET');
export const NEXTAUTH_URL = getServerEnv('NEXTAUTH_URL');
export const GOOGLE_CLIENT_ID = getServerEnv('GOOGLE_CLIENT_ID');
export const GOOGLE_CLIENT_SECRET = getServerEnv('GOOGLE_CLIENT_SECRET');

/**
 * Canonical site origin used for sitemap entries, OpenGraph metadata, and
 * JSON-LD URLs. Derived from NEXTAUTH_URL (single source of truth) with
 * any trailing slash stripped. Server-only — JSON-LD and metadata are
 * server-rendered, so no `NEXT_PUBLIC_*` mirror is needed.
 */
export const SITE_URL = NEXTAUTH_URL.replace(/\/$/, '');
