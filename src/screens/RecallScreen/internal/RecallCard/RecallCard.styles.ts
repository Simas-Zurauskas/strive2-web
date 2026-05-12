import { motion } from 'framer-motion';
import styled from 'styled-components';
import { onAccent } from '@/theme';
import type { GradeVerdict } from '@/api/types';

// ── Layout shell ─────────────────────────────────────
// The card sits inside a "stack" that includes the breadcrumb above —
// the breadcrumb is *part of* the card's identity but lives outside the
// surface, so the prompt is the first weighted element the eye lands on.

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: 100%;
`;

// ── Breadcrumb (course / lesson, above the card) ─────

export const Breadcrumb = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  padding: 0 0.125rem;
  font-size: 0.75rem;
  line-height: 1.3;
`;

export const CourseTag = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 12rem;
  flex-shrink: 1;
  min-width: 0;

  ${(p) => p.theme.media.tablet} {
    max-width: 7rem;
  }

  ${(p) => p.theme.media.mobile} {
    max-width: 5rem;
  }
`;

export const BreadcrumbSep = styled.span`
  color: ${(p) => p.theme.colors.muted};
  opacity: 0.5;
  flex-shrink: 0;
`;

/** Small gold pill that appears in the breadcrumb when this card is
 *  cycling back after a previous Again. Tells the user "yes, you're
 *  seeing this again on purpose" without breaking the card surface. */
export const RetryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.25rem;
  padding: 0.0625rem 0.4375rem;
  border-radius: var(--radius-pill);
  border: 1px solid
    ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 45%, transparent)`};
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 12%, transparent)`};
  color: ${(p) => p.theme.colors.tertiaryHover};
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  flex-shrink: 0;
`;

export const LessonLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  color: ${(p) => p.theme.colors.muted};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.75rem;
  transition: color 0.15s;

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  & svg {
    flex-shrink: 0;
    opacity: 0.55;
    margin-bottom: -1px;
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.tertiary};
      & > span {
        text-decoration: underline;
      }
      & svg {
        opacity: 0.9;
      }
    }
  }
`;

// ── Card surface ─────────────────────────────────────

export const Card = styled(motion.article)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2rem 2rem 1.75rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-ghost, 0 1px 2px rgba(0, 0, 0, 0.04));

  ${(p) => p.theme.media.tablet} {
    padding: 1.5rem 1.25rem 1.25rem;
    gap: 1rem;
  }

  ${(p) => p.theme.media.mobile} {
    padding: 1.25rem 1rem 1.125rem;
    gap: 0.875rem;
    border-radius: var(--radius-lg);
  }
`;

// ── Prompt ───────────────────────────────────────────

export const Prompt = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.625rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.015em;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};

  ${(p) => p.theme.media.tablet} {
    font-size: 1.3125rem;
  }

  ${(p) => p.theme.media.mobile} {
    font-size: 1.1875rem;
    line-height: 1.4;
  }
`;

/** Cloze blank.
 *  Unrevealed: underlined typographic gap.
 *  Revealed: tertiary-tinted (warm gold) — a neutral "look here, this is
 *  the answer" cue rather than success-green which would imply the user
 *  got it right even when they didn't. */
export const BlankSlot = styled.span<{ $revealed: boolean }>`
  display: inline-block;
  min-width: 3.5rem;
  padding: ${(p) => (p.$revealed ? '0 0.4375rem' : '0 0.375rem')};
  border-radius: ${(p) => (p.$revealed ? 'var(--radius-sm)' : '0')};
  background: ${(p) =>
    p.$revealed
      ? `color-mix(in oklab, ${p.theme.colors.tertiary} 16%, ${p.theme.colors.surface})`
      : 'transparent'};
  color: ${(p) =>
    p.$revealed ? p.theme.colors.tertiaryHover : 'transparent'};
  border-bottom: ${(p) =>
    p.$revealed
      ? `2px solid ${p.theme.colors.tertiary}`
      : `1.5px solid ${p.theme.colors.muted}`};
  font-family: inherit;
  font-weight: 600;
  transition:
    background 0.2s,
    color 0.2s,
    border-bottom-color 0.2s;
`;

// ── "or" divider ─────────────────────────────────────
// Sits between the typed-recall row (primary) and the reveal/skip row
// (secondary). Quiet typographic separator — italic serif "or" with
// hairlines on each side, no contrast spike. Reads as a fork, not a
// section break.

export const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin: 0.0625rem 0;
  user-select: none;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.surfaceBorder} 100%, transparent)`};
  }
`;

export const OrLabel = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: ${(p) => p.theme.colors.muted};
  padding: 0 0.125rem;
`;

// ── Reveal action row ────────────────────────────────
// Secondary path under the typed-recall row. Reveal is a quieter
// gold-outlined button — typing is the recommended primary path, so
// Reveal steps back and reads as the "I'd rather just see it" option.
// Skip uses the same fixed right-column width as the Check button
// above so the two rows align perfectly with no layout shift.

export const RevealRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
`;

export const RevealButton = styled.button`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 0.875rem;
  border-radius: var(--radius-md);
  border: 1px solid
    ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, transparent)`};
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 8%, ${p.theme.colors.surface})`};
  color: ${(p) => p.theme.colors.tertiaryHover};
  font-family: inherit;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  min-height: 34px;
  height: 34px;

  /* Bump to a real touch target on tablet/mobile widths — 34px is
     too small for a thumb. */
  ${(p) => p.theme.media.tablet} {
    min-height: 44px;
    height: 44px;
  }
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.1s ease,
    box-shadow 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.tertiary} 16%, ${p.theme.colors.surface})`};
      border-color: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.tertiary} 75%, transparent)`};
    }
  }

  &:active {
    transform: scale(0.99);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px
      ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.tertiary} 28%, transparent)`};
  }
`;

/** Right-column width shared by Check (typed row) and Skip (reveal
 *  row) so the two action rows align and there's no layout shift
 *  between renders. Kept here so both buttons reference one source. */
const RIGHT_COL_WIDTH = '6.25rem';

export const SkipButton = styled.button`
  width: ${RIGHT_COL_WIDTH};
  flex-shrink: 0;
  padding: 0;
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  font-family: inherit;
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  min-height: 34px;
  height: 34px;

  ${(p) => p.theme.media.tablet} {
    min-height: 44px;
    height: 44px;
    width: 4.5rem;
  }
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
      border-color: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.muted} 40%, transparent)`};
    }
  }

  &:focus-visible {
    outline: none;
    color: ${(p) => p.theme.colors.foreground};
    border-color: ${(p) => p.theme.colors.muted};
  }
`;

// ── Answer block (QA cards only — cloze reveals inline) ─────
// Lighter than the previous accent-tinted callout. A left-stripe of
// tertiary (warm gold) anchors it as "the canonical answer" without
// turning the whole block into a tinted rectangle.

export const AnswerBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.75rem 1rem 0.875rem;
  border-left: 2px solid
    ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 70%, transparent)`};
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 6%, transparent)`};
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
`;

export const AnswerLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const AnswerText = styled.span`
  font-size: 1.0625rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
  font-weight: 500;
`;

// ── Typed-recall input (always available, no mode toggle) ──
// Optional path: type for AI feedback, or just press Space / click
// Reveal to skip the typing. Sits above the Reveal row so the choice
// is legible without being aggressive (Reveal is autofocused, not the
// input).

export const TypedForm = styled.form`
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
  margin-top: 0.25rem;
`;

export const TypedInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.75rem 0.875rem;
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  font-size: 0.9375rem;
  min-height: 48px;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
    opacity: 0.85;
  }

  &:focus {
    outline: none;
    border-color: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.accent} 55%, ${p.theme.colors.surfaceBorder})`};
    box-shadow: 0 0 0 3px
      ${(p) => `color-mix(in oklab, ${p.theme.colors.accent} 18%, transparent)`};
  }
`;

/** Filled-accent Check button — the recommended primary action since
 *  typing is the deeper-practice path. Fixed width so the column
 *  aligns with Skip below and there's no layout shift between
 *  renders. */
export const TypedSubmit = styled.button`
  width: ${RIGHT_COL_WIDTH};
  flex-shrink: 0;
  padding: 0;
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => p.theme.colors.accent};
  background: ${(p) => p.theme.colors.accent};
  color: ${onAccent};
  font-family: inherit;
  font-weight: 700;
  font-size: 0.8125rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  min-height: 48px;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s, box-shadow 0.15s;

  /* Narrower right column on mobile so the typed input gets more
     breathing room. Stays aligned with Skip below. */
  ${(p) => p.theme.media.tablet} {
    width: 4.5rem;
  }

  &:disabled {
    opacity: 0.32;
    cursor: not-allowed;
  }

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      background: ${(p) => p.theme.colors.accentHover};
      border-color: ${(p) => p.theme.colors.accentHover};
    }
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px
      ${(p) => `color-mix(in oklab, ${p.theme.colors.accent} 28%, transparent)`};
  }
`;

// ── Assessing state ──────────────────────────────────
// Shown after the user submits a typed answer while the AI is grading.
// Holds back the canonical answer and rating bar so the user doesn't
// see the right answer next to their (possibly wrong) input before
// the AI has actually evaluated it.

export const Assessing = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.125rem;
  border: 1px dashed
    ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.accent} 38%, ${p.theme.colors.surfaceBorder})`};
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.accent} 4%, transparent)`};
  border-radius: var(--radius-lg);
`;

export const AssessingHeader = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.accent};

  .spin {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const AssessingYourAnswer = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

// ── Verdict (AI-graded typed recall) ─────────────────
// Typographic, not panel-shaped. The status word carries the colour;
// the rest reads as a quiet annotation under the answer.

const verdictColor = ({
  verdict,
  colors,
}: {
  verdict: GradeVerdict | null;
  colors: { success: string; accent: string; error: string; muted: string };
}): string => {
  switch (verdict) {
    case 'correct':
      return colors.success;
    case 'partial':
      return colors.accent;
    case 'incorrect':
      return colors.error;
    default:
      return colors.muted;
  }
};

export const Verdict = styled.div<{ $verdict: GradeVerdict | null }>`
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
  padding: 0 0.125rem;
`;

export const VerdictRow = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const VerdictStatus = styled.span<{ $verdict: GradeVerdict | null }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => verdictColor({ verdict: p.$verdict, colors: p.theme.colors })};
  flex-shrink: 0;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    display: inline-block;
    flex-shrink: 0;
  }

  .spin {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const YourAnswer = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  min-width: 0;
  line-height: 1.5;
`;

export const YourAnswerQuoted = styled.span`
  font-style: italic;
  font-weight: 700;
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  &::before {
    content: '“';
  }
  &::after {
    content: '”';
  }
`;

export const VerdictFeedback = styled.p`
  font-size: 1rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
  padding-left: 0.125rem;
`;

// ── Rating label above bar ───────────────────────────

export const RatingLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.25rem;
`;
