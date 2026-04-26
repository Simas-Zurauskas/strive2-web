// Module-level, non-React bus for routing 402 INSUFFICIENT_CREDITS errors
// from the axios/React Query layer into the OutOfCreditsModal component.
//
// Why not React Context: the MutationCache onError handler in Registry.tsx
// is constructed once at QueryClient init — it can't hold React hooks, so
// it has no React-tree access. A module-level listener ref keeps the
// dispatch path purely imperative while the modal component itself still
// lives inside the React tree.

export interface InsufficientCreditsMeta {
  /** Credits the attempted action needed. */
  need: number;
  /** Credits the user currently has. */
  have: number;
}

type Listener = (meta: InsufficientCreditsMeta) => void;

let currentListener: Listener | null = null;

/**
 * Subscribe to 402 events. The provider component should call this once on
 * mount and call the returned unsubscribe function on unmount. Only one
 * listener is active at a time — the bus is a singleton, not a broadcast.
 */
export const registerCreditModalListener = (listener: Listener): (() => void) => {
  currentListener = listener;
  return () => {
    if (currentListener === listener) currentListener = null;
  };
};

/**
 * Fire an INSUFFICIENT_CREDITS event. No-ops if no listener is registered
 * (e.g. during SSR or before the modal provider has mounted) — better to
 * silently drop the event than crash the error handler.
 */
export const fireInsufficientCredits = (meta: InsufficientCreditsMeta): void => {
  currentListener?.(meta);
};
