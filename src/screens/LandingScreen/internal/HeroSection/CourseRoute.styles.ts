'use client';

import styled, { css, keyframes } from 'styled-components';

/* The trail draws top→bottom once on mount; waypoints surface after the
   trail has passed them. All pure CSS so it runs pre-hydration and costs
   nothing afterwards. Reduced-motion renders everything settled. */

const drawTrail = keyframes`
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
`;

const surface = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const Frame = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
`;

export const SrOnly = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  margin: 0;
`;

export const RouteSvg = styled.svg`
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
`;

/* The dotted trail itself is static — its reveal comes from MaskPath. */
export const Trail = styled.path`
  fill: none;
  stroke: ${(p) => p.theme.colors.tertiary};
  stroke-width: 2;
  stroke-linecap: round;
  /* Dot cadence expressed against pathLength=1 so it survives path edits. */
  stroke-dasharray: 0.0035 0.014;
`;

/* Solid white twin of the trail, used as a mask: ITS dashoffset draw
   (possible because it's a single continuous dash) progressively reveals
   the dotted trail start→summit. Keyed by the active goal in the
   component, so the draw replays on every rotation. */
export const MaskPath = styled.path`
  fill: none;
  stroke: #fff;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  animation: ${drawTrail} 1.1s cubic-bezier(0.45, 0, 0.2, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* Stagger tuned to settle at ~1.2s — inside the trail draw's tail, so the
   whole show fits the rotation budget (~1.3s show, ~4s reading). */
export const WaypointGroup = styled.g<{ $index: number }>`
  ${(p) => css`
    animation: ${surface} 0.35s ease-out both;
    animation-delay: ${0.2 + p.$index * 0.16}s;
  `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const StartDot = styled.circle`
  fill: ${(p) => p.theme.colors.foreground};
`;

export const StartLabel = styled.text`
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.16em;
  fill: ${(p) => p.theme.colors.muted};
`;

export const WaypointRing = styled.circle`
  fill: ${(p) => p.theme.colors.surface};
  stroke: ${(p) => p.theme.colors.accent};
  stroke-width: 1.5;
`;

export const WaypointCore = styled.circle`
  fill: ${(p) => p.theme.colors.accent};
`;

export const WaypointIndex = styled.text`
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  fill: ${(p) => p.theme.colors.tertiaryText};
`;

export const WaypointLabel = styled.text`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 15px;
  fill: ${(p) => p.theme.colors.foreground};
  /* Keyed by content — quick fade when the rotating goal swaps routes. */
  animation: ${surface} 0.3s ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const SummitMast = styled.line`
  stroke: ${(p) => p.theme.colors.foreground};
  stroke-width: 1.5;
  stroke-linecap: round;
`;

export const SummitFlag = styled.polygon`
  fill: ${(p) => p.theme.colors.tertiary};
`;

export const SummitBase = styled.circle`
  fill: ${(p) => p.theme.colors.foreground};
`;

export const SummitLabel = styled.text`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.01em;
  fill: ${(p) => p.theme.colors.foreground};
  animation: ${surface} 0.3s ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
