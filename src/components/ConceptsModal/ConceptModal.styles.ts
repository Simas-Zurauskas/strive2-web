import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, -46%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: var(--scrim-light);
  backdrop-filter: blur(2px);
  z-index: 100;
  animation: ${fadeIn} 0.15s ease-out;
`;

export const Dialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  width: 92%;
  max-width: 640px;
  /* Sized against the VISUAL viewport, not the layout viewport.
     dvh tracks Safari's URL bar but not the software keyboard, and on a tall
     device (440x956) Safari's chrome eats ~165pt that dvh still counts. When
     the content was longer than the visible area but shorter than the
     dvh-sized dialog, Content's overflow-y had nothing to scroll and the
     footer holding GOT IT simply sat below the visible fold, unreachable at
     any scroll offset — measured on an iPhone 16 Pro Max.
     --visual-viewport-height is published by ViewportInsetBootstrap and falls
     back to 100dvh where window.visualViewport is unavailable. */
  max-height: min(calc(100dvh - 3rem), calc(var(--visual-viewport-height, 100dvh) - 3rem));
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-modal);
  animation: ${slideUp} 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  /* Home-indicator avoidance. env() is 0 on devices without a cutout, so
     desktop and non-notched rendering is unchanged. */
  padding-bottom: var(--safe-area-bottom);

  /* Landscape phones (852x393 and friends). calc(100dvh - 3rem) resolves to
     345px there, and the 340px AnimationSlot (flex-shrink: 0, width-keyed
     media query only) consumes it: Content collapsed to its own 44px of
     padding and the Footer was laid out at y 409-488 — below the dialog
     (369) and below the viewport (393), so "Got it" was unreachable.

     Shrinking the slot instead was measured and rejected: at 42dvh (238px on
     320x568) five of the sixteen animations start overflowing their slot, and
     a cropped illustration reads as broken. So on short viewports the dialog
     becomes ONE scroll region with the CloseBtn and the Footer pinned to its
     edges — the illustration stays intact and both dismiss affordances stay
     on screen at every scroll offset. */
  @media (max-width: 520px) {
    max-height: min(calc(100dvh - 2rem), calc(var(--visual-viewport-height, 100dvh) - 2rem));
  }

  @media (max-height: 500px) {
    max-height: min(calc(100dvh - 1.5rem), calc(var(--visual-viewport-height, 100dvh) - 1.5rem));
    overflow: hidden auto;
    overscroll-behavior: contain;
    /* A sticky child sticks to the scrollport's padding box, so the
       home-indicator inset has to move onto the Footer to be honoured. */
    padding-bottom: 0;
  }
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.muted};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: color 0.15s, background 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
      background: ${(p) => p.theme.colors.background};
    }
  }

  /* 28x28 visual, 44x44 hit area on touch. Deliberately NOT the shared
     touchHitArea mixin from @/theme: that mixin sets position: relative,
     which would unpin this button from the dialog corner — its own
     precondition 3 rules it out for already-positioned hosts. This button is
     already a containing block for its own ::after, and it is not
     overflow: hidden, so a plain inset overlay is correct here. */
  ${(p) => p.theme.media.touch} {
    &::after {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: inherit;
    }
  }

  /* Landscape: the Dialog itself is the scroller now, and an
     absolutely-positioned child scrolls away with its content (measured:
     the button's top went from y 23 to y -312 at full scroll). Sticky keeps
     it pinned. top: 0.625rem from the base rule is the sticky offset; the
     negative bottom margin cancels the button's own contribution to the
     flex column's height so AnimationSlot still starts at the dialog edge
     (measured: slot top unchanged at dialog top + 1px border). -38px is
     28px of button plus its 10px top margin — it moves if the button is
     ever resized. */
  @media (max-height: 500px) {
    position: sticky;
    right: auto;
    align-self: flex-end;
    margin: 0.625rem 0.625rem -38px auto;
    flex: 0 0 auto;
  }
`;

export const AnimationSlot = styled.div`
  position: relative;
  width: 100%;
  height: 340px;
  background: ${(p) => p.theme.colors.tertiaryMuted};
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* An animation that outgrows the slot used to paint straight over the
     Content eyebrow below it (ModulesLessonsAnimation's RightCard did, by
     26px). Dialog's own overflow: hidden only clips at the dialog edge,
     not at the slot boundary. Measured overflow at 320x568 before the
     structural fixes below: spaced-recall 31.7px, goal-types 19.5px; the
     other fourteen are clean. */
  overflow: hidden;
  padding: 1.5rem 1.75rem;

  @media (max-width: 520px) {
    height: 280px;
    padding: 1rem 1.125rem;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 1.75rem 1.25rem;
  overflow-y: auto;
  /* Own the dialog's leftover height explicitly, and be allowed to shrink
     past content: without min-height: 0 a flex item's automatic minimum
     size fights the dialog's max-height. */
  flex: 1 1 auto;
  min-height: 0;

  @media (max-width: 520px) {
    padding: 1.25rem 1.25rem 1rem;
  }

  /* Landscape: the Dialog is the scroller. A nested scroller here would
     trap the gesture in a ~100px window. */
  @media (max-height: 500px) {
    flex: 0 0 auto;
    overflow: visible;
  }
`;

export const Eyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const Title = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.015em;
  margin: 0;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Paragraph = styled.p`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.75rem 1.25rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  flex-wrap: wrap;
  flex-shrink: 0;
  /* Opaque so content can scroll underneath when this is sticky (landscape).
     Same token as Dialog's own background, so nothing changes elsewhere. */
  background: ${(p) => p.theme.colors.surface};

  /* 6px trimmed off the phone padding (77px footer -> 71px), which together
     with Dialog's 24px -> 16px outer margin buys the 320x568 reading window
     back from 161px to 185px — the S3-10 fix. */
  @media (max-width: 520px) {
    padding: 0.75rem 1.25rem 0.875rem;
  }

  /* Landscape: pinned to the bottom of the scrolling dialog so "Got it" is
     reachable at every scroll offset. Carries the home-indicator inset,
     which moved off Dialog's padding-bottom (a sticky child would have sat
     inside it). */
  @media (max-height: 500px) {
    position: sticky;
    bottom: 0;
    padding: 0.625rem 1.75rem calc(0.75rem + var(--safe-area-bottom));
  }
`;
