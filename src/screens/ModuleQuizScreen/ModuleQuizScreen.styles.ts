import { ArrowLeft } from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import type { QuizMasteryTier } from '@/api/types';
import type { QuizOptionState } from '@/types';

/** Maps a mastery tier to its semantic color: success (green) for
 *  mastered, accent (forest green) for passed, error (red) for
 *  needs_review. Used by score / badge / pill / icon styles. */
const tierColor = ({
  tier,
  colors,
}: {
  tier: QuizMasteryTier;
  colors: { success: string; accent: string; error: string };
}) => (tier === 'mastered' ? colors.success : tier === 'passed' ? colors.accent : colors.error);

// ── Layout ────────────────────────────────────────────

export const Container = styled.div`
  min-height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 1.5rem 2rem 4rem;

  ${(p) => p.theme.media.tablet} {
    padding: 1.25rem 1.25rem 3rem;
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

/** Top rail — back affordance + dev reset. Locked min-height so the
 *  presence/absence of dev controls doesn't shift the header below. */
export const TopRail = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 1.75rem;
`;

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const BackIcon = styled(ArrowLeft).attrs({ size: 14, strokeWidth: 1.75 })`
  flex-shrink: 0;
`;

export const DevResetButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: none;
  border: 1px dashed ${(p) => p.theme.colors.border};
  border-radius: var(--radius-sm);
  font-size: 0.6875rem;
  font-family: inherit;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  opacity: 0.5;
  transition:
    opacity 0.15s,
    color 0.15s,
    border-color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      opacity: 1;
      color: ${(p) => p.theme.colors.error};
      border-color: ${(p) => p.theme.colors.error};
    }
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

// ── Header ────────────────────────────────────────────

export const HeaderSection = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const EyebrowRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.25rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin: 0;

  ${(p) => p.theme.media.tablet} {
    font-size: 1.625rem;
  }

  ${(p) => p.theme.media.mobile} {
    font-size: 1.375rem;
  }
`;

export const DescriptionText = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  margin: 0;
`;

// ── Generation panel ─────────────────────────────────
// Editorial replacement for a skeleton when the user has committed to
// generating a quiz. Skeletons imply "any moment now"; AI generation is
// a 20-30s job with intent — communicate that calmly with typography
// rather than shimmer blocks.

const dotPulse = keyframes`
  0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
  40%           { opacity: 1;    transform: scale(1);    }
`;

export const GeneratingCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.625rem;
  padding: 3rem 2rem;
  border-radius: var(--radius-xl);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};

  ${(p) => p.theme.media.tablet} {
    padding: 2.25rem 1.5rem;
  }
`;

export const GeneratingRule = styled.span`
  display: block;
  width: 36px;
  height: 1px;
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
  margin-bottom: 0.5rem;
`;

export const GeneratingEyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const GeneratingTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.625rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0.25rem 0 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const GeneratingLead = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.55;
  margin: 0;
  max-width: 36ch;
`;

export const GeneratingPhase = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  margin-top: 1.25rem;
  padding: 0.4375rem 0.875rem 0.4375rem 0.75rem;
  border-radius: var(--radius-pill);
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.005em;
`;

export const GeneratingDots = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
`;

export const GeneratingDot = styled.span<{ $delay: number }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent};
  animation: ${dotPulse} 1.4s ease-in-out infinite;
  animation-delay: ${(p) => p.$delay}ms;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.6;
  }
`;

// ── Pre-quiz meta ────────────────────────────────────

/** Italic single-line "previous best" indicator — replaces the chunky
 *  pill chip. Tier color lives only on the score+label span. */
export const PreviousAttemptLine = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.9375rem;
  font-weight: 400;
  letter-spacing: -0.005em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const PreviousAttemptHighlight = styled.span<{ $tier: QuizMasteryTier }>`
  font-style: normal;
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.1875rem 0.5rem;
  border-radius: var(--radius-pill);
  border: 1px solid ${(p) => `color-mix(in oklab, ${tierColor({ tier: p.$tier, colors: p.theme.colors })} 30%, transparent)`};
  background: ${(p) => `color-mix(in oklab, ${tierColor({ tier: p.$tier, colors: p.theme.colors })} 10%, transparent)`};
  color: ${(p) => tierColor({ tier: p.$tier, colors: p.theme.colors })};
  vertical-align: 0.05em;
`;

export const PreviousAttemptCount = styled.span`
  opacity: 0.75;
  font-size: 0.8125rem;
`;

export const PrimaryAction = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`;

// ── Progress bar ──────────────────────────────────────

export const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

export const ProgressBarTrack = styled.div`
  flex: 1;
  height: 5px;
  border-radius: var(--radius-pill);
  background: ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => Math.max(0, Math.min(100, p.$percent))}%;
  background: ${(p) => p.theme.colors.accent};
  border-radius: var(--radius-pill);
  transition: width 0.3s ease;
`;

export const ProgressText = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  white-space: nowrap;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
`;

// ── Question ──────────────────────────────────────────

export const QuestionCard = styled.div`
  border-radius: var(--radius-xl);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  overflow: hidden;
`;

export const QuestionText = styled.p`
  padding: 1.5rem 1.75rem;
  margin: 0;
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.55;
  letter-spacing: -0.005em;
  color: ${(p) => p.theme.colors.foreground};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  ${(p) => p.theme.media.tablet} {
    padding: 1.25rem 1.25rem;
    font-size: 0.9375rem;
  }
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.125rem 1.25rem;
  gap: 0.5rem;

  ${(p) => p.theme.media.tablet} {
    padding: 1rem 1rem;
  }
`;

export const Option = styled.button<{ $state: QuizOptionState }>`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid
    ${(p) =>
      p.$state === 'selected'
        ? p.theme.colors.accent
        : p.$state === 'correct'
          ? p.theme.colors.success
          : p.$state === 'incorrect'
            ? p.theme.colors.error
            : p.theme.colors.surfaceBorder};
  background: ${(p) =>
    p.$state === 'selected'
      ? p.theme.colors.accentMuted
      : p.$state === 'correct'
        ? `${p.theme.colors.success}10`
        : p.$state === 'incorrect'
          ? `${p.theme.colors.error}10`
          : p.theme.colors.background};
  color: ${(p) => (p.$state === 'dimmed' ? p.theme.colors.muted : p.theme.colors.foreground)};
  font-family: inherit;
  font-size: 0.9375rem;
  text-align: left;
  cursor: ${(p) => (p.$state === 'default' || p.$state === 'selected' ? 'pointer' : 'default')};
  line-height: 1.5;
  transition:
    border-color 0.15s,
    background 0.15s,
    transform 0.1s;

  ${(p) =>
    (p.$state === 'default' || p.$state === 'selected') &&
    `${p.theme.media.hover} {
      &:hover {
        border-color: ${p.theme.colors.accent};
      }
    }`}

  &:active:not(:disabled) {
    transform: scale(0.995);
  }
`;

export const OptionLetter = styled.span<{ $state: QuizOptionState }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: var(--radius-pill);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: ${(p) =>
    p.$state === 'selected'
      ? p.theme.colors.accent
      : p.$state === 'correct'
        ? p.theme.colors.success
        : p.$state === 'incorrect'
          ? p.theme.colors.error
          : 'transparent'};
  color: ${(p) =>
    p.$state === 'selected' || p.$state === 'correct' || p.$state === 'incorrect'
      ? 'var(--on-accent)'
      : p.theme.colors.muted};
  border: 1px solid
    ${(p) =>
      p.$state === 'selected'
        ? p.theme.colors.accent
        : p.$state === 'correct'
          ? p.theme.colors.success
          : p.$state === 'incorrect'
            ? p.theme.colors.error
            : p.theme.colors.border};
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
`;

export const InterleavedTagWrap = styled.div`
  padding: 0.875rem 1.75rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
`;

export const SourceTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill);
  background: ${(p) => p.theme.colors.tertiaryMuted};
  border: 1px solid ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 30%, transparent)`};
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.tertiary};
`;

/** Hairline divider above lesson links, plus an eyebrow label, so the
 *  references read as a different "level" from the explanation prose
 *  rather than running into it. */
export const SourceLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.875rem;
  padding-top: 0.875rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  font-size: 0.8125rem;
`;

export const SourceLinksLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 0.125rem;
`;

export const SourceLinksList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 1rem;
`;

// ── Results ───────────────────────────────────────────

export const ResultsHero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.625rem;
  padding: 2.25rem 1.5rem 2rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  background: ${(p) => p.theme.colors.surface};
`;

export const ScoreDisplay = styled.div<{ $tier: QuizMasteryTier }>`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 4.5rem;
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1;
  color: ${(p) => tierColor({ tier: p.$tier, colors: p.theme.colors })};
  margin-bottom: 0.125rem;

  ${(p) => p.theme.media.mobile} {
    font-size: 3.25rem;
  }
`;

export const ResultsTitle = styled.h1`
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.005em;
  line-height: 1.4;
  margin: 0;
  max-width: 30rem;
`;

export const MasteryBadge = styled.span<{ $tier: QuizMasteryTier }>`
  display: inline-block;
  padding: 0.3125rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: ${(p) => `color-mix(in oklab, ${tierColor({ tier: p.$tier, colors: p.theme.colors })} 14%, ${p.theme.colors.surface})`};
  color: ${(p) => tierColor({ tier: p.$tier, colors: p.theme.colors })};
  border: 1px solid ${(p) => `color-mix(in oklab, ${tierColor({ tier: p.$tier, colors: p.theme.colors })} 28%, transparent)`};
`;

export const NextReviewInfo = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
  margin-top: 0.125rem;
`;

export const ResultsSectionLabel = styled.h2`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const ResultsList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const ResultItem = styled.li<{ $correct: boolean }>`
  border-radius: var(--radius-xl);
  border: 1px solid
    ${(p) =>
      p.$correct
        ? `color-mix(in oklab, ${p.theme.colors.success} 30%, ${p.theme.colors.surfaceBorder})`
        : `color-mix(in oklab, ${p.theme.colors.error} 30%, ${p.theme.colors.surfaceBorder})`};
  background: ${(p) => p.theme.colors.surface};
  overflow: hidden;
`;

/** Three-column row: indicator | Q-number | question text. The
 *  Q-number gets its own column so it can't run on with the question
 *  text the way an inline span does (Q1You identify…). */
export const ResultItemHeader = styled.div<{ $correct: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.125rem 1.375rem;
  background: ${(p) =>
    p.$correct
      ? `color-mix(in oklab, ${p.theme.colors.success} 6%, ${p.theme.colors.surface})`
      : `color-mix(in oklab, ${p.theme.colors.error} 6%, ${p.theme.colors.surface})`};
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.005em;
  color: ${(p) => p.theme.colors.foreground};
`;

export const QuestionIndex = styled.span`
  flex-shrink: 0;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.9375rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
  letter-spacing: 0;
  /* Aligns to the question text baseline rather than crowding it. */
  padding-top: 1px;
  min-width: 1.75rem;
`;

export const QuestionTextHeader = styled.span`
  flex: 1;
  min-width: 0;
`;

export const ResultIndicator = styled.span<{ $correct: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-pill);
  margin-top: 2px;
  background: ${(p) => (p.$correct ? p.theme.colors.success : p.theme.colors.error)};
  color: var(--on-accent);
`;

export const ResultBody = styled.div`
  padding: 1rem 1.375rem 1.125rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const AnswerRow = styled.div<{ $variant?: 'picked' | 'correct' | 'neutral' }>`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.875rem;
  line-height: 1.45;
  color: ${(p) => p.theme.colors.foreground};
`;

/** Min-width so YOUR PICK and ANSWER pills lock to the same column;
 *  the answer text on each row then aligns vertically. The natural
 *  string widths differ by ~30px otherwise, which makes the rows look
 *  ragged. text-align: center keeps shorter labels visually centered
 *  inside the locked width. */
export const AnswerLabel = styled.span<{ $variant: 'picked-wrong' | 'correct' | 'muted' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 5.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  margin-top: 2px;
  background: ${(p) =>
    p.$variant === 'correct'
      ? `color-mix(in oklab, ${p.theme.colors.success} 14%, ${p.theme.colors.surface})`
      : p.$variant === 'picked-wrong'
        ? `color-mix(in oklab, ${p.theme.colors.error} 14%, ${p.theme.colors.surface})`
        : p.theme.colors.background};
  color: ${(p) =>
    p.$variant === 'correct'
      ? p.theme.colors.success
      : p.$variant === 'picked-wrong'
        ? p.theme.colors.error
        : p.theme.colors.muted};
`;

export const AnswerText = styled.span`
  color: ${(p) => p.theme.colors.foreground};
  flex: 1;
  min-width: 0;
`;

export const ExplanationText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.muted};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

