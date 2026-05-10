import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, -46%); }
  to   { opacity: 1; transform: translate(-50%, -50%); }
`;

/* Medal lands with a slight overshoot — the cubic-bezier(0.34, 1.56, 0.64, 1)
   springs past 1.0 before settling. Shorter than 600 ms so the check inside
   has room to draw before the animation feels stale. */
const medalIn = keyframes`
  0%   { opacity: 0; transform: scale(0.55); }
  60%  { opacity: 1; transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); }
`;

/* Warm gold bloom emanating outward, single iteration. Anchors the moment
   visually before the checkmark draws. */
const haloOut = keyframes`
  0%   { opacity: 0;    transform: scale(0.6); }
  35%  { opacity: 0.55; }
  100% { opacity: 0;    transform: scale(1.6); }
`;

/* SVG stroke draw — `pathLength={100}` on the path normalises the dash math. */
const checkDraw = keyframes`
  from { stroke-dashoffset: 100; }
  to   { stroke-dashoffset: 0; }
`;

/* Tiny tertiary dots drifting up around the medal — staggered per-instance
   below. Reads as celebration without screaming. */
const sparkleRise = keyframes`
  0%   { opacity: 0; transform: translateY(0)     scale(0.6); }
  30%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-26px) scale(1); }
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
  max-width: 420px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 14px;
  padding: 1.875rem 1.5rem 1.375rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  box-shadow: var(--shadow-modal-lg);
  animation: ${slideUp} 0.22s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  background: transparent;
  border: none;
  color: ${(p) => p.theme.colors.muted};
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;

  &:hover {
    background: ${(p) => p.theme.colors.background};
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.625rem;
  padding: 0 0.5rem;
`;

/* Stage — anchors halo + sparkles + medal absolutely so they share the
   same centre. 80px gives the sparkles room to drift past the medal edge. */
export const MedalWrap = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0.25rem auto 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Halo = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 45%, transparent)`} 0%,
    transparent 65%
  );
  animation: ${haloOut} 1.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0;
  }
`;

export const Medal = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.success} 12%, ${p.theme.colors.surface})`};
  border: 1.5px solid
    ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 70%, transparent)`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.success};
  box-shadow: var(--shadow-card);
  animation: ${medalIn} 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const CheckSvg = styled.svg`
  width: 30px;
  height: 30px;

  & path {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: ${checkDraw} 0.34s cubic-bezier(0.16, 1, 0.3, 1) 0.28s forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    & path {
      animation: none;
      stroke-dashoffset: 0;
    }
  }
`;

const sparkleVariants = [
  css`
    top: 28px;
    left: 6px;
    animation-delay: 0.18s;
  `,
  css`
    top: 22px;
    right: 4px;
    animation-delay: 0.32s;
  `,
  css`
    top: 46px;
    right: 14px;
    width: 4px;
    height: 4px;
    animation-delay: 0.5s;
  `,
];

export const Sparkle = styled.span<{ $i: 0 | 1 | 2 }>`
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.tertiary};
  pointer-events: none;
  opacity: 0;
  animation: ${sparkleRise} 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  ${(p) => sparkleVariants[p.$i]}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0;
  }
`;

export const Eyebrow = styled.span`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const Title = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.625rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.015em;
  margin: 0;
  line-height: 1.15;
`;

export const Lede = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.55;
  margin: 0;
  max-width: 36ch;

  strong {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

/* Editorial micro-stat pill — italic-serif value (matches the BillingPanel
   balance treatment) sits inside a hairline rounded chip. Used to surface
   the freshly-confirmed balance / plan tier. */
export const Stat = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0.125rem 0 0;
  padding: 0.5rem 1.125rem;
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.background};
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};

  strong {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-style: italic;
    font-weight: 500;
    font-size: 1.25rem;
    line-height: 1;
    letter-spacing: -0.02em;
    color: ${(p) => p.theme.colors.foreground};
    font-variant-numeric: tabular-nums;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.25rem;
`;
