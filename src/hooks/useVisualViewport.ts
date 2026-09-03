'use client';

import { useEffect, useState } from 'react';

/**
 * Live visual-viewport geometry — the primitive behind `--keyboard-inset`
 * and `--visual-viewport-height`.
 *
 * ── Why this exists ─────────────────────────────────────────────────────
 * Measured on an iPhone 17 / iOS 26.5 (task 005 device addendum, §A):
 *
 *   toolbar shown, no keyboard   innerHeight 714   100dvh 714   visual 714
 *   keyboard raised              innerHeight 615   100dvh 714   visual 353
 *
 * Two consequences, neither of them expressible in CSS alone:
 *
 *   1. `dvh` does NOT respond to the software keyboard. A control anchored
 *      to the bottom of a `100dvh` shell sits 361px BELOW the visible area
 *      once the keyboard is up (714 - 353). Full-height shells therefore
 *      need `--visual-viewport-height`, not `100dvh`.
 *   2. `position: fixed|sticky; bottom: 0` resolves against the layout
 *      viewport (615), so it lands 262px under the keyboard. Bottom-anchored
 *      bars therefore need `bottom: var(--keyboard-inset)`.
 *
 * `env(safe-area-inset-*)` covers neither: all four insets measure 0 in
 * portrait Safari, keyboard or not.
 *
 * The CSS custom properties are published by ViewportInsetBootstrap; this
 * hook is for the cases that need the number in JS (e.g. deciding whether
 * to scrollIntoView after a submit).
 */

/**
 * Below this, a shrink is browser chrome — Safari's form accessory bar, an
 * Android suggestion strip, or the URL-bar collapse — not a keyboard worth
 * relayouting for. The measured `100vh`/`100dvh` gap on iOS 26.5 is exactly
 * 40px, so 60 clears the toolbar transition with margin while staying far
 * below the 262px a real keyboard takes.
 *
 * Known cost: an external keyboard's ~55px accessory bar is not compensated.
 * That is deliberate — jitter on every scroll is worse than 55px.
 */
const KEYBOARD_MIN_INSET = 60;

export interface VisualViewportState {
  /**
   * CSS px of the layout viewport hidden at the bottom — the distance a
   * bottom-anchored element must be lifted to stay visible. Floored to 0
   * below `KEYBOARD_MIN_INSET`, so browser chrome never moves anything.
   */
  inset: number;
  /** Height of the visible band in CSS px. 0 until the first measurement. */
  viewportHeight: number;
  /** A real software keyboard is open. */
  keyboardOpen: boolean;
}

// SSR and the first client render must agree, so the initial value is a
// constant. Reading `window` in a lazy initialiser would render a different
// tree on the client than the server sent, on every page that consumes this.
const INITIAL: VisualViewportState = { inset: 0, viewportHeight: 0, keyboardOpen: false };

const measure = (): VisualViewportState => {
  const vv = window.visualViewport;
  if (!vv) return { inset: 0, viewportHeight: window.innerHeight, keyboardOpen: false };

  // Pinch-zoom shrinks the visual viewport too. Lifting chrome then would
  // fight the user's own zoom, so report the un-zoomed layout viewport.
  if (Math.abs(vv.scale - 1) > 0.01) {
    return { inset: 0, viewportHeight: window.innerHeight, keyboardOpen: false };
  }

  const raw = Math.round(window.innerHeight - vv.height - vv.offsetTop);
  const inset = raw >= KEYBOARD_MIN_INSET ? raw : 0;
  return {
    inset,
    viewportHeight: Math.round(vv.height),
    keyboardOpen: inset > 0,
  };
};

export const useVisualViewport = (): VisualViewportState => {
  const [state, setState] = useState<VisualViewportState>(INITIAL);

  useEffect(() => {
    // No-op where the API is unavailable. Every consumer reads the value
    // through `var(--x, <static fallback>)`, so nothing depends on this
    // effect having run.
    const vv = window.visualViewport;
    if (!vv) return;

    let frame = 0;
    // rAF-throttled: iOS fires `resize` on every frame of the keyboard
    // animation and each write forces a style recalc.
    const sync = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setState((prev) => {
          const next = measure();
          return prev.inset === next.inset && prev.viewportHeight === next.viewportHeight
            ? prev
            : next;
        });
      });
    };

    sync();
    // `scroll` matters as much as `resize`: iOS pans the visual viewport to
    // reveal a focused field without ever resizing it.
    vv.addEventListener('resize', sync);
    vv.addEventListener('scroll', sync);
    window.addEventListener('orientationchange', sync);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      vv.removeEventListener('resize', sync);
      vv.removeEventListener('scroll', sync);
      window.removeEventListener('orientationchange', sync);
    };
  }, []);

  return state;
};

/** Convenience alias for the common case — see `VisualViewportState.inset`. */
export const useKeyboardInset = (): number => useVisualViewport().inset;
