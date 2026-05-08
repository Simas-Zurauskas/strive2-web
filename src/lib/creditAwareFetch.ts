import { fireInsufficientCredits } from './creditModalBus';

/**
 * `fetch` wrapper that surfaces 402 INSUFFICIENT_CREDITS to the global
 * Out-of-Credits modal. Used by streaming surfaces that bypass our axios
 * client + React Query MutationCache (the AI-SDK chat panels, the lesson
 * generation kick-off via `useLessonStream`) — without this, those paths
 * would silently fail with a generic error string while every other paid
 * action correctly opens the modal.
 *
 * The modal listens to the credit-modal bus (see `creditModalBus.ts` and
 * `OutOfCreditsModal.tsx`); firing the bus is enough to open it.
 */
export const creditAwareFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  if (response.status === 402) {
    // Clone so the SDK can still consume the body for its own error path.
    try {
      const body = (await response.clone().json()) as {
        errorCode?: string;
        meta?: { need?: number; have?: number };
      };
      if (body.errorCode === 'INSUFFICIENT_CREDITS') {
        fireInsufficientCredits({
          need: typeof body.meta?.need === 'number' ? body.meta.need : 0,
          have: typeof body.meta?.have === 'number' ? body.meta.have : 0,
        });
      }
    } catch {
      // Body wasn't JSON — 402 alone is a strong enough signal.
      fireInsufficientCredits({ need: 0, have: 0 });
    }
  }
  return response;
};
