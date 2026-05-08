import styled from 'styled-components';
import { colorsLib, courseCardInk, pickCourseGradient } from '@/theme';

/**
 * Re-export for the component layer — keeps the existing
 * `S.pickDomainGradient(domain, courseId)` API stable while the data lives
 * in the theme module.
 */
export const pickDomainGradient = pickCourseGradient;

/**
 * Subtle paper-grain via inline SVG turbulence. Alpha-only output (the color
 * matrix zeros every channel except A) so the speckle reads as light/dark
 * variation, never coloured noise.
 */
const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/**
 * Whole card is the gradient. Content sits on top with white/alpha hierarchy:
 * - Title  white-95
 * - Meta   white-55 uppercase tracked
 * - Progress track white-15, fill white-85
 * - Domain mark white-82
 * - Initial white-18 (watermark)
 * Hover lifts the initial + adds a subtle warm border halo.
 */
export const Container = styled.button<{ $gradient: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 220px;
  padding: 1.5rem 1.5rem 1.25rem;
  background: ${(p) => p.$gradient};
  border: 1px solid ${courseCardInk.borderRest};
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: ${colorsLib.white};
  isolation: isolate;
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease;

  /* Directional light: highlight top-left, deepen bottom-right. */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      radial-gradient(circle at 22% 18%, ${courseCardInk.litHighlight} 0%, transparent 55%),
      radial-gradient(circle at 88% 92%, ${courseCardInk.litShade} 0%, transparent 60%);
  }

  /* Paper grain for tactility — very low opacity overlay blend. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image: ${GRAIN_SVG};
    background-size: 200px 200px;
    opacity: 0.16;
    mix-blend-mode: overlay;
  }

  /* All children sit above the lighting/grain pseudos. */
  & > * {
    position: relative;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lift);
    border-color: ${courseCardInk.borderHover};
  }

  &:focus-visible {
    outline: 2px solid ${courseCardInk.focusRing};
    outline-offset: 2px;
  }
`;

// ── Top row: domain mark + watermark initial ──────────

export const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

export const DomainMark = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: ${courseCardInk.textSecondary};
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  text-shadow: var(--text-shadow-on-image-soft);

  & svg {
    width: 13px;
    height: 13px;
    stroke-width: 2;
    opacity: 0.92;
  }
`;

/**
 * Editorial mark — serif italic course initial sitting top-right as a
 * quiet watermark. Hover bumps opacity for delight.
 */
export const Initial = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.5rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.025em;
  color: ${courseCardInk.textWatermark};
  user-select: none;
  pointer-events: none;
  margin-top: -0.5rem;
  margin-right: -0.25rem;
  transition: color 220ms ease;

  ${Container}:hover & {
    color: ${courseCardInk.textWatermarkHover};
  }
`;

// ── Bottom region: title + meta + progress ────────────

export const Body = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const Title = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.375rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.2;
  margin: 0;
  color: ${courseCardInk.textPrimary};
  text-shadow: var(--text-shadow-on-image-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  /* Reserve 2 lines so titles of different lengths produce equal card heights. */
  min-height: 3.3rem;
`;

export const Meta = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${courseCardInk.textMuted};
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

export const MetaSep = styled.span`
  width: 3px;
  height: 3px;
  background: currentColor;
  border-radius: 50%;
  opacity: 0.55;
  flex-shrink: 0;
`;

export const Progress = styled.div`
  height: 3px;
  background: ${courseCardInk.progressTrack};
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.125rem;
`;

export const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => Math.max(0, Math.min(100, p.$percent))}%;
  background: ${courseCardInk.progressFill};
  border-radius: 9999px;
  transition: width 320ms ease;
`;
