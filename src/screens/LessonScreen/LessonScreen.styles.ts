import styled, { css } from 'styled-components';

// ── Layout shell ───────────────────────────────────────

export const Layout = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Sidebar slot ───────────────────────────────────────

export const SidebarSlot = styled.aside<{ $open: boolean }>`
  width: ${(p) => (p.$open ? '260px' : '0px')};
  overflow: hidden;
  transition: width 200ms ease;
  flex-shrink: 0;

  @media (max-width: 1023px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 40;
    height: 100vh;
    width: ${(p) => (p.$open ? '260px' : '0px')};
  }
`;

// ── Chat slot ──────────────────────────────────────────

export const ChatSlot = styled.aside<{ $open: boolean }>`
  width: ${(p) => (p.$open ? '360px' : '0px')};
  overflow: hidden;
  transition: width 200ms ease;
  flex-shrink: 0;

  @media (max-width: 1023px) {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 40;
    height: 100vh;
    width: ${(p) => (p.$open ? '360px' : '0px')};
  }

  @media (max-width: 640px) {
    width: ${(p) => (p.$open ? '100%' : '0px')};
  }
`;

// ── Backdrop (mobile overlays) ─────────────────────────

export const Backdrop = styled.div`
  display: none;

  @media (max-width: 1023px) {
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
  min-height: 100vh;
`;

// ── Mobile top bar ─────────────────────────────────────

export const TopBar = styled.div`
  display: none;

  @media (max-width: 1023px) {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
    background: ${(p) => p.theme.colors.background};
    position: sticky;
    top: 0;
    z-index: 20;
  }
`;

export const TopBarTitle = styled.span`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 600;
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
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  cursor: pointer;
  flex-shrink: 0;
  font-size: 1.125rem;
  transition: background 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.surface};
  }
`;

export const IconButton = styled.button`
  ${iconButtonBase}
`;

// ── Desktop chat toggle (floating) ─────────────────────

export const ChatToggle = styled.button`
  ${iconButtonBase}
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);

  @media (max-width: 1023px) {
    display: none;
  }
`;
