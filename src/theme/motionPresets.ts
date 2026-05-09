'use client';

import type { Transition } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

export const easeOutSpring = [0.16, 1, 0.3, 1] as const;

// iOS-style decelerating cubic-bezier — Apple's sheet/panel transition
// curve. Quick start, smooth deceleration into rest. The vocabulary
// shared by every "panel slides in/out" gesture in the app: lesson
// course-outline + chat panels, the app-nav drawer, the structure-step
// refine drawer. Keep them all on this curve so panels feel like the
// same gesture wherever they appear.
export const PANEL_EASE = [0.32, 0.72, 0, 1] as const;

// Open is longer than close — opening delivers content the user is
// about to engage with, closing should feel quick and purposeful.
// Tuned to land in the middle of "premium-slow" and "snappy": 400ms
// open / 300ms close reads as deliberate without feeling laggy.
export const PANEL_OPEN_TRANSITION: Transition = {
  duration: 0.4,
  ease: PANEL_EASE,
};
export const PANEL_CLOSE_TRANSITION: Transition = {
  duration: 0.3,
  ease: PANEL_EASE,
};

const FADE_UP = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: easeOutSpring },
};

const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

const DIALOG_POP = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 4 },
  transition: { duration: 0.22, ease: easeOutSpring },
};

const REDUCED = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.12 },
};

export function useMotion() {
  const prefersReduced = useReducedMotion() ?? false;
  return {
    fadeUp: prefersReduced ? REDUCED : FADE_UP,
    fadeIn: prefersReduced ? REDUCED : FADE_IN,
    dialogPop: prefersReduced ? REDUCED : DIALOG_POP,
    prefersReduced,
  };
}
