'use client';

import styled, { css, keyframes } from 'styled-components';
import { touchHitArea } from '@/theme';

const backdropFade = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const dialogPop = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const fadeOnly = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  /* The scrim CSS variable is theme-aware (lighter under light, deeper
     under dark) so we no longer need a separate dark-mode override. */
  background: var(--scrim-light);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: ${backdropFade} 0.18s linear;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  ${(p) => p.theme.media.mobile} {
    padding: 0;
    align-items: stretch;
    justify-content: stretch;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Dialog = styled.div`
  /* Per-AXIS gutter vars, not one scalar: the full-bleed mobile branch folds
     the safe-area insets into the padding, and the sticky Header below has to
     cancel the REAL gutter on each axis with a negative margin. */
  --dialog-pad: var(--space-6);
  --dialog-pad-top: var(--dialog-pad);
  --dialog-pad-x: var(--dialog-pad);
  --dialog-pad-bottom: var(--dialog-pad);

  position: relative;
  width: 100%;
  max-width: 440px;
  /* dvh, not vh: on iOS vh is the LARGE viewport — measured 754px against
     100dvh's 714px on iPhone 17 / iOS 26.5 — so 90vh overshot the visible
     area by ~36px with Safari's toolbar shown, and on a 393px-tall landscape
     viewport this cap is what decides whether the submit is reachable.
     (check:mobile R2 only matches the literal 100vh, so 90vh was never
     going to be caught by the gate.) The min() additionally caps the dialog
     to the band the user can actually see, which is what shrinks when the
     software keyboard opens — dvh does not. Pre-measurement the var is
     100dvh, so this is plain 90dvh until ViewportInsetBootstrap reports. */
  max-height: min(90dvh, var(--visual-viewport-height, 90dvh));
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lift);
  overflow-y: auto;
  /* The modal's scroll lock does not actually hold in this app, so stop an
     over-scroll of the dialog from chaining to the landing page behind it. */
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  padding: var(--dialog-pad-top) var(--dialog-pad-x) var(--dialog-pad-bottom);
  gap: var(--space-4);
  animation: ${dialogPop} 0.22s cubic-bezier(0.16, 1, 0.3, 1);

  ${(p) => p.theme.media.mobile} {
    max-width: none;
    max-height: none;
    width: 100vw;
    /* NOT 100dvh. Measured on iPhone 17 / iOS 26.5: with the software
       keyboard raised, 100dvh still resolves to 714px while only 353px is
       visible, so a submit button at the bottom of a 100dvh dialog sits
       361px below the visible area and the dialog's own scrollTop stays 0.
       --visual-viewport-height is the real visible height, published from
       window.visualViewport by ViewportInsetBootstrap; sizing the dialog to
       it makes the internal scroller span exactly what the user can see.
       The 100dvh fallback is what SSR and non-supporting browsers get —
       i.e. today's behaviour, unchanged. */
    height: var(--visual-viewport-height, 100dvh);
    border-radius: 0;
    border: none;
    /* Full-bleed means this dialog owns the screen edges, so it owns the
       insets too — nothing else pads for it (the Backdrop drops its 1rem at
       this breakpoint). env() is 0 in portrait Safari, so this changes
       nothing there; it earns its keep in landscape (59px left/right on a
       notched phone) and in standalone/PWA. Symmetric on the x axis so the
       content stays centred and the sticky header needs one value. */
    --dialog-pad-top: calc(var(--dialog-pad) + var(--safe-area-top));
    --dialog-pad-x: calc(
      var(--dialog-pad) + max(var(--safe-area-left), var(--safe-area-right))
    );
    --dialog-pad-bottom: calc(var(--dialog-pad) + var(--safe-area-bottom));
  }

  /* Short viewports: 24px of padding on all four sides plus 16px gaps is
     what puts "Sign in" 79px past the fold at 852x393 and overflows the
     dialog by 113px at 320x568.
     MUST stay below the media.mobile block: both match a 375x667 phone and
     the two selectors have equal specificity, so source order is what lets
     the smaller compact gutter win and feed the per-axis vars above. */
  ${(p) => p.theme.media.compact} {
    --dialog-pad: var(--space-4);
    gap: var(--space-3);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: ${fadeOnly} 0.12s linear;
  }
`;

/* Applied at two breakpoints — the full-bleed mobile dialog and any short
   viewport — so it is written once. */
const stickyHeader = css`
  position: sticky;
  top: 0;
  z-index: 2;
  /* Cancel the dialog's REAL gutter — which includes the safe-area inset on
     the full-bleed mobile branch — so the header's fill reaches the edges and
     pins flush to the top of the scrollport, with no strip of scrolling
     content visible above or beside it. The per-axis vars are published by
     Dialog, so this stays correct when the compact block shrinks them. */
  margin: calc(var(--dialog-pad-top) * -1) calc(var(--dialog-pad-x) * -1) 0;
  padding: var(--space-3) var(--dialog-pad-x);
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);

  /* The close button is the ONLY dismiss affordance on the full-bleed mobile
     dialog — six sampled backdrop edges all hit the Dialog, and a phone has
     no Esc key — and it was position:static inside the dialog's own scroller,
     i.e. gone after 81px of scroll, which the user is forced to do to reach
     the submit. Pinning the header keeps the escape hatch present for the
     whole of that scroll. */
  ${(p) => p.theme.media.mobile} {
    ${stickyHeader}
  }

  /* Landscape phones get the centred card, not the full-bleed sheet, but the
     dialog is still a 353px-tall internal scroller there. */
  ${(p) => p.theme.media.compact} {
    ${stickyHeader}
  }
`;

export const Wordmark = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.015em;
`;

export const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;

  /* 32x32 painted; grow the HIT area to 44 on coarse pointers without
     touching the visual box. ::after is free here — the button is neither
     overflow-hidden nor already positioned — so touchHitArea is the correct
     mixin (touchMinSize would visibly grow a ghost button sitting on the
     dialog's own top rule). */
  ${touchHitArea}

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
      background: ${(p) => p.theme.colors.tertiaryMuted};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const TabList = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  margin-bottom: var(--space-4);

  ${(p) => p.theme.media.compact} {
    margin-bottom: var(--space-2);
  }
`;

export const Tab = styled.button<{ $active: boolean }>`
  position: relative;
  flex: 1;
  background: transparent;
  border: none;
  padding: var(--space-3) var(--space-2);
  font-size: 0.875rem;
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  color: ${(p) => (p.$active ? p.theme.colors.foreground : p.theme.colors.muted)};
  cursor: pointer;
  transition: color 0.15s;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: ${(p) => (p.$active ? p.theme.colors.accent : 'transparent')};
    transition: background 0.15s;
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  /* Floor the height at 40px rather than letting the padding cut collapse
     the tab: measured at 132x41 already, and this cluster must not make an
     under-44px target smaller. */
  ${(p) => p.theme.media.compact} {
    padding: var(--space-2);
    min-height: 40px;
  }
`;

// Sized by content. The old fixed min-height (480px, tuned for the signup
// form with its password checklist expanded) left ~150px of dead space
// below the form in the common collapsed state; the mild height change on
// tab switch is far less jarring than the permanent void was.
export const FormArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const FormSlot = styled.div<{ $active: boolean }>`
  position: ${(p) => (p.$active ? 'relative' : 'absolute')};
  inset: 0;
  display: ${(p) => (p.$active ? 'flex' : 'none')};
  flex-direction: column;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transition: opacity 0.12s linear;

  /* The shared AuthForm caps itself at 360px for the standalone auth
     pages; inside the dialog that left it narrower than the tabs and
     goal-context line above it (ragged right edge). Full-bleed here —
     the dialog's own padding is the measure. */
  form {
    max-width: none;
  }
`;

export const GoalContext = styled.p`
  margin: var(--space-2) 0 0;
  padding: var(--space-3) var(--space-4);
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);

  em {
    font-family: var(--font-heading-serif, inherit);
    font-style: italic;
    color: ${(p) => p.theme.colors.tertiary};
  }
`;

export const FinePrint = styled.p`
  margin-top: var(--space-3);
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  line-height: 1.5;

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: none;

    ${(p) => p.theme.media.hover} {
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
