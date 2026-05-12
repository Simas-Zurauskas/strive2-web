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
  /* Safety net so a runaway child can't push the panel wider than the
     viewport. min-width: 0 lets nested flex children honor their own
     wrap/ellipsis rules. */
  overflow: hidden;
  min-width: 0;
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

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.background};
      color: ${(p) => p.theme.colors.foreground};
    }
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
  line-height: 1.35;
  /* Wrap rather than truncate. Long lesson titles read better on two
     lines than disappearing into ellipsis. Hard-capped at 2 lines so
     a very long title can't push the chat body down indefinitely. */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  overflow-wrap: anywhere;
  word-break: break-word;
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

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      background: ${(p) => p.theme.colors.background};
      color: ${(p) => p.theme.colors.foreground};
    }
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

// ── Overflow menu (replaces the bare-trash header button) ───
// Destructive "Clear chat history" now lives behind a kebab `⋮` so
// the header reads as pure navigation/utility and accidental wipes
// take an extra click. The popover anchors to the trigger so it
// stays inside the panel even when the panel sits at the right
// edge of the viewport.

export const HeaderMenuRoot = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const HeaderMenuTrigger = styled.button`
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
  transition:
    background 0.15s,
    color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      background: ${(p) => p.theme.colors.background};
      color: ${(p) => p.theme.colors.foreground};
    }
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

/**
 * Rendered via React portal at document.body, so the popover escapes
 * the chat-panel header's `overflow: hidden`. Position is set inline
 * by the trigger's bounding rect (top, right) — `position: fixed` so
 * it stays anchored to the viewport, not to any ancestor scroll
 * context. z-index sits above the chat panel's `z-index: 30/40`.
 */
export const HeaderMenuPopover = styled.div`
  position: fixed;
  z-index: 60;
  min-width: 12rem;
  padding: 0.3125rem;
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  box-shadow:
    0 8px 24px -8px rgba(0, 0, 0, 0.18),
    0 2px 6px -2px rgba(0, 0, 0, 0.08);
`;

export const HeaderMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.625rem;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  font-size: 0.8125rem;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.12s,
    color 0.12s;

  & svg {
    flex-shrink: 0;
    opacity: 0.75;
  }

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      background: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.error} 8%, transparent)`};
      color: ${(p) => p.theme.colors.error};
    }
  }

  &:focus-visible {
    outline: none;
    background: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.error} 8%, transparent)`};
    color: ${(p) => p.theme.colors.error};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
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
