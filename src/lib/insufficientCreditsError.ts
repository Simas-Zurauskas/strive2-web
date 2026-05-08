import type { ClientApiError } from '@/api/types';

/**
 * Detects 402 INSUFFICIENT_CREDITS errors across the heterogeneous shapes
 * we encounter — axios-thrown `ClientApiError`s, generic `Error` objects
 * from the AI SDK whose `message` is a JSON-encoded body, and direct
 * `Response`s. Used by:
 *   - the streaming chat panels (suppressing the inline error banner once
 *     the modal has taken over),
 *   - non-React-Query call sites that need to short-circuit their toast
 *     fallback when the failure is actually "out of credits".
 */
export const isInsufficientCreditsError = (err: unknown): boolean => {
  if (!err) return false;

  const apiErr = err as ClientApiError;
  if (apiErr.status === 402 && apiErr.errorCode === 'INSUFFICIENT_CREDITS') {
    return true;
  }

  // AI SDK wraps non-2xx responses as Errors whose `message` is the raw
  // response body. Sniff for the errorCode token to keep the check cheap
  // and avoid a JSON.parse for every unrelated chat error.
  if (err instanceof Error && err.message.includes('"errorCode":"INSUFFICIENT_CREDITS"')) {
    return true;
  }

  return false;
};
