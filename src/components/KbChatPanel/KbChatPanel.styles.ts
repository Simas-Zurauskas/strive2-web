import styled from 'styled-components';
import { onAccent } from '@/theme';

// ── Fixed root anchor ──────────────────────────────────────
//
// Sits at the bottom-right of the viewport, above page content. Both the
// FAB and the expanded widget anchor to this same corner, so framer's
// scale + opacity transition reads as a smooth bloom out of the FAB.

export const Root = styled.div`
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 60;
  pointer-events: none;

  ${(p) => p.theme.media.tablet} {
    right: 1rem;
    bottom: 1rem;
  }
`;

// ── FAB ────────────────────────────────────────────────────

export const Fab = styled.button`
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 52px;
  padding: 0 1.125rem;
  border: none;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.accent};
  color: ${onAccent};
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: var(--shadow-panel);
  transition:
    background 0.15s,
    box-shadow 0.15s,
    transform 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.accentHover};
    box-shadow: var(--shadow-panel-hover);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 3px;
  }

  ${(p) => p.theme.media.tablet} {
    height: 48px;
    padding: 0 0.875rem;
    font-size: 0.8125rem;
  }
`;

export const FabLabel = styled.span`
  ${(p) => p.theme.media.mobile} {
    display: none;
  }
`;

// ── Expanded widget ────────────────────────────────────────

export const Widget = styled.div`
  pointer-events: auto;
  width: 380px;
  height: min(640px, calc(100vh - 3rem));
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  box-shadow: var(--shadow-panel-lg);
  overflow: hidden;
  transform-origin: bottom right;

  /* Stay at the 380px default at tablet — full-width-minus-margin only
     kicks in at mobile, where the widget genuinely needs every pixel.
     At tablet/large-tablet the widget anchors to the bottom-right
     corner with the rest of the page visible around it; previously the
     ≤640 rule made the widget span almost the whole viewport with the
     left edge butted against the screen edge. */
  ${(p) => p.theme.media.tablet} {
    height: min(620px, calc(100vh - 2rem));
  }

  ${(p) => p.theme.media.mobile} {
    width: calc(100vw - 1.5rem);
    height: calc(100vh - 5rem);
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
`;


export const HeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const HeaderTitle = styled.div`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: ${(p) => p.theme.colors.foreground};
`;

export const HeaderAction = styled.button`
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  border-radius: 6px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.tertiaryMuted};
    color: ${(p) => p.theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 1px;
  }
`;

export const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.background};
`;

