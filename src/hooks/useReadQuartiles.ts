'use client';

import { useEffect, useRef } from 'react';

const QUARTILES = [25, 50, 75] as const;

export type ReadQuartile = (typeof QUARTILES)[number];

/**
 * Fires `onQuartile(25|50|75)` once each as the visitor scrolls the page —
 * the missing signal between `lesson_opened` and `lesson_completed`, where
 * production data showed a 7× drop with zero telemetry in between.
 *
 * Measures window scroll against full document height (the lesson layout
 * scrolls the window; there is no inner scroll container). That makes the
 * quartiles a "how far down the page" proxy rather than exact prose
 * position — good enough to separate "bounced at the top" from "read most
 * of it", which is the question the funnel needs answered.
 *
 * `resetKey` restarts the fired-set when the reader moves to another lesson
 * without a route unmount. Listener is passive and rAF-throttled.
 */
export const useReadQuartiles = ({
  enabled,
  resetKey,
  onQuartile,
}: {
  enabled: boolean;
  resetKey: string;
  onQuartile: (quartile: ReadQuartile) => void;
}): void => {
  // Keep the callback in a ref so scroll handling never re-subscribes on
  // parent re-renders (the caller passes an inline closure).
  const onQuartileRef = useRef(onQuartile);
  useEffect(() => {
    onQuartileRef.current = onQuartile;
  });

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const fired = new Set<number>();
    let ticking = false;

    const measure = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      // Degenerate case: content shorter than the viewport. Nothing to
      // scroll means the whole lesson is on screen — report it as fully
      // reached rather than never firing.
      const pct = scrollable <= 0 ? 100 : ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
      for (const q of QUARTILES) {
        if (pct >= q && !fired.has(q)) {
          fired.add(q);
          onQuartileRef.current(q);
        }
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    // Initial measurement (not just on scroll): content shorter than the
    // viewport never scrolls, and quartiles already in view at mount should
    // report without waiting for the first scroll event.
    const initialFrame = requestAnimationFrame(measure);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(initialFrame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [enabled, resetKey]);
};
