'use client';

import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

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

export const Inner = styled.div`
  width: 100%;
  max-width: 1120px;
  display: flex;
  flex-direction: column;
  /* Section header → first step gap and step → step gap. 48px keeps the
     beats visually distinct without dropping isolation between them. */
  gap: var(--space-12);

  ${(p) => p.theme.media.tabletLarge} {
    gap: var(--space-10);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  text-align: center;
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

export const Step = styled(motion.div)<{ $reverse: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: center;

  ${(p) =>
    p.$reverse &&
    `
    > div:first-child { order: 2; }
    > div:last-child { order: 1; }
  `}

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: 1fr;
    gap: var(--space-5);

    > div:first-child,
    > div:last-child {
      order: initial;
    }
  }
`;

export const StepCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

export const StepNumber = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const StepTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(1.375rem, 2.5vw, 1.75rem);
  letter-spacing: -0.015em;
  line-height: 1.2;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const StepBody = styled.p`
  font-size: 1rem;
  line-height: 1.65;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  max-width: 50ch;
`;

export const StepVisual = styled.div`
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-height: 260px;
`;

export const VisualEyebrow = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const Chip = styled.span<{ $active?: boolean }>`
  padding: 4px 10px;
  font-size: 0.75rem;
  border-radius: var(--radius-pill);
  border: 1px solid
    ${(p) => (p.$active ? p.theme.colors.accent : p.theme.colors.surfaceBorder)};
  background: ${(p) => (p.$active ? p.theme.colors.accentMuted : p.theme.colors.surface)};
  color: ${(p) => (p.$active ? p.theme.colors.accent : p.theme.colors.muted)};
`;

export const InputMock = styled.div`
  padding: var(--space-3);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const StreamLine = styled.div<{ $w?: string; $accent?: boolean }>`
  width: ${(p) => p.$w ?? '100%'};
  height: 8px;
  border-radius: 3px;
  background: ${(p) =>
    p.$accent
      ? `color-mix(in oklab, ${p.theme.colors.tertiary} 35%, ${p.theme.colors.surfaceBorder})`
      : p.theme.colors.surfaceBorder};
`;

const previewBlink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

export const LessonPreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

export const LessonPreviewTitle = styled.div`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: ${(p) => p.theme.colors.foreground};
  margin-bottom: var(--space-1);
`;

export const LessonPreviewHeading = styled.h5`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 500;
  font-size: 0.9375rem;
  letter-spacing: -0.005em;
  margin: var(--space-2) 0 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const LessonPreviewProse = styled.p`
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;

  em {
    font-family: ui-monospace, SFMono-Regular, 'Geist Mono', monospace;
    font-style: normal;
    font-size: 0.85em;
    color: ${(p) => p.theme.colors.tertiary};
    background: ${(p) => p.theme.colors.tertiaryMuted};
    padding: 1px 5px;
    border-radius: var(--radius-sm);
  }
`;

export const PreviewCaret = styled.span`
  display: inline-block;
  width: 1px;
  height: 13px;
  background: ${(p) => p.theme.colors.foreground};
  margin-left: 3px;
  vertical-align: text-bottom;
  animation: ${previewBlink} 1s steps(1) infinite;
`;

export const RecallVisual = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

export const RecallCard = styled.div`
  padding: var(--space-4);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  box-shadow: var(--shadow-card);
`;

export const MasteryBadge = styled.span`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-pill);
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.success} 15%, transparent)`};
  color: ${(p) => p.theme.colors.success};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.success};
  }
`;
