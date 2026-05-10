import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';

// ── Full-page centered label (loading / not found) ────

export const FullCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 56px);
  opacity: 0.5;
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Layout shell ───────────────────────────────────────

export const Layout = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  min-height: calc(100dvh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Sidebar slot ───────────────────────────────────────
// Mirror of ChatSlot: empty grid placeholder, animates `width` so the
// lesson content reflows when the sidebar opens/closes. The visible
// sidebar is rendered separately via SidebarPanelFixed.

export const SidebarSlot = styled(motion.aside)`
  flex-shrink: 0;

  ${(p) => p.theme.media.desktop} {
    /* Small screens: panel overlays at full width, no grid space needed. */
    width: 0 !important;
  }
`;

// ── Fixed sidebar panel wrapper ───────────────────────
// Mirror of ChatPanelFixed (LEFT edge). Same bottom-pinned approach so
// any element anchored to the panel's bottom is rock-stable during
// navbar transitions.

export const SidebarPanelFixed = styled(motion.div)`
  position: fixed;
  top: var(--navbar-offset, 56px);
  /* --shell-bottom-offset is set by CourseShell to the height of the
     footer currently visible in the viewport (0 most of the time). The
     panel retracts upward as the footer scrolls into view so it never
     overlaps the footer. */
  bottom: var(--shell-bottom-offset, 0px);
  left: 0;
  width: 420px;
  z-index: 30;
  transition: top 0.3s ease;
  display: flex;

  ${(p) => p.theme.media.desktop} {
    /* Keep the panel anchored BELOW the navbar so the panel's own header
       (with its close button) is reachable. Previously top:0 hid the
       header behind the navbar (z:50) and left users with no escape. */
    top: var(--navbar-offset, 56px);
    bottom: 0;
    width: 100%;
    z-index: 40;
  }
`;

// ── Chat slot ──────────────────────────────────────────

// ── Chat slot ──────────────────────────────────────────
// EMPTY grid placeholder. Its only job is to animate `width` so the
// lesson content reflows when the chat opens/closes. The visible panel
// is rendered separately via ChatPanelFixed (position: fixed) — that's
// what lets us pin the panel's bottom edge to viewport bottom and avoid
// the sub-pixel wobble that interpolating top+height used to cause for
// any element anchored to the panel's bottom (the chat composer).

export const ChatSlot = styled(motion.aside)`
  flex-shrink: 0;

  ${(p) => p.theme.media.desktop} {
    /* Small screens: panel overlays at full width, no grid space needed. */
    width: 0 !important;
  }
`;

// ── Fixed chat panel wrapper ───────────────────────────
// Positioned with top: var(--navbar-offset) and bottom: 0 so the BOTTOM
// edge is anchored to viewport bottom by CSS — no interpolation, no math
// to go wrong. Only `top` transitions during the navbar slide. The chat
// composer (anchored to this element's bottom via the inner grid)
// literally cannot move during navbar transitions.
//
// translateX animates open/close (and bakes in the parallax — content
// travels further than the slot's width so it "leads" the exit). The
// outer ChatSlot still animates width for grid layout reflow (lesson
// content reclaims the space), but doesn't render anything itself.

export const ChatPanelFixed = styled(motion.div)`
  position: fixed;
  top: var(--navbar-offset, 56px);
  /* See SidebarPanelFixed — same retract-when-footer-visible mechanism. */
  bottom: var(--shell-bottom-offset, 0px);
  right: 0;
  width: 420px;
  z-index: 30;
  transition: top 0.3s ease;
  display: flex;

  ${(p) => p.theme.media.desktop} {
    /* Same rationale as SidebarPanelFixed — anchor below navbar so the
       collapse/close button in the panel's header isn't hidden behind it. */
    top: var(--navbar-offset, 56px);
    bottom: 0;
    width: 100%;
    z-index: 40;
  }
`;

// ── Backdrop (mobile overlays) ─────────────────────────

export const Backdrop = styled.div`
  display: none;

  ${(p) => p.theme.media.desktop} {
    display: block;
    position: fixed;
    /* Match the panel's top offset — leaves the navbar tappable while
       the panel is open, so the user always has an escape hatch. */
    top: var(--navbar-offset, 56px);
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 30;
    background: var(--scrim-light);
  }
`;

// ── Center content slot ────────────────────────────────
// Horizontal padding gives the lesson content breathing room from the
// side panels (and their closed-state edge tabs). The inner LessonContent
// Container still has max-width: 740 + its own 2rem padding, and the
// hero image deliberately breaks out by 2rem to be flush with the inner
// container's edges — that flush edge now lands inside this gutter
// instead of on top of the panel border.

export const ContentSlot = styled.main`
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 56px);
  /* The parent <main> in (protected)/layout.tsx pads its own top by
     var(--navbar-offset) — covering the nav row + any extension slot
     (e.g. our lesson bar). No additional top padding needed here, and
     adding any would double-count. */
  padding: 0 2rem;

  ${(p) => p.theme.media.desktop} {
    padding: 0 1.25rem;
  }

  ${(p) => p.theme.media.tablet} {
    padding: 0 0.75rem;
  }
`;

// ── Lesson bar ─────────────────────────────────────────
// Rendered inside the main navbar's NavExtensionSlot via React portal.
// No own positioning, no own background, no own border — it just lays
// out its hamburger / title / chat icon in a horizontal row. The parent
// Nav supplies the fixed positioning, translucent fill, blur, and
// hide-on-scroll transform, so the lesson bar shares all of those as a
// single visual surface with the navbar above it.

export const LessonBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  /* Three-tier gutter matching NavRow above and ContentSlot below — so
     "Strive" (NavRow), the hamburger (here), and the lesson hero image
     (ContentSlot) all share the same x at every breakpoint. */
  padding: 0.5rem 2rem;

  ${(p) => p.theme.media.desktop} {
    padding: 0.5rem 1.25rem;
  }

  ${(p) => p.theme.media.tablet} {
    padding: 0.5rem 0.75rem;
  }
`;

export const LessonBarTitle = styled.span`
  flex: 1;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.875rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Mirrors the app navbar's quiet icon-button language (ThemeToggle in
// Navbar.styles.ts): round 32px chip, surfaceBorder ring, transparent
// fill, muted icon that warms to foreground on hover. No filled
// background, no card shadow — keeps the lesson bar reading as a thin
// translucent strip rather than a row of opaque chiclets.
const iconButtonBase = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${(p: { theme: { colors: Record<string, string> } }) => p.theme.colors.surfaceBorder};
  background: transparent;
  color: ${(p: { theme: { colors: Record<string, string> } }) => p.theme.colors.muted};
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
    color: ${(p: { theme: { colors: Record<string, string> } }) => p.theme.colors.foreground};
    border-color: ${(p: { theme: { colors: Record<string, string> } }) => p.theme.colors.border};
  }

  &:active {
    transform: scale(0.95);
    transition-duration: 80ms;
  }

  &:focus-visible {
    outline: 2px solid ${(p: { theme: { colors: Record<string, string> } }) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const IconButton = styled.button`
  ${iconButtonBase}
`;

// ── Desktop chat edge tab (collapsed-state affordance) ────
// A small "Mentor" tab pinned to the right edge, vertically
// centered in the content area (respects --navbar-offset so it
// shifts gently when the navbar hides). Italic-serif label echoes
// the Strive wordmark. On hover it tints accent and slides outward
// for a subtle depth cue. Click → open the panel.
// Hidden on tablet/mobile — the top-bar MessageCircle button is
// the small-screen entry point.

export const ChatEdgeTab = styled(motion.button)`
  position: fixed;
  top: calc(50vh + var(--navbar-offset, 56px) / 2);
  right: 0;
  z-index: 5;
  width: 30px;
  min-height: 124px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-right: none;
  border-radius: 12px 0 0 12px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  box-shadow: var(--shadow-drawer-l);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    width 0.25s ease,
    box-shadow 0.25s ease,
    top 0.3s ease;

  &:hover,
  &:focus-visible {
    width: 42px;
    background: ${(p) => p.theme.colors.accentMuted};
    color: ${(p) => p.theme.colors.accent};
    box-shadow: var(--shadow-drawer-l-hover);
    outline: none;
  }

  ${(p) => p.theme.media.desktop} {
    display: none;
  }
`;

export const ChatEdgeTabLabel = styled.span`
  writing-mode: vertical-rl;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.04em;
`;

// ── Desktop sidebar edge tab (collapsed-state affordance) ────
// Mirror of ChatEdgeTab on the LEFT edge. Rounded-right corners,
// shadow goes rightward, hover grows leftward (so right edge stays
// glued to the viewport-left without leaving a gap on the left).

export const SidebarEdgeTab = styled(motion.button)`
  position: fixed;
  top: calc(50vh + var(--navbar-offset, 56px) / 2);
  left: 0;
  z-index: 5;
  width: 30px;
  min-height: 124px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-left: none;
  border-radius: 0 12px 12px 0;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  box-shadow: var(--shadow-drawer-r);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    width 0.25s ease,
    box-shadow 0.25s ease,
    top 0.3s ease;

  &:hover,
  &:focus-visible {
    width: 42px;
    background: ${(p) => p.theme.colors.accentMuted};
    color: ${(p) => p.theme.colors.accent};
    box-shadow: var(--shadow-drawer-r-hover);
    outline: none;
  }

  ${(p) => p.theme.media.desktop} {
    display: none;
  }
`;

export const SidebarEdgeTabLabel = styled.span`
  writing-mode: vertical-rl;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.04em;
`;
