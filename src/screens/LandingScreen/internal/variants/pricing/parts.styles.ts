'use client';

import styled, { keyframes } from 'styled-components';

/* Shared loading primitive for the pricing candidates.
   The catalog is authless and cached for the session, so this is normally
   one frame — but it must never be a layout shift, and it must never be a
   guessed number. Same pulse as the shipped teaser's skeleton so the lab
   and production read as one product. */

const pulse = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
`;

export const SkBlock = styled.span<{ $w?: string; $h?: string; $radius?: string }>`
  display: block;
  width: ${(p) => p.$w ?? '100%'};
  height: ${(p) => p.$h ?? '0.875rem'};
  background: ${(p) => p.theme.colors.surfaceBorder};
  border-radius: ${(p) => p.$radius ?? 'var(--radius-sm)'};
  animation: ${pulse} 1.6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* The asterisk on every "≈ N lessons*" estimate has to resolve somewhere.
   One line, set as fine print, in every candidate that shows an estimate. */
export const Footnote = styled.p`
  margin: 0;
  max-width: 62ch;
  font-size: 0.6875rem;
  line-height: 1.5;
  color: ${(p) => `color-mix(in srgb, ${p.theme.colors.muted} 88%, transparent)`};
`;
