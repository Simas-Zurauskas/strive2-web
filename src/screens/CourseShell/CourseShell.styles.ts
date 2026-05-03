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
  bottom: 0;
  left: 0;
  width: 420px;
  z-index: 30;
  transition: top 0.3s ease;
  display: flex;

  ${(p) => p.theme.media.desktop} {
    top: 0;
    width: 100%;
    z-index: 40;
    transition: none;
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
  bottom: 0;
  right: 0;
  width: 420px;
  z-index: 30;
  transition: top 0.3s ease;
  display: flex;

  ${(p) => p.theme.media.desktop} {
    top: 0;
    width: 100%;
    z-index: 40;
    transition: none;
  }
`;

// ── Backdrop (mobile overlays) ─────────────────────────

export const Backdrop = styled.div`
  display: none;

  ${(p) => p.theme.media.desktop} {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 30;
    background: rgba(0, 0, 0, 0.4);
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
  padding: 0 2rem;

  ${(p) => p.theme.media.desktop} {
    padding: 0 1.25rem;
  }

  ${(p) => p.theme.media.tablet} {
    padding: 0 0.75rem;
  }
`;

// ── Mobile top bar ─────────────────────────────────────

export const TopBar = styled.div`
  display: none;

  ${(p) => p.theme.media.desktop} {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
    background: ${(p) => `${p.theme.colors.surface}ee`};
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 20;
  }
`;

export const TopBarTitle = styled.span`
  flex: 1;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const iconButtonBase = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${(p: { theme: { colors: Record<string, string> } }) => p.theme.colors.border};
  background: ${(p: { theme: { colors: Record<string, string> } }) => p.theme.colors.background};
  color: ${(p: { theme: { colors: Record<string, string> } }) => p.theme.colors.foreground};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s,
    box-shadow 0.2s ease;

  &:hover {
    background: ${(p: { theme: { colors: Record<string, string> } }) => p.theme.colors.surface};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: none;
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
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.04);
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
    box-shadow: -6px 0 18px rgba(0, 0, 0, 0.08);
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
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
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
    box-shadow: 6px 0 18px rgba(0, 0, 0, 0.08);
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
