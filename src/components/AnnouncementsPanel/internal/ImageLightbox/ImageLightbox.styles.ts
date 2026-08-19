import { motion } from 'framer-motion';
import styled from 'styled-components';
import { touchHitArea } from '@/theme';

/**
 * Sits above the announcements panel (61) and its scrim (60), and below the
 * app's modal layer (100/101) — an announcement image must never cover a real
 * modal.
 */
export const Scrim = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 10, 9, 0.82);
  /* Backdrop blur is what makes the dim read as depth rather than as a flat
     grey sheet over the page. */
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  /* Insets keep the frame clear of a notch, a home indicator and the rounded
     corners of a landscape phone. */
  padding:
    max(1.5rem, var(--safe-area-top))
    max(1.5rem, var(--safe-area-right))
    max(1.5rem, var(--safe-area-bottom))
    max(1.5rem, var(--safe-area-left));
`;

/*
 * DEFINITE width, deliberately — `max-width` alone did not work.
 *
 * With `max-width` the figure was a flex item sized by intrinsic negotiation,
 * and the widest thing it could measure was the caption's `max-width: 60ch`.
 * Measured in the browser at a 1728px viewport: the figure came out 492px and
 * the image 286px, from a 1000px source. The close button, anchored to the
 * figure, then floated in space well to the right of the picture.
 *
 * Giving the figure a definite width makes the image the thing that sets the
 * size and puts the button back on its corner.
 */
export const Frame = styled(motion.figure)`
  position: relative;
  margin: 0;
  width: min(960px, 100%);
  max-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
`;

export const Stage = styled.div`
  width: 100%;
  min-height: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: ${(p) => p.theme.colors.surface};
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  line-height: 0;

  img {
    display: block;
    width: 100%;
    height: auto;
    /* Safety net for a tall image on a short screen. dvh, not vh: on iOS
       Safari the URL bar makes vh taller than what is actually visible, so vh
       would push the caption off the bottom of the screen. The reserve covers
       the caption, the gap and the scrim's padding.
       (No backticks inside a styled template — they terminate it.) */
    max-height: calc(100dvh - 9rem);
    object-fit: contain;
  }
`;

export const Caption = styled.figcaption`
  flex-shrink: 0;
  max-width: 60ch;
  text-align: center;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
`;

export const CloseButton = styled.button`
  position: absolute;
  top: -0.75rem;
  right: -0.75rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(20, 18, 16, 0.88);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition:
    background 160ms ease,
    transform 120ms ease;

  svg {
    width: 17px;
    height: 17px;
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: rgba(40, 36, 32, 0.95);
    }
  }

  &:active {
    transform: scale(0.94);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.tertiary};
    outline-offset: 2px;
  }

  ${(p) => p.theme.media.tablet} {
    /* On a narrow screen the frame reaches the padding, so an outset button
       would sit under the safe-area inset. Tuck it inside instead. */
    top: 0.5rem;
    right: 0.5rem;
  }

  ${touchHitArea}
`;
