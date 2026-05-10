/**
 * Shared motion language for the lesson-screen side panels (right = chat
 * mentor, left = lessons sidebar). Both panels share the SAME timing,
 * easing curves, and parallax magnitude — only the parallax direction
 * differs (right panel slides right on close, left panel slides left).
 *
 * Easing rationale (UI/UX):
 *  - Both open AND close use the same iOS-style decelerating ease
 *    `cubic-bezier(0.32, 0.72, 0, 1)`. The motion starts immediately on
 *    the user's action (responsive), then decelerates smoothly into its
 *    target (premium). This is the curve Apple uses for sheet/panel
 *    transitions in iOS — it feels at-rest at both ends and never
 *    "lingers" or "snaps".
 *  - Close is shorter (300ms) than open (450ms): closing should feel
 *    purposeful and quick, opening can take a beat longer because it's
 *    delivering content the user is about to engage with.
 *  - DO NOT use easeIn for close — it makes the panel "delay then snap
 *    shut" which feels unresponsive. Save accelerating eases for things
 *    that are leaving the user's attention permanently (toasts), not
 *    panels they may reopen.
 *
 * Parallax rationale:
 *  - Inner content shifts ~80px in the closing direction so it "leads"
 *    the exit and "settles in" on entry. Tied to the same ease/duration
 *    as the slot so the two layers read as a single coordinated motion.
 */

import {
  PANEL_CLOSE_TRANSITION,
  PANEL_EASE,
  PANEL_OPEN_TRANSITION,
} from '@/theme/motionPresets';
import type { Transition, Variants } from 'framer-motion';

// Re-exports — historically these constants lived in this file, now
// they're a shared motion vocabulary used by every "panel slides in"
// surface (Navbar app drawer, structure-step refine drawer, plus the
// course shell side panels here). Keep these re-exports so existing
// imports across CourseShell continue to work.
export { PANEL_CLOSE_TRANSITION, PANEL_OPEN_TRANSITION };

export const PANEL_WIDTH = 420;
export const PANEL_PARALLAX_OFFSET = 80;

// ── Slot (width) ──────────────────────────────────────
// Slot width animation is identical for both sides — only the inner
// layout's `justify-content` differs (set on the styled component, not
// here).

export const slotVariants: Variants = {
  open: { width: PANEL_WIDTH, transition: PANEL_OPEN_TRANSITION },
  closed: { width: 0, transition: PANEL_CLOSE_TRANSITION },
};

// ── Fixed-panel translateX (open/close + parallax baked in) ───
// The fixed panel slides off-screen by its own width on close, plus an
// extra parallax distance so the content "leads" the slot's width
// collapse — looks like the panel is leaving rather than just being
// uncovered. Same magnitude in both directions; only sign differs.

// Percentage-based translation makes the panel slide exactly its own width
// off-screen — works regardless of whether the panel is the desktop 420px
// fixed width or the tablet/mobile 100% width. Parallax pixel offset is added
// on top via `calc()` so the closed state lands ~80px past the viewport edge.

export const rightPanelVariants: Variants = {
  open: { x: 0, transition: PANEL_OPEN_TRANSITION },
  closed: {
    x: `calc(100% + ${PANEL_PARALLAX_OFFSET}px)`,
    transition: PANEL_CLOSE_TRANSITION,
  },
};

export const leftPanelVariants: Variants = {
  open: { x: 0, transition: PANEL_OPEN_TRANSITION },
  closed: {
    x: `calc(-100% - ${PANEL_PARALLAX_OFFSET}px)`,
    transition: PANEL_CLOSE_TRANSITION,
  },
};

// ── Edge tab (slides off when panel opens, returns when it closes) ──
// Same iOS ease as the panel — exits during the open animation (short),
// enters after the panel has mostly closed (delayed) so it doesn't
// overlap with the retreating panel.

export const tabExitTransition: Transition = {
  duration: 0.28,
  ease: PANEL_EASE,
};

export const tabEnterTransition: Transition = {
  duration: 0.38,
  ease: PANEL_EASE,
  delay: 0.28,
};
