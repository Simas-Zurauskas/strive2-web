import styled from 'styled-components';

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
  color: #fff;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.18),
    0 1px 3px rgba(0, 0, 0, 0.1);
  transition:
    background 0.15s,
    box-shadow 0.15s,
    transform 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.accentHover};
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.22),
      0 1px 3px rgba(0, 0, 0, 0.1);
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
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.18),
    0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transform-origin: bottom right;

  ${(p) => p.theme.media.tablet} {
    width: calc(100vw - 2rem);
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

export const HeaderAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.tertiaryMuted};
  color: ${(p) => p.theme.colors.tertiary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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

export const HeaderSubtitle = styled.div`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.04em;
  text-transform: uppercase;
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

export const Footnote = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  text-align: center;
`;

