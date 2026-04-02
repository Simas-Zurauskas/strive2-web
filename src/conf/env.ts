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
