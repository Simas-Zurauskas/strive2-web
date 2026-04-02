import axios from 'axios';
import { signOut } from 'next-auth/react';
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

client.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response?.status === 401) {
      signOut();
    }

    return parseErrorData(err.response?.data).then((parsed) => Promise.reject(parsed));
  },
);
