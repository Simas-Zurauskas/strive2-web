'use client';

import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  /* Shallow content (heading + tier grid + body + link) — tighter padding
     to avoid stranding the small content in empty space. */
  padding: var(--space-16) var(--space-8);

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-10) var(--space-5);
  }
`;

export const Inner = styled(motion.div)`
  max-width: 720px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  text-align: center;
  align-items: center;
`;

export const Heading = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 700;
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

// ── Tier grid (loaded state) ────────────────────────────

export const TierGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  margin-top: var(--space-3);

  ${(p) => p.theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const TierCard = styled.div<{ $popular?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-6) var(--space-4) var(--space-5);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid
    ${(p) =>
      p.$popular
        ? `color-mix(in oklab, ${p.theme.colors.accent} 35%, transparent)`
        : p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;

  ${(p) =>
    p.$popular &&
    `
    background: ${p.theme.colors.accentMuted};
    box-shadow: var(--shadow-card);
  `}

  &:hover {
    border-color: ${(p) =>
      p.$popular
        ? `color-mix(in oklab, ${p.theme.colors.accent} 50%, transparent)`
        : `color-mix(in oklab, ${p.theme.colors.tertiary} 35%, ${p.theme.colors.surfaceBorder})`};
    box-shadow: var(--shadow-card);
    transform: translateY(-1px);
  }
`;

export const PopularBadge = styled.span`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 10px;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--on-accent);
  background: ${(p) => p.theme.colors.accent};
  border-radius: var(--radius-pill);
  white-space: nowrap;
`;

export const TierName = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const TierPrice = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.1;
`;

export const TierAllowance = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.4;
  margin-top: 2px;
`;

// Per-tier plain-language translation of the allowance count (e.g.
// "≈ 4–5 lessons"). Sits between the dry "X allowances / month" line and
// the brand tagline. Same muted token; the `≈` prefix carries the
// "approximate" semantic without italics.
export const TierGuidance = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.45;
  margin-top: 4px;
  max-width: 28ch;
  text-align: center;
`;

export const TierTagline = styled.p`
  font-size: 0.875rem;
  line-height: 1.45;
  color: ${(p) => p.theme.colors.foreground};
  opacity: 0.85;
  margin: var(--space-3) 0 0;
  max-width: 28ch;
`;

// Pushes the CTA to the bottom edge of the card so both anchor cards have
// aligned button rows even when taglines wrap to different heights.
export const CtaSlot = styled.div`
  width: 100%;
  margin-top: auto;
  padding-top: var(--space-4);

  & > button,
  & > a {
    width: 100%;
  }
`;

// ── Skeleton primitive (loading state) ──────────────────
// Used inside the same <TierGrid> + <TierCard> wrappers as the real cards
// so that swapping skeleton → real causes zero width or height shift. The
// pulse animation matches the HomeScreen + PricingScreen skeleton language
// for cross-page consistency.

const skeletonPulse = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
`;

export const SkBlock = styled.span<{ $w?: string; $h?: string; $radius?: string }>`
  display: block;
  width: ${(p) => p.$w ?? '100%'};
  height: ${(p) => p.$h ?? '0.875rem'};
  background: ${(p) => p.theme.colors.surfaceBorder};
  border-radius: ${(p) => p.$radius ?? 'var(--radius-sm)'};
  animation: ${skeletonPulse} 1.6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ── Body + CTA ──────────────────────────────────────────

export const Body = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  max-width: 50ch;
`;

export const CtaLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.accent};
  margin-top: var(--space-2);

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;
