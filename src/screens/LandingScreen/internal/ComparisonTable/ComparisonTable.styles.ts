'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--space-20) var(--space-8);
  background: ${(p) => p.theme.colors.surface};
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-12) var(--space-5);
  }
`;

export const Inner = styled(motion.div)`
  width: 100%;
  max-width: 1120px;
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
`;

export const SectionHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

export const Eyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
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

// ── Desktop table ───────────────────────────────────────

export const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;

  ${(p) => p.theme.media.tablet} {
    display: none;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  overflow: hidden;

  th,
  td {
    padding: var(--space-3) var(--space-4);
    text-align: left;
    border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    font-size: 0.875rem;
    line-height: 1.4;
    vertical-align: middle;
  }

  thead th {
    background: ${(p) => p.theme.colors.surface};
    font-weight: 600;
    color: ${(p) => p.theme.colors.foreground};
    font-size: 0.875rem;
    border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }

  /* Strive column: bold accent text on the header is the only differentiator
     here — the solid filled YesPill (vs. outline pills in other columns)
     does the rest of the visual work without bg tint or sash decorations. */
  thead th.strive {
    color: ${(p) => p.theme.colors.accent};
    font-weight: 700;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody td:first-child {
    font-weight: 500;
    color: ${(p) => p.theme.colors.foreground};
    width: 36%;
  }

  tbody tr {
    transition: background 0.12s;
  }

  ${(p) => p.theme.media.hover} {
    tbody tr:hover td {
      background: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.tertiary} 8%, ${p.theme.colors.background})`};
    }
  }
`;

export const RowLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: ${(p) => p.theme.colors.foreground};

  svg {
    color: ${(p) => p.theme.colors.tertiary};
    flex-shrink: 0;
  }
`;

// ── Cell pills ──────────────────────────────────────────

export const YesPill = styled.span<{ $strive?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-pill);
  background: ${(p) =>
    p.$strive
      ? p.theme.colors.accent
      : `color-mix(in oklab, ${p.theme.colors.success} 14%, transparent)`};
  color: ${(p) => (p.$strive ? 'var(--on-accent)' : p.theme.colors.success)};
  border: 1px solid
    ${(p) =>
      p.$strive
        ? p.theme.colors.accent
        : `color-mix(in oklab, ${p.theme.colors.success} 35%, transparent)`};
`;

export const PillCheck = styled.span`
  font-size: 0.6875rem;
  line-height: 1;
  font-weight: 700;
`;

export const NoMark = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.surfaceBorder};
  font-weight: 400;
  letter-spacing: 0;
`;

export const SoftPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: var(--radius-pill);
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.foreground} 5%, transparent)`};
  color: ${(p) => p.theme.colors.muted};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// ── Mobile stacked-card layout ──────────────────────────

export const CardList = styled.div`
  display: none;

  ${(p) => p.theme.media.tablet} {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
`;

export const Card = styled.div<{ $strive?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-5);
  background: ${(p) => p.theme.colors.background};
  /* Strive card differentiation: subtle accent-tinted border only. No
     sash, no shadow, no bg tint — keep mobile cards consistent and let
     the YesPill style do the visual work. */
  border: 1px solid
    ${(p) =>
      p.$strive
        ? `color-mix(in oklab, ${p.theme.colors.accent} 35%, transparent)`
        : p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
`;

export const CardHeader = styled.h3`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  font-size: 0.8125rem;
  padding: 8px 0;
`;

export const CardLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${(p) => p.theme.colors.muted};
  flex: 1;

  svg {
    color: ${(p) => p.theme.colors.tertiary};
    flex-shrink: 0;
  }
`;

export const CardValue = styled.span`
  display: inline-flex;
  align-items: center;
`;
