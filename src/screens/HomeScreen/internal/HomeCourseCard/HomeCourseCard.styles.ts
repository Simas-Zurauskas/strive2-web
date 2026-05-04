import styled from 'styled-components';
import type { CourseDomain } from '@/api/types';

/**
 * Three muted gradient variants per domain. Stays in family: same hue tilt,
 * slight depth/temperature shift between variants. A stable hash of the
 * courseId picks one so two cards in the same domain never look identical.
 */
const domainGradients: Record<CourseDomain, [string, string, string]> = {
  programming: [
    'linear-gradient(135deg, #2a4d52 0%, #173036 100%)',
    'linear-gradient(140deg, #234952 0%, #122d36 100%)',
    'linear-gradient(130deg, #305a5e 0%, #1a373a 100%)',
  ],
  stem: [
    'linear-gradient(135deg, #2f5d62 0%, #1a3c43 100%)',
    'linear-gradient(140deg, #2a5660 0%, #14373d 100%)',
    'linear-gradient(130deg, #3a6a6c 0%, #1d4146 100%)',
  ],
  humanities: [
    'linear-gradient(135deg, #2d3142 0%, #1a1d2c 100%)',
    'linear-gradient(140deg, #34384a 0%, #1f2434 100%)',
    'linear-gradient(130deg, #3a3d52 0%, #232739 100%)',
  ],
  language: [
    'linear-gradient(135deg, #5a3f5e 0%, #3a253d 100%)',
    'linear-gradient(140deg, #533558 0%, #34203a 100%)',
    'linear-gradient(130deg, #674768 0%, #422a47 100%)',
  ],
  creative: [
    'linear-gradient(135deg, #96793e 0%, #6a5526 100%)',
    'linear-gradient(140deg, #8c6f37 0%, #5e4a1e 100%)',
    'linear-gradient(130deg, #a18445 0%, #74602e 100%)',
  ],
  business: [
    'linear-gradient(135deg, #2c5545 0%, #1a3a2e 100%)',
    'linear-gradient(140deg, #28503f 0%, #173626 100%)',
    'linear-gradient(130deg, #355e4e 0%, #1f4234 100%)',
  ],
  practical: [
    'linear-gradient(135deg, #8a4f3a 0%, #5a3122 100%)',
    'linear-gradient(140deg, #7e4632 0%, #532c1d 100%)',
    'linear-gradient(130deg, #955644 0%, #623729 100%)',
  ],
  'practical-ai': [
    'linear-gradient(135deg, #1f3a5a 0%, #0f2440 100%)',
    'linear-gradient(140deg, #1b3454 0%, #0c2038 100%)',
    'linear-gradient(130deg, #294263 0%, #142a48 100%)',
  ],
  'life-skills': [
    'linear-gradient(135deg, #6b4a30 0%, #432c1d 100%)',
    'linear-gradient(140deg, #604229 0%, #3c2718 100%)',
    'linear-gradient(130deg, #785538 0%, #4d3422 100%)',
  ],
  other: [
    'linear-gradient(135deg, #2c5545 0%, #1e3d31 100%)',
    'linear-gradient(140deg, #305b48 0%, #213f33 100%)',
    'linear-gradient(130deg, #345e4c 0%, #244236 100%)',
  ],
};

export const pickDomainGradient = (
  domain: CourseDomain | null | undefined,
  courseId: string,
): string => {
  const variants = domainGradients[domain ?? 'other'];
  let h = 0;
  for (let i = 0; i < courseId.length; i++) {
    h = ((h << 5) - h + courseId.charCodeAt(i)) | 0;
  }
  return variants[Math.abs(h) % variants.length];
};

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
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: #ffffff;
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
      radial-gradient(circle at 22% 18%, rgba(255, 255, 255, 0.18) 0%, transparent 55%),
      radial-gradient(circle at 88% 92%, rgba(0, 0, 0, 0.28) 0%, transparent 60%);
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
    border-color: rgba(255, 255, 255, 0.14);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.85);
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
  color: rgba(255, 255, 255, 0.82);
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);

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
  color: rgba(255, 255, 255, 0.18);
  user-select: none;
  pointer-events: none;
  margin-top: -0.5rem;
  margin-right: -0.25rem;
  transition: color 220ms ease;

  ${Container}:hover & {
    color: rgba(255, 255, 255, 0.28);
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
  color: rgba(255, 255, 255, 0.96);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
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
  color: rgba(255, 255, 255, 0.55);
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
  background: rgba(255, 255, 255, 0.14);
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.125rem;
`;

export const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => Math.max(0, Math.min(100, p.$percent))}%;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 9999px;
  transition: width 320ms ease;
`;
