'use client';

import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--space-20) var(--space-8);

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-12) var(--space-5);
  }
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1120px;
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
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

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: var(--space-4);

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const Tile = styled(motion.section)<{ $hero: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.15s, transform 0.15s, border-color 0.15s;
  grid-column: ${(p) => (p.$hero ? 'span 2' : 'span 1')};
  grid-row: ${(p) => (p.$hero ? 'span 2' : 'span 1')};
  overflow: hidden;

  ${(p) =>
    p.$hero &&
    `
    border-top: 3px solid ${p.theme.colors.tertiary};
    background: linear-gradient(
      180deg,
      ${p.theme.colors.tertiaryMuted} 0%,
      ${p.theme.colors.surface} 60%
    );
  `}

  &:hover {
    box-shadow: var(--shadow-lift);
  }

  /* At tabletLarge (<=768px) drop the hero size distinction so 6 tiles in
     a 2-col grid land cleanly across 3 rows with no orphan. The gradient
     + tertiary top-border keep the hero visually distinct without size. */
  ${(p) => p.theme.media.tabletLarge} {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
`;

export const TileTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
  line-height: 1.3;

  em {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-style: italic;
    font-weight: 500;
    color: ${(p) => p.theme.colors.tertiary};
  }
`;

export const HeroTileTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 500;
  font-size: clamp(1.5rem, 2.5vw, 1.875rem);
  letter-spacing: -0.015em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
  line-height: 1.2;

  em {
    font-style: italic;
    color: ${(p) => p.theme.colors.tertiary};
  }
`;

export const TileBody = styled.p`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const VisualSlot = styled.div<{ $hero?: boolean }>`
  /* Standard tiles: push visual to the bottom so all tiles align visuals
     to a common baseline. Hero tile: visual sits right under the body
     (auto-margin would create a 150px+ gap inside the 2-row span). */
  margin-top: ${(p) => (p.$hero ? '0' : 'auto')};
  padding-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-height: 0;
`;

// ── Hero-tile inputs chip row (above the tree) ──────────

export const InputsLabel = styled.span`
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const InputChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const InputChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: var(--radius-pill);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  color: ${(p) => p.theme.colors.foreground};
`;

export const ChipDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.tertiary};
`;

export const FlowConnector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  color: ${(p) => p.theme.colors.tertiary};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 600;
  gap: 8px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.tertiary} 25%, transparent)`};
  }
`;

// ── Curriculum-tree visual (hero tile) ──────────────────

export const TreeWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--space-3) var(--space-4);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
`;

export const TreeModule = styled.div<{ $expanded?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.005em;

  &::before {
    content: ${(p) => (p.$expanded ? '"▾"' : '"▸"')};
    font-size: 0.625rem;
    color: ${(p) => p.theme.colors.tertiary};
  }
`;

export const TreeLesson = styled.div`
  margin-left: 18px;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.5;

  &::before {
    content: '·';
    color: ${(p) => p.theme.colors.tertiary};
  }
`;

// ── Streaming-blocks tile ───────────────────────────────

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

export const StreamCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--space-3);
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);
`;

export const StreamEyebrow = styled.span`
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const StreamHeading = styled.div`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.005em;
  line-height: 1.25;
`;

export const StreamProse = styled.p`
  font-size: 0.75rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const StreamCaret = styled.span`
  display: inline-block;
  width: 1px;
  height: 11px;
  background: ${(p) => p.theme.colors.foreground};
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: ${blink} 1s steps(1) infinite;
`;

// ── Code tile ───────────────────────────────────────────

export const CodeCard = styled.div`
  margin: 0;
  padding: var(--space-3);
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.foreground} 96%, ${p.theme.colors.tertiary})`};
  border-radius: var(--radius-md);
  font-family: ui-monospace, SFMono-Regular, 'Geist Mono', monospace;
  font-size: 0.6875rem;
  line-height: 1.7;
  color: #e6e7ec;
  overflow: hidden;
`;

export const CodeLine = styled.div`
  white-space: pre;
`;

export const CodeTok = styled.span<{ $kind: string }>`
  color: ${(p) => {
    switch (p.$kind) {
      case 'kw':
        return '#c4a265';
      case 'str':
        return '#9ec99e';
      case 'fn':
        return '#9ad6c8';
      case 'comment':
        return '#7a7a85';
      case 'tag':
        return '#e07a8a';
      default:
        return '#e6e7ec';
    }
  }};
  ${(p) => p.$kind === 'comment' && 'font-style: italic;'}
`;

// ── Math tile ───────────────────────────────────────────

export const MathCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: var(--space-3) var(--space-4);
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.4;
  letter-spacing: 0.01em;
`;

export const MathLabel = styled.span`
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-style: normal;
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const Sup = styled.sup`
  font-size: 0.625em;
`;

export const Sub = styled.sub`
  font-size: 0.625em;
`;

// ── Narration tile ──────────────────────────────────────

export const NarrationCard = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);
`;

export const VoiceAvatar = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${(p) =>
    `linear-gradient(135deg, ${p.theme.colors.tertiary} 0%, ${p.theme.colors.accent} 100%)`};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const VoiceMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const VoiceName = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

export const VoiceLabel = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const Waveform = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  height: 22px;
`;

export const WaveBar = styled.span<{ $h: number }>`
  display: block;
  width: 2px;
  height: ${(p) => p.$h}%;
  background: ${(p) => p.theme.colors.tertiary};
  border-radius: 2px;
  opacity: 0.85;
`;

// ── Recall tile ─────────────────────────────────────────

export const RecallFront = styled.div`
  padding: var(--space-3) var(--space-4);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: var(--shadow-card);
`;

export const RecallEyebrow = styled.span`
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const RecallQuestion = styled.div`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.9375rem;
  line-height: 1.3;
  color: ${(p) => p.theme.colors.foreground};
`;

export const RecallHint = styled.span`
  align-self: flex-start;
  margin-top: 2px;
  font-size: 0.625rem;
  color: ${(p) => p.theme.colors.muted};
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  border: 1px dashed ${(p) => p.theme.colors.surfaceBorder};
`;
