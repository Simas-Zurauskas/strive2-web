'use client';

import styled, { keyframes } from 'styled-components';
import { codeTokens } from '@/theme';

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Frame = styled.div`
  width: min(460px, 100%);
  max-width: 100%;
  aspect-ratio: 460 / 580;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lift);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  contain: layout paint;

  ${(p) => p.theme.media.tabletLarge} {
    width: min(380px, 100%);
  }

  ${(p) => p.theme.media.mobile} {
    width: min(320px, 88vw);
  }
`;

export const FrameTopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: ${(p) => p.theme.colors.background};
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.surfaceBorder};
`;

export const FrameBody = styled.div`
  flex: 1;
  padding: var(--space-5);
  overflow: hidden;
  position: relative;
`;

// ── Stage 1: typing the goal ───────────────────────────

export const GoalStage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: var(--space-3);
  animation: ${fadeIn} 0.3s ease-out;
`;

export const GoalLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const GoalInput = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--space-3) var(--space-4);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  background: ${(p) => p.theme.colors.background};
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  min-height: 48px;
  line-height: 1.4;
  flex-wrap: wrap;
`;

export const Caret = styled.span`
  display: inline-block;
  width: 1px;
  height: 16px;
  background: ${(p) => p.theme.colors.foreground};
  animation: ${blink} 1s steps(1) infinite;
`;

export const GoalHint = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

// ── Stage 2/3: streaming lesson ───────────────────────

export const LessonStage = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  animation: ${fadeIn} 0.4s ease-out;
`;

export const ModuleEyebrow = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const LessonTitle = styled.div`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.25rem;
  letter-spacing: -0.015em;
  line-height: 1.2;
  color: ${(p) => p.theme.colors.foreground};
  margin-bottom: var(--space-1);
`;

export const BlockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

export const BlockRow = styled.div<{ $visible: boolean }>`
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$visible ? '0' : '4px')});
  transition: opacity 0.35s ease-out, transform 0.35s ease-out;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SectionHeading = styled.h4`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 500;
  font-size: 0.9375rem;
  letter-spacing: -0.01em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
  line-height: 1.3;
`;

export const Prose = styled.p`
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

// ── Code ──────────────────────────────────────────────

export const CodeBlock = styled.div`
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.foreground} 96%, ${p.theme.colors.tertiary})`};
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-3);
  font-family: ui-monospace, SFMono-Regular, 'Geist Mono', monospace;
  font-size: 0.6875rem;
  line-height: 1.7;
  color: ${codeTokens.text};
  overflow: hidden;
`;

export const CodeLine = styled.div`
  white-space: pre;
`;

export const Tok = styled.span<{ $kind: string }>`
  color: ${(p) => {
    switch (p.$kind) {
      case 'kw':
        return codeTokens.keyword;
      case 'str':
        return codeTokens.string;
      case 'fn':
        return codeTokens.function;
      case 'num':
        return codeTokens.number;
      case 'comment':
        return codeTokens.comment;
      case 'tag':
        return codeTokens.operator;
      default:
        return codeTokens.text;
    }
  }};
  ${(p) => p.$kind === 'comment' && 'font-style: italic;'}
`;

// ── Callout ───────────────────────────────────────────

export const CalloutCard = styled.div<{ $tone: 'tip' | 'formula' | 'phrase' }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: ${(p) =>
    p.$tone === 'tip'
      ? p.theme.colors.tertiaryMuted
      : `color-mix(in oklab, ${p.theme.colors.tertiary} 6%, ${p.theme.colors.surface})`};
  border-left: 3px solid ${(p) => p.theme.colors.tertiary};
`;

export const CalloutTitle = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const CalloutBody = styled.div<{ $formula?: boolean }>`
  font-size: ${(p) => (p.$formula ? '0.9375rem' : '0.8125rem')};
  ${(p) =>
    p.$formula &&
    `font-family: var(--font-heading-serif), Georgia, serif;
     font-style: italic;
     letter-spacing: 0.01em;`}
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.45;
`;

export const CalloutGloss = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  font-style: italic;
`;

// ── Quiz ──────────────────────────────────────────────

export const QuizCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);
`;

export const QuizLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.accent};
`;

export const QuizQuestion = styled.div`
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
  color: ${(p) => p.theme.colors.foreground};
`;

export const QuizOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 2px;
`;

export const QuizOption = styled.div<{ $correct?: boolean }>`
  font-size: 0.75rem;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid
    ${(p) =>
      p.$correct
        ? `color-mix(in oklab, ${p.theme.colors.success} 50%, transparent)`
        : p.theme.colors.surfaceBorder};
  background: ${(p) =>
    p.$correct
      ? `color-mix(in oklab, ${p.theme.colors.success} 10%, ${p.theme.colors.surface})`
      : p.theme.colors.surface};
  color: ${(p) =>
    p.$correct ? p.theme.colors.success : p.theme.colors.foreground};
  font-weight: ${(p) => (p.$correct ? 600 : 400)};
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: ${(p) => (p.$correct ? '"✓"' : '""')};
    font-weight: 700;
    color: ${(p) => p.theme.colors.success};
    font-size: 0.75rem;
  }
`;
