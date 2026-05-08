'use client';

import styled, { keyframes } from 'styled-components';

/* Top-up bar — horizontal capacity pill that fills, holds at full,
 * then snaps back. Lifted verbatim from variant 2 of the picker
 * gallery. Flat tertiary fill, surfaceBorder track outline,
 * cubic-bezier(0.16, 1, 0.3, 1) easing. No labels. */

const capacitySweep = keyframes`
  0%, 4%   { width: 0%; }
  60%      { width: 100%; }
  82%      { width: 100%; }
  92%      { width: 0%; opacity: 0.5; }
  100%     { width: 0%; opacity: 1; }
`;

const Track = styled.div`
  position: relative;
  width: 132px;
  height: 8px;
  border-radius: 999px;
  border: 1.5px solid
    ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 38%, transparent)`};
  background: ${(p) => p.theme.colors.surface};
  overflow: hidden;
  margin: 0 auto 0.125rem;
`;

const Fill = styled.span`
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: -1px;
  width: 0;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.tertiary};
  animation: ${capacitySweep} 3.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    width: 100%;
  }
`;

export const TopupBar = () => (
  <Track aria-hidden="true">
    <Fill />
  </Track>
);
