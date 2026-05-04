import styled from 'styled-components';

// ── Sticky shell ──────────────────────────────────────
// Mirrors the lessons sidebar (border-side, surface bg, navbar-offset
// transition). The chat innards inside `<S.Body>` are rendered by the
// shared <Chat> component.

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  background: ${(p) => p.theme.colors.surface};
  border-left: 1px solid ${(p) => p.theme.colors.surfaceBorder};

  ${(p) => p.theme.media.desktop} {
    border-left: none;
  }
`;

// ── Header ────────────────────────────────────────────
// Thin top strip: collapse chevron at the panel's INNER edge (closest to
// lesson content), tertiary eyebrow + optional muted lesson context to
// its right. No avatar, no status badge — they were placeholder noise.

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  flex-shrink: 0;
  min-height: 52px;
`;

export const CollapseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.background};
    color: ${(p) => p.theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  min-width: 0;
  flex: 1;
`;

export const HeaderEyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const HeaderContext = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
`;

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.background};
    color: ${(p) => p.theme.colors.foreground};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

// ── Body ──────────────────────────────────────────────

export const Body = styled.div`
  min-height: 0;
  overflow: hidden;
`;

// ── Empty state for "lesson not yet generated" ────────
//
// Without lesson content the mentor can't deliver real Socratic
// dialogue, so we gate the panel rather than fake usefulness with
// generic prompts. Soft icon, single sentence of guidance, no CTA —
// the user is already on the lesson page where the generate button
// lives, so a duplicate CTA would be noise.

/**
 * Editorial gate, not a generic empty state. Type does the work — small
 * tertiary eyebrow, serif italic heading (a single quoted "promise"),
 * muted body paragraph below. No iconographic rounded square.
 */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem 1.75rem;
  text-align: center;
  gap: 0.875rem;
`;

/** Small ornamental rule above the heading — subtle, editorial. */
export const EmptyRule = styled.span`
  display: block;
  width: 36px;
  height: 1px;
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
  margin-bottom: 0.25rem;
`;

export const EmptyEyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const EmptyHeading = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.2;
  margin: 0;
  max-width: 18ch;
`;

export const EmptyHint = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  margin: 0;
  max-width: 26ch;
`;
