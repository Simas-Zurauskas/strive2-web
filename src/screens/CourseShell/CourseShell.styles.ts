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
// Desktop: part of grid, sidebar is sticky inside it.
// Mobile (≤1024): fixed overlay with width animation.

export const SidebarSlot = styled.aside<{ $open: boolean }>`
  width: ${(p) => (p.$open ? '360px' : '0px')};
  flex-shrink: 0;

  /* On desktop, no transition — sidebar toggles instantly to avoid
     the flash when navigating between lessons (component remounts). */
  ${(p) => p.theme.media.desktop} {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 40;
    height: 100dvh;
    overflow: hidden;
    width: ${(p) => (p.$open ? '360px' : '0px')};
    transition: width 200ms ease;
  }
`;

// ── Chat slot ──────────────────────────────────────────

export const ChatSlot = styled.aside<{ $open: boolean }>`
  width: ${(p) => (p.$open ? '360px' : '0px')};
  flex-shrink: 0;

  ${(p) => p.theme.media.desktop} {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 40;
    height: 100dvh;
    overflow: hidden;
    width: ${(p) => (p.$open ? '360px' : '0px')};
    transition: width 200ms ease;
  }

  ${(p) => p.theme.media.tablet} {
    width: ${(p) => (p.$open ? '100%' : '0px')};
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

export const ContentSlot = styled.main`
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 56px);
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

// ── Desktop chat toggle (floating) ─────────────────────

export const ChatToggle = styled.button`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: ${(p) => p.theme.colors.accent};
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 20px ${(p) => `${p.theme.colors.accent}40`};
  transition:
    box-shadow 0.25s ease,
    transform 0.15s ease;

  &:hover {
    box-shadow: 0 6px 28px ${(p) => `${p.theme.colors.accent}50`};
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 12px ${(p) => `${p.theme.colors.accent}30`};
  }

  ${(p) => p.theme.media.desktop} {
    display: none;
  }
`;
