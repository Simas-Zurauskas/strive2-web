import styled, { keyframes } from 'styled-components';
import { onAccent } from '@/theme';
import type { GradeVerdict } from '@/api/types';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 1.625rem 1.375rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  animation: ${fadeIn} 0.2s ease;

  ${(p) => p.theme.media.tablet} {
    padding: 1.125rem 1.125rem 1rem;
    gap: 0.875rem;
  }
`;

// ── Source meta (course eyebrow + lesson link) + mode ─────
// Two-line meta block on the left, mode toggle on the right.
// Inline-joining the course and lesson with " · " breaks when either
// is long — both end up truncated and the lesson hides under the
// toggle. Stacking them gives each its own row with independent
// ellipsis: the lesson title (the primary identifier) gets the
// full width it needs.

export const SourceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
`;

export const SourceMeta = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
`;

/** Small uppercase eyebrow — clearly metadata, never the primary
 *  visual element. Ellipsis only kicks in for an extremely long
 *  course name; the lesson row beneath gets all the width it needs. */
export const SourceCourse = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/** Lesson link — the primary identifier of where this card came from.
 *  Foreground colour, gets full row width. */
export const SourceLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  color: ${(p) => p.theme.colors.foreground};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: -0.005em;
  line-height: 1.3;
  min-width: 0;
  transition: color 0.15s;

  /* The wrapping span carries the ellipsis so the icon stays anchored
     to the end of whatever portion of the lesson name fits. */
  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  & svg {
    flex-shrink: 0;
    opacity: 0.5;
    margin-bottom: -1px;
  }

  &:hover {
    color: ${(p) => p.theme.colors.tertiary};

    & > span {
      text-decoration: underline;
    }
  }
`;

export const SourceBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  align-self: center;
`;

// ── Mode toggle (segmented control, restrained) ──────
// Active option uses an accent-muted background + accent text rather
// than inverted-fill — quieter, fits editorial chrome.

export const ModeToggle = styled.div`
  display: inline-flex;
  align-items: stretch;
  padding: 2px;
  border-radius: var(--radius-pill);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.background};
`;

export const ModeOption = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.3125rem 0.625rem;
  border-radius: var(--radius-pill);
  border: none;
  font-family: inherit;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${(p) => (p.$active ? p.theme.colors.accentMuted : 'transparent')};
  color: ${(p) => (p.$active ? p.theme.colors.accent : p.theme.colors.muted)};
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover:not(:disabled) {
    color: ${(p) => (p.$active ? p.theme.colors.accent : p.theme.colors.foreground)};
  }

  &:disabled {
    cursor: default;
  }
`;

// ── Footer badges (kind / state) ─────────────────────
// Single badge component reused for kind / new / box. All use
// color-mix tints + hairline borders, never solid fills.

const badgeColor = ({
  variant,
  colors,
}: {
  variant: 'kind' | 'new' | 'box' | 'mode' | undefined;
  colors: { accent: string; success: string; warning: string; muted: string; tertiary: string };
}) => {
  switch (variant) {
    case 'new':
      return colors.tertiary;
    case 'box':
      return colors.success;
    case 'mode':
      return colors.warning;
    case 'kind':
    default:
      return colors.muted;
  }
};

export const Badge = styled.span<{ $variant?: 'kind' | 'new' | 'box' | 'mode' }>`
  display: inline-block;
  padding: 0.1875rem 0.5rem;
  border-radius: var(--radius-pill);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid
    ${(p) =>
      `color-mix(in oklab, ${badgeColor({ variant: p.$variant, colors: p.theme.colors })} 28%, transparent)`};
  background: ${(p) =>
    `color-mix(in oklab, ${badgeColor({ variant: p.$variant, colors: p.theme.colors })} 10%, transparent)`};
  color: ${(p) => badgeColor({ variant: p.$variant, colors: p.theme.colors })};
`;

// ── Prompt (the focal moment of the card) ────────────

export const Prompt = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.015em;
  margin: 0.25rem 0 0;
  color: ${(p) => p.theme.colors.foreground};

  ${(p) => p.theme.media.tablet} {
    font-size: 1.25rem;
  }
`;

/** Cloze blank — lighter, more typographic. Unrevealed: just an
 *  underlined gap (no chunky bg block). Revealed: success-tinted
 *  background + colored text. The blank reads as part of the
 *  sentence rhythm rather than a placeholder rectangle dropped in. */
export const BlankSlot = styled.span<{ $revealed: boolean }>`
  display: inline-block;
  min-width: 3.5rem;
  padding: ${(p) => (p.$revealed ? '0 0.4375rem' : '0 0.375rem')};
  border-radius: ${(p) => (p.$revealed ? 'var(--radius-sm)' : '0')};
  background: ${(p) =>
    p.$revealed
      ? `color-mix(in oklab, ${p.theme.colors.success} 14%, ${p.theme.colors.surface})`
      : 'transparent'};
  color: ${(p) => (p.$revealed ? p.theme.colors.success : 'transparent')};
  border-bottom: ${(p) =>
    p.$revealed
      ? `2px solid ${p.theme.colors.success}`
      : `1.5px solid ${p.theme.colors.muted}`};
  font-family: inherit;
  font-weight: 600;
  transition:
    background 0.2s,
    color 0.2s,
    border-bottom-color 0.2s;
`;

// ── Answer block (revealed) ─────────────────────────
// Soft accent-tinted callout with a hairline border, not a heavy
// left-bar productivity callout.

export const AnswerBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4375rem;
  padding: 0.875rem 1rem 1rem;
  background: ${(p) => p.theme.colors.accentMuted};
  border: 1px solid
    ${(p) => `color-mix(in oklab, ${p.theme.colors.accent} 22%, transparent)`};
  border-radius: var(--radius-lg);
  animation: ${fadeIn} 0.2s ease;
`;

export const AnswerLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.accent};
`;

export const AnswerText = styled.span`
  font-size: 1rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.foreground};
  font-weight: 500;
`;

// ── Reveal divider (tap-mode primary action) ────────

export const RevealDivider = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.muted};
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: color 0.15s;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${(p) => p.theme.colors.surfaceBorder};
    transition: background 0.15s;
  }

  &:hover {
    color: ${(p) => p.theme.colors.accent};

    &::before,
    &::after {
      background: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.accent} 50%, ${p.theme.colors.surfaceBorder})`};
    }
  }

  &:focus-visible {
    outline: none;
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const RevealLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

// ── Footer ──────────────────────────────────────────

export const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.125rem;
`;

export const FooterBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const SkipLink = styled.button`
  padding: 0;
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.muted};
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

// ── Typed recall ─────────────────────────────────────

export const TypedRow = styled.form`
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
`;

export const TypedInput = styled.input`
  flex: 1;
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  font-size: 0.9375rem;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const TypedSubmit = styled.button`
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => p.theme.colors.accent};
  background: ${(p) => p.theme.colors.accent};
  color: ${onAccent};
  font-family: inherit;
  font-weight: 600;
  font-size: 0.8125rem;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    opacity 0.15s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.accentHover};
  }
`;

// ── Verdict panel (AI-graded typed recall) ───────────

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

export const VerdictPanel = styled.div<{ $verdict: GradeVerdict | null }>`
  display: flex;
  flex-direction: column;
  gap: 0.4375rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid
    ${(p) =>
      `color-mix(in oklab, ${verdictColor({ verdict: p.$verdict, colors: p.theme.colors })} 28%, transparent)`};
  background: ${(p) =>
    `color-mix(in oklab, ${verdictColor({ verdict: p.$verdict, colors: p.theme.colors })} 8%, ${p.theme.colors.surface})`};
`;

export const VerdictHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const YourAnswer = styled.span`
  font-size: 0.8125rem;
  font-style: italic;
  color: ${(p) => p.theme.colors.muted};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const VerdictPill = styled.span<{ $verdict: GradeVerdict }>`
  display: inline-block;
  padding: 0.1875rem 0.5625rem;
  border-radius: var(--radius-pill);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  flex-shrink: 0;
  border: 1px solid
    ${(p) =>
      `color-mix(in oklab, ${verdictColor({ verdict: p.$verdict, colors: p.theme.colors })} 30%, transparent)`};
  background: ${(p) =>
    `color-mix(in oklab, ${verdictColor({ verdict: p.$verdict, colors: p.theme.colors })} 14%, ${p.theme.colors.surface})`};
  color: ${(p) => verdictColor({ verdict: p.$verdict, colors: p.theme.colors })};
`;

export const GradingSpinner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;

  .spin {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const VerdictFeedback = styled.p`
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

// Inline label above the rating bar — hosts the recall-ratings HelpAnchor
// without disturbing the existing 4-button grid layout.
export const RatingBarRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.375rem;
`;

export const RatingBarLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;
