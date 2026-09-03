'use client';

import { useEffect, useRef } from 'react';

/** Below this offset the top of the page is effectively already in view. */
const ALREADY_AT_TOP_PX = 8;

/** Above this multiple of the viewport, animating the trip is pointless. */
const SMOOTH_SCROLL_MAX_VIEWPORTS = 1.5;

/**
 * Send the page back to the top when a screen swaps its content in place.
 *
 * The quiz and recall loops advance by state, not by route: question 1 ->
 * question 2, results -> (Retake) -> question 1, card -> next card, last
 * card -> "Done for today". The `window.scrollTo(0, 0)` in
 * `app/(protected)/layout.tsx` is keyed on `pathname`, so it never fires
 * for any of them and the learner keeps whatever offset they were at when
 * they pressed the button. Because the advance control itself sits below
 * the fold on a phone, they are *forced* into a deep offset first, which
 * guarantees the next step opens off-screen. Measured at 375x667: quiz
 * next-question held scrollY 530 (stem above the viewport, option A at
 * -81), quiz retake held 1256 on a 2108px document, recall next-card held
 * 316 with the new prompt at -143, recall completion held 291.
 *
 * Three rules keep this from becoming its own annoyance:
 *  - It never fires on first mount. The hook arms on the first non-null
 *    key and acts only on a *change*, so arriving on the screen fresh
 *    (scroll already 0) does nothing at all.
 *  - It never fires when the page is already at the top, so there is no
 *    redundant scroll event for iOS momentum to fight.
 *  - `prefers-reduced-motion: reduce` gets an instant jump, and so does
 *    any trip longer than 1.5 viewports (a 1256px smooth scroll is most
 *    of a second of travel over content the learner has already left).
 *    Note the global `scroll-behavior: auto !important` reduced-motion
 *    rule in GlobalStyles does NOT cover this: an explicit
 *    `behavior: 'smooth'` passed to scrollTo() overrides the CSS
 *    property, so the preference has to be read here in JS.
 *
 * @param key Identity of the step currently on screen. Pass `null` while
 *            the screen has no step yet (loading), so the first real step
 *            arms the hook instead of triggering a scroll.
 */
export const useScrollToTopOnStep = (key: string | null): void => {
  const lastStep = useRef<string | null>(null);

  useEffect(() => {
    if (key === null) return;
    const previous = lastStep.current;
    lastStep.current = key;
    // First armed step, or a re-render on the same step (a react-query
    // refetch, a socket tick, a StrictMode double-invoke) — none of
    // those is a step change.
    if (previous === null || previous === key) return;

    const distance = window.scrollY;
    if (distance <= ALREADY_AT_TOP_PX) return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLongTrip = distance > window.innerHeight * SMOOTH_SCROLL_MAX_VIEWPORTS;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion || isLongTrip ? 'auto' : 'smooth',
    });
  }, [key]);
};
