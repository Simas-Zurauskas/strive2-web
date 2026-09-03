import styled from 'styled-components';
import { onAccent } from '@/theme';

// ── Fixed root anchor ──────────────────────────────────────
//
// Sits at the bottom-right of the viewport, above page content. Both the
// FAB and the expanded widget anchor to this same corner, so framer's
// scale + opacity transition reads as a smooth bloom out of the FAB.

export const Root = styled.div`
  position: fixed;
  right: max(1.5rem, var(--safe-area-right));
  /* Lift clear of the cookie banner while it is up. The banner is z-index 100
     and this Root is 60, so without the offset the FAB is not merely covered
     but unclickable — the 005 sweep measured it fully underneath at both
     375x667 and 320x568 (fabBlocked=true). The var is 0px once a choice has
     been made, which is every session after the first. */
  bottom: calc(max(1.5rem, var(--safe-area-bottom)) + var(--cookie-banner-height, 0px));
  z-index: 60;
  pointer-events: none;

  /* Stand down while the help-centre search dropdown is open. The listbox
     sits at z-index 20 so it can pass under the sticky header, which leaves
     this FAB painting over its lower rows — measured stealing the tap on the
     second result. Set by KbSearchBar while results are showing. */
  html[data-kb-search-open='true'] & {
    opacity: 0;
    visibility: hidden;
  }

  ${(p) => p.theme.media.tablet} {
    right: max(1rem, var(--safe-area-right));
    bottom: calc(max(1rem, var(--safe-area-bottom)) + var(--cookie-banner-height, 0px));
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

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.accentHover};
      box-shadow: var(--shadow-panel-hover);
      transform: translateY(-1px);
    }
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
  /* Height must also reserve the sticky top bar, not just the bottom margin.
     Root is bottom-anchored, so height is the only lever on the panel's TOP
     edge: with calc(100dvh - 3rem) against a 1.5rem bottom offset the top
     landed at a constant 24px on every viewport shorter than 688px — i.e.
     under the 57px bar. Measured at 852x393 on /help: widget 448,24
     380x345, and elementFromPoint at every nav control returned the chat
     header, so Blog / Pricing / Sign in (signed-out) and the allowance pill
     / announcements / account button (signed-in) were all dead. The panel is
     non-modal — no backdrop, no scroll lock — so the user gets no cue. Each
     max() mirrors the bottom offset Root actually uses at that breakpoint,
     so the arithmetic stays right when --safe-area-bottom is non-zero
     (iPhone landscape home indicator). The extra 0.5rem is the visible gap
     under the bar. The mobile branch's 5rem was already doing this by
     hand. */
  height: min(
    640px,
    calc(
      100dvh - max(1.5rem, var(--safe-area-bottom)) - var(--navbar-offset, 56px) -
        0.5rem
    )
  );
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
    height: min(
      620px,
      calc(
        100dvh - max(1rem, var(--safe-area-bottom)) - var(--navbar-offset, 56px) -
          0.5rem
      )
    );
  }

  ${(p) => p.theme.media.mobile} {
    width: calc(100vw - 1.5rem);
    height: calc(
      100dvh - max(1rem, var(--safe-area-bottom)) - var(--navbar-offset, 56px) -
        0.5rem
    );
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

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.tertiaryMuted};
      color: ${(p) => p.theme.colors.foreground};
    }
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

