'use client';

import styled from 'styled-components';
import { touchMinHeightCentered } from '@/theme';
import { MEASURE } from '../_system/section';

export const Bar = styled.header<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 30;
  width: 100%;
  /* Status-bar avoidance in standalone/PWA: the app ships viewport-fit=cover
     and manifest display: standalone, so a hard 56px bar renders under the
     ~59px status bar there. env() is 0 in a browser tab, so this is inert
     everywhere the sweep measured. */
  height: calc(var(--navbar-offset) + var(--safe-area-top));
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) =>
    p.$scrolled
      ? `color-mix(in oklab, ${p.theme.colors.background} 88%, transparent)`
      : p.theme.colors.background};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid
    ${(p) => (p.$scrolled ? p.theme.colors.surfaceBorder : 'transparent')};
  transition: border-color 0.2s, background 0.2s;

  /* The gutter moved here from Inner so the bar sits on the same axis as the
     page's sections: outer element carries the gutter, inner container is a
     bare measure. Before this, the wordmark sat at 192px while section content
     sat at 160px — a 32px misalignment between the page and its own chrome,
     visible the moment you looked for it. */
  padding: var(--safe-area-top) var(--space-8) 0;

  ${(p) => p.theme.media.tabletLarge} {
    /* The inset rides inside the shorthand in BOTH blocks: this one
       re-declares the padding shorthand, so a padding-top longhand would
       evaporate above 768px. */
    padding: var(--safe-area-top) var(--space-5) 0;
  }
`;

export const Inner = styled.div`
  width: 100%;
  max-width: ${MEASURE};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Wordmark = styled.a`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.015em;
  color: ${(p) => p.theme.colors.foreground};
  /* Optical baseline correction. "Strive" has no descenders, so its ink
     (cap-height → baseline) rides ~2.3px above the centre of its own line
     box while the nav links' lowercase mass sits dead on it — measured
     via canvas actualBoundingBox against the bar's midline (011-landing,
     Simas: "v spacing uneven"). Box-centering was already exact; this is
     ink-centering. */
  transform: translateY(2px);

  /* Measured 48x32 on the sweep — the mixin blockifies and re-centres so the
     grown box and the visible ink still coincide. The optical translateY
     above survives it (the mixin sets display/align-items/min-block-size
     only). */
  ${touchMinHeightCentered}

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;

export const NavLinks = styled.nav`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
`;

export const PricingLink = styled.a`
  padding: var(--space-2) var(--space-3);
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  border-radius: var(--radius-md);
  transition: color 0.15s, background 0.15s;

  /* Gated: an ungated :hover sticks after a touch tap, which is the house
     invariant this rule was missing (AUDIT flagged it). */
  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  /* Measured 38.4px / 33px tall — under the 44px touch minimum. */
  ${touchMinHeightCentered}
`;

export const SignInLink = styled.button`
  background: transparent;
  border: none;
  padding: var(--space-2) var(--space-3);
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: color 0.15s, background 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.accent};
      background: ${(p) => p.theme.colors.accentMuted};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  /* Measured 38.4px / 33px tall — under the 44px touch minimum. */
  ${touchMinHeightCentered}
`;
