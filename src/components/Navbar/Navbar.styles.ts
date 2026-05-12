import { motion } from 'framer-motion';
import Link from 'next/link';
import styled from 'styled-components';
import { thinScrollbar } from '@/theme';

// The Nav is a flex-column wrapper. The first row (NavRow) holds the
// always-on app navigation; a second slot (NavExtensionSlot) is empty by
// default and receives per-route extension content (e.g. CourseShell's
// lesson bar). One element, one backdrop-filter, one translucent fill —
// any extension content paints as a true visual continuation of the
// navbar, no seam, no timing drift.
//
// On hide-on-scroll, the entire Nav translates UP by exactly the height
// of the NavRow (56px), not the full element height. That tucks the
// nav row off-screen while leaving the extension slot visible at the
// top of the viewport — i.e. the lesson bar stays put, the app
// navigation slides away.
export const Nav = styled.nav<{ $hidden?: boolean; $scrolled?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background: ${(p) =>
    p.$scrolled
      ? `color-mix(in oklab, ${p.theme.colors.background} 50%, transparent)`
      : `color-mix(in oklab, ${p.theme.colors.background} 65%, transparent)`};
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border-bottom: 1px solid
    ${(p) =>
      p.$hidden ? 'transparent' : p.$scrolled ? p.theme.colors.surfaceBorder : 'transparent'};
  z-index: 50;
  transform: translateY(${(p) => (p.$hidden ? '-56px' : '0px')});
  transition:
    transform 0.3s ease,
    background 0.2s,
    border-color 0.2s;
  will-change: transform;

  /* Inside the course shell at tablet/below-desktop the lesson bar is
     the last visible row of this Nav element — the scrolled-state
     border-bottom is therefore the lesson bar's own bottom outline,
     which is exactly what we want once the page is scrolled. We don't
     suppress it here. Background is locked to the unscrolled 65% so the
     row's color doesn't flicker against the lesson bar when scrolling
     crosses the 24px threshold. */
  body.in-course-shell & {
    ${(p) => p.theme.media.desktop} {
      background: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.background} 65%, transparent)`};
    }
  }
`;

// 56px-tall app-navigation row. Holds LeftCluster + Right with the
// horizontal space-between layout the navbar always had.
//
// Padding matches the three-tier gutter pattern used by per-screen
// content containers (e.g. CourseShell.ContentSlot). At large-tablet
// widths (641–1024) the gutter narrows from 2rem to 1.25rem, and at
// small-tablet (≤640) to 0.75rem — so the wordmark, the lesson bar's
// hamburger, and any page hero image all line up on the same x.
export const NavRow = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  /* Notch / status-bar avoidance on iOS Safari with viewport-fit=cover.
     env() resolves to 0 on devices without a cutout so desktop gutters
     are unchanged. The padding goes on the *row*, not the fixed <Nav>
     wrapper, so the row content is pushed inward without growing the
     row's vertical footprint (the 56px height contract drives
     --navbar-offset). */
  padding-left: max(2rem, var(--safe-area-left));
  padding-right: max(2rem, var(--safe-area-right));

  ${(p) => p.theme.media.desktop} {
    padding-left: max(1.25rem, var(--safe-area-left));
    padding-right: max(1.25rem, var(--safe-area-right));
  }

  ${(p) => p.theme.media.tablet} {
    padding-left: max(0.75rem, var(--safe-area-left));
    padding-right: max(0.75rem, var(--safe-area-right));
  }
`;

// Extension slot. Empty by default (zero-height when childless). When a
// route mounts content here (currently only CourseShell, via portal), the
// slot expands to fit and the navbar's overall height grows with it. The
// slot inherits Nav's translucent fill, blur, and translateY transform —
// so its content cannot ever desync from the navbar.
export const NavExtensionSlot = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LeftCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  ${(p) => p.theme.media.tablet} {
    gap: 0.75rem;
  }
`;

export const Logo = styled.a`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.375rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  text-decoration: none;
  letter-spacing: -0.01em;
  /* line-height:1 strips the inherited 1.6 line box that otherwise
     pads above and below the glyphs. The 2px translate compensates
     for the font's ascent-vs-descent asymmetry — Newsreader's baseline
     sits below the line-box geometric center, so letters land slightly
     above center even with line-height:1. The translate brings the
     visible glyphs to the optical center alongside the hamburger. */
  line-height: 1;
  transform: translateY(2px);
`;

export const Divider = styled.span`
  width: 1px;
  height: 18px;
  background: ${(p) => p.theme.colors.border};
  flex-shrink: 0;

  /* Tablet collapses Links into the hamburger drawer, so the visual
     separator between the wordmark and the (now-hidden) link group
     would float on its own. Hide it. */
  ${(p) => p.theme.media.desktop} {
    display: none;
  }
`;

export const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  /* Inline links collapse into the hamburger drawer at tablet and below.
     Below the desktop breakpoint the only navigation lever in the bar
     is the hamburger; the rest of the nav lives in the drawer. */
  ${(p) => p.theme.media.desktop} {
    display: none;
  }
`;

// Hamburger button shown only at tablet/below — opens the AppNavDrawer.
// Lives at the very left of the navbar, taking the spot where the
// wordmark used to be at desktop. The wordmark sits to the immediate
// right of it. Same icon-button language as the existing ThemeToggle
// for visual coherence.
export const HamburgerButton = styled.button`
  display: none;

  ${(p) => p.theme.media.desktop} {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    background: transparent;
    color: ${(p) => p.theme.colors.muted};
    cursor: pointer;
    flex-shrink: 0;
    transition:
      color 180ms cubic-bezier(0.22, 0.61, 0.36, 1),
      border-color 180ms cubic-bezier(0.22, 0.61, 0.36, 1),
      transform 120ms cubic-bezier(0.22, 0.61, 0.36, 1);

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      color: ${(p) => p.theme.colors.foreground};
      /* Stay on surfaceBorder — --border collapses to --surface in
         dark mode so the ring would vanish on hover. */
      border-color: ${(p) => p.theme.colors.surfaceBorder};
    }

    &:active {
      transform: scale(0.95);
      transition-duration: 80ms;
    }

    &:focus-visible {
      outline: 2px solid ${(p) => p.theme.colors.accent};
      outline-offset: 2px;
    }
  }
`;

export const NavLink = styled(Link)<{ $active?: boolean }>`
  position: relative;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => (p.$active ? p.theme.colors.foreground : p.theme.colors.muted)};
  text-decoration: none;
  transition: color 0.15s;
  padding: 0.375rem 0;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    border-radius: 1px;
    background: ${(p) => p.theme.colors.accent};
    opacity: ${(p) => (p.$active ? 1 : 0)};
    transform: scaleX(${(p) => (p.$active ? 1 : 0.6)});
    transform-origin: center;
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  ${(p) => p.theme.media.desktop} {
    gap: 0.5rem;
  }
`;

// Inline cluster that lays out its children only at desktop — the
// items inside (theme switch, feedback button, help) migrate into the
// hamburger drawer at tablet and below to keep the bar uncluttered.
// At tablet the bar carries only essentials: CreditPill (allowance
// awareness) and the user avatar (one-tap account access).
export const DesktopOnlyCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  ${(p) => p.theme.media.desktop} {
    display: none;
  }
`;

export const ThemeToggle = styled.button`
  /* Mirrors ThemeSwitch's quiet container language: surfaceBorder ring,
     transparent fill, muted icon. Hover only warms the icon — no fill,
     no lift, no shadow — so these stay calm next to the segmented switch. */
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    color 180ms cubic-bezier(0.22, 0.61, 0.36, 1),
    border-color 180ms cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 120ms cubic-bezier(0.22, 0.61, 0.36, 1);

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    /* Stay on surfaceBorder — see DrawerCloseButton for rationale. */
    border-color: ${(p) => p.theme.colors.surfaceBorder};
  }

  &:active {
    transform: scale(0.95);
    transition-duration: 80ms;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const FeedbackButton = styled.button`
  /* Same-hue tinted-pill language as CreditPill's warning/danger states:
     muted accent fill + accent-tinted border + saturated accent text/icon.
     Hover lifts to a solid accent fill with surface-colored content. */
  height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 0.85rem 0 0.75rem;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, ${(p) => p.theme.colors.accent} 40%, transparent);
  background: color-mix(in srgb, ${(p) => p.theme.colors.accent} 15%, transparent);
  color: ${(p) => p.theme.colors.accent};
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.005em;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
    color 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
    border-color 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 160ms cubic-bezier(0.22, 0.61, 0.36, 1);

  svg {
    width: 14px;
    height: 14px;
    color: currentColor;
    transition: transform 260ms cubic-bezier(0.22, 0.61, 0.36, 1);
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.accent};
      color: ${(p) => p.theme.colors.surface};
      border-color: ${(p) => p.theme.colors.accent};
      box-shadow:
        0 2px 10px ${(p) => p.theme.colors.accentMuted},
        var(--shadow-card);
      transform: translateY(-0.5px);
    }

    &:hover svg {
      transform: translateX(-1px);
    }
  }

  &:active {
    transform: translateY(0) scale(0.97);
    transition-duration: 80ms;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  ${(p) => p.theme.media.tablet} {
    /* Drop the label on narrow screens — the icon + tooltip carry the meaning. */
    padding: 0;
    width: 32px;
    justify-content: center;
    border-radius: 50%;
    gap: 0;

    span {
      display: none;
    }
  }
`;

export const ThemeSwitch = styled.div`
  height: 32px;
  display: inline-flex;
  align-items: stretch;
  padding: 3px;
  border-radius: 9999px;
  /* surfaceBorder, not border — in dark mode --border collapses to the
     same value as --surface, so a ring drawn in --border against a
     surface-toned drawer is invisible. surfaceBorder is one tone
     lighter and reads in both themes. */
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: transparent;
`;

export const ThemeOption = styled.button<{ $active: boolean }>`
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background: ${(p) => (p.$active ? p.theme.colors.accent : 'transparent')};
  color: ${(p) => (p.$active ? p.theme.colors.surface : p.theme.colors.muted)};
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    color: ${(p) => (p.$active ? p.theme.colors.surface : p.theme.colors.foreground)};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

// ── App nav drawer (tablet/below) ────────────────────────
// A left-edge slide-in panel that absorbs the navigation links and
// secondary actions hidden from the bar at tablet. Motion matches the
// CourseShell side panels: same ease + duration, so opening any drawer
// in the app feels like the same gesture.
//
// Behavior:
//  - tap backdrop → close
//  - tap a link → navigate AND close (handled in onClick)
//  - Esc → close (handled in tsx)

export const DrawerBackdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: var(--scrim-light);
  opacity: ${(p) => (p.$open ? 1 : 0)};
  pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`;

// Framer-motion-driven so we can wire drag-to-close on top of the
// open/close animation. Open/closed positions are passed via the
// `animate` prop in Navbar.tsx; drag is constrained to the closed-side
// only and drag-end either confirms close (past distance/velocity
// threshold) or snaps back to open.
export const Drawer = styled(motion.aside)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(320px, 86vw);
  z-index: 61;
  background: ${(p) => p.theme.colors.surface};
  border-right: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  box-shadow: var(--shadow-drawer-r);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  touch-action: pan-y;
  ${thinScrollbar}
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  height: 56px;
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  flex-shrink: 0;
`;

export const DrawerCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    color 180ms cubic-bezier(0.22, 0.61, 0.36, 1),
    border-color 180ms cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 120ms cubic-bezier(0.22, 0.61, 0.36, 1);

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    /* Keep the surfaceBorder ring on hover — using --border collapses
       to --surface in dark mode and the ring vanishes. The icon color
       warming to foreground is enough hover feedback. */
    border-color: ${(p) => p.theme.colors.surfaceBorder};
  }

  &:active {
    transform: scale(0.95);
    transition-duration: 80ms;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const DrawerSection = styled.section`
  padding: 0.5rem 0.5rem;

  & + & {
    border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }
`;

export const DrawerSectionLabel = styled.span`
  display: block;
  padding: 0.5rem 0.75rem 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const DrawerLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  color: ${(p) => (p.$active ? p.theme.colors.foreground : p.theme.colors.muted)};
  background: ${(p) =>
    p.$active
      ? `color-mix(in srgb, ${p.theme.colors.accent} 12%, transparent)`
      : 'transparent'};
  text-decoration: none;
  transition:
    background 0.15s,
    color 0.15s;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: ${(p) => (p.$active ? p.theme.colors.accent : p.theme.colors.muted)};
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
      background: ${(p) =>
        `color-mix(in srgb, ${p.theme.colors.accent} 8%, transparent)`};
    }
  }
`;

// Same shape as DrawerLink but a button (for actions like feedback).
export const DrawerAction = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  text-align: left;
  cursor: pointer;
  width: 100%;
  transition:
    background 0.15s,
    color 0.15s;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
      background: ${(p) =>
        `color-mix(in srgb, ${p.theme.colors.accent} 8%, transparent)`};
    }
  }
`;

export const DrawerThemeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
`;

export const DrawerThemeLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
`;

