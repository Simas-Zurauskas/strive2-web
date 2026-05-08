'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { ConceptId } from '@/components/ConceptsModal/registry';

const KEY_PREFIX = 'strive.concept.viewed.';
const EVENT = 'strive:concept-viewed';

const readFlag = (id: ConceptId): boolean => {
  if (typeof window === 'undefined') return true; // assume viewed on server — no pulse pre-hydration
  try {
    return window.localStorage.getItem(`${KEY_PREFIX}${id}`) === '1';
  } catch {
    return false;
  }
};

const writeFlag = (id: ConceptId): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`${KEY_PREFIX}${id}`, '1');
  } catch {
    // localStorage can throw in private mode / quota — silently drop.
  }
};

const subscribe = (id: ConceptId, onChange: () => void): (() => void) => {
  const listener = (e: Event) => {
    const detail = (e as CustomEvent<{ id: ConceptId }>).detail;
    if (detail?.id === id) onChange();
  };
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
};

/**
 * Imperative side-effect: write the viewed flag for `id` and broadcast to
 * every live `useConceptViewed` instance so all anchors of the same concept
 * stop pulsing at once. Called from the ConceptModal close paths.
 */
export const markConceptViewed = (id: ConceptId): void => {
  writeFlag(id);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { id } }));
  }
};

/**
 * Tracks whether a given concept has been viewed before on this device.
 *
 * Returns `[viewed, markViewed]`:
 *   - `viewed` mirrors localStorage; updates live across all hook instances
 *     when any one fires the `markConceptViewed` broadcast.
 *   - `markViewed()` writes the flag and broadcasts to every other anchor on
 *     the page so they stop pulsing simultaneously.
 *
 * SSR-safe via `useSyncExternalStore`'s `getServerSnapshot`: returns `true`
 * on the server (suppresses pulse before hydration) and re-reads localStorage
 * on the first client render.
 */
export const useConceptViewed = (id: ConceptId): [boolean, () => void] => {
  const viewed = useSyncExternalStore(
    useCallback((onChange) => subscribe(id, onChange), [id]),
    useCallback(() => readFlag(id), [id]),
    () => true, // server snapshot — suppresses pulse pre-hydration
  );

  const markViewed = useCallback(() => markConceptViewed(id), [id]);

  return [viewed, markViewed];
};
