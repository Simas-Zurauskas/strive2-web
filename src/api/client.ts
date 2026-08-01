import axios, { InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import { ApiError } from './types';

export const client = axios.create({
  baseURL: `${NEXT_PUBLIC_API_URL}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// ── Token store (kept in sync by useAuth) ───────────────────

let _token: string | null = null;
export const setAuthToken = (token: string | null) => {
  _token = token;
};
export const getAuthToken = () => _token;

// ── Request: attach Bearer token ────────────────────────────

client.interceptors.request.use((request) => {
  if (_token) {
    request.headers.set('Authorization', `Bearer ${_token}`);
  }

  return request;
});

// ── Response: parse errors & handle 401 ─────────────────────

/**
 * Parse error data from a response that may be JSON or a Blob.
 * Blob responses occur when the request uses `responseType: 'blob'` — Axios
 * wraps even error bodies as Blobs in that case.
 */
const parseErrorData = (data: unknown): Promise<ApiError> => {
  if (data instanceof Blob) {
    return data.text().then((text) => {
      try {
        return JSON.parse(text) as ApiError;
      } catch {
        return { message: 'Unknown error' };
      }
    });
  }
  return Promise.resolve((data as ApiError) ?? { message: 'Network error' });
};

/**
 * Marks a request we've already re-authenticated once, so a genuinely dead
 * session can't ping-pong between 401 and retry.
 */
type RetriableConfig = InternalAxiosRequestConfig & { _authRetried?: boolean };

client.interceptors.response.use(
  (response) => response,
  async (err) => {
    const status = err.response?.status as number | undefined;
    if (status === 401) {
      const config = err.config as RetriableConfig | undefined;
      // Whether the failed request carried a bearer header decides which
      // failure this is. A stale bearer means the server rotated our token
      // and rejected it — the session really is dead, so sign out. No
      // bearer at all means our own token store was empty when the request
      // went out, which is a client-side gap, not a revocation.
      const hadBearer = Boolean(config?.headers?.Authorization);

      if (hadBearer) {
        // Clear token immediately so in-flight requests can't resend the
        // invalidated one before NextAuth's session update propagates.
        setAuthToken(null);
        signOut();
      } else if (config && !config._authRetried) {
        // The store is module-scoped and mirrored from the NextAuth session
        // during render (<AuthTokenSync>), so it can be empty either because
        // the request raced ahead of the first sync ("I just signed in but
        // immediately got logged out"), or because a later session read
        // resolved empty — a cross-tab broadcast, a /api/auth/session fetch
        // that came back without a token — and wiped it while the UI still
        // looked signed in.
        //
        // Suppressing signOut fixed the eviction but left the second case a
        // dead end: the caller got a bare "Unauthorized", and every write
        // kept failing that way until the user happened to reload. Seen on
        // DELETE /auth/delete-account — the user held a valid emailed OTP
        // and had no way to spend it. So re-hydrate from NextAuth and replay
        // the request once. If the session is alive (the common case) the
        // caller never sees the failure; if it isn't, we fall through to the
        // rejection below with the server's message intact.
        const session = await getSession();
        if (session?.token) {
          setAuthToken(session.token);
          config._authRetried = true;
          return client(config);
        }
      }
    }

    return parseErrorData(err.response?.data).then((parsed) => Promise.reject({ ...parsed, status }));
  },
);
