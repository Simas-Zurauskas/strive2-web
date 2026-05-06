'use client';

import { useReducedMotion } from 'framer-motion';

export const easeOutSpring = [0.16, 1, 0.3, 1] as const;

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
