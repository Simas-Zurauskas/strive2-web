'use client';

import styled from 'styled-components';
import { SectionLabel, TextAction } from '@/components';
import { thinScrollbar, onAccent } from '@/theme';
import type { QuizMasteryTier } from '@/api/types';
import type { QuizIconVariant } from '@/types';

export const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2.5rem 3rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  ${thinScrollbar}

  @media (max-width: 640px) {
    padding: 1.5rem 1.25rem 2rem;
  }
`;

// ── Header ───────────────────────────────────────────

export const Header = styled.header`
  margin-bottom: 2rem;
`;

export const Eyebrow = styled(SectionLabel).attrs({ as: 'span' })`
  display: inline-block;
  margin-bottom: 0.5rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 700;
  font-style: italic;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin: 0 0 0.75rem;
`;

export const Goal = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1rem;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// ── Progress section ─────────────────────────────────
// Legacy "card" treatment kept for back-compat (not currently used after the
// UpNextHero rewrite — the slim ProgressMini below is rendered instead).

export const ProgressSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const ProgressLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

export const ProgressValue = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.accent};
`;

export const ProgressBarTrack = styled.div`
  height: 6px;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.surfaceBorder};
`;

export const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.accent};
  width: ${(p) => p.$percent}%;
  transition: width 400ms ease;
`;

export const ContinueButton = styled.button`
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  background: ${(p) => p.theme.colors.accent};
  color: ${onAccent};
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }
`;

// Slim percent-complete readout shown below UpNextHero once the user has
// any forward motion. Just a label + bar — no CTA, since UpNextHero owns the
// directional message.
export const ProgressMini = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: -0.5rem 0 2rem;
  padding: 0 0.25rem;
`;

export const ProgressMiniLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.accent};
  flex-shrink: 0;
`;

// ── Reviews due ──────────────────────────────────────

export const ReviewsSection = styled.div`
  margin-bottom: 2rem;
`;

export const ReviewsHeader = styled(SectionLabel)`
  margin-bottom: 0.75rem;
`;

export const ReviewItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s;
  margin-bottom: 0.5rem;

  &:hover {
    border-color: ${(p) => p.theme.colors.warning};
  }
`;

export const ReviewModuleName = styled.span`
  flex: 1;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.foreground};
`;

export const RowArrow = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.accent};
  flex-shrink: 0;
`;

// ── Bookmarks section ────────────────────────────────

export const BookmarksSection = styled.div`
  margin-bottom: 2rem;
`;

export const BookmarksHeader = styled(SectionLabel)`
  margin-bottom: 0.75rem;
`;

export const BookmarkItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s;
  margin-bottom: 0.5rem;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const BookmarkLessonName = styled.span`
  flex: 1;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.foreground};
`;

// BookmarkArrow removed — use RowArrow

// ── Outline section ──────────────────────────────────

export const SectionTitle = styled(SectionLabel)`
  margin-bottom: 1rem;
`;

export const ModuleCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

// Module header is now a button so a screenreader announces the
// expand/collapse affordance and Enter/Space toggles. The bottom border is
// only painted when the card is expanded — collapsed cards read as a single
// row, no orphan rule between header and (hidden) body.
export const ModuleHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  background: ${(p) => p.theme.colors.surface};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  color: inherit;
  transition: background 0.15s;

  &:hover {
    background: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.accent} 4%, ${p.theme.colors.surface})`};
  }

  &[aria-expanded='true'] {
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: -2px;
  }
`;

export const ChevronWrap = styled.span<{ $expanded: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${(p) => p.theme.colors.muted};
  transition: transform 150ms ease;
  transform: ${(p) => (p.$expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

// Inline quiz indicator that appears on a COLLAPSED module header so the
// user knows there's an actionable quiz inside without expanding. Variants:
//   - not-taken     → tertiary (gold) — "available, take it"
//   - needs_review  → warning  (amber) — "due", subtle pulse
// `mastered`/`passed`/`locked` are not surfaced (passed quizzes need no
// nudge; locked is implied by an incomplete module).
export const HeaderQuizBadge = styled.span<{ $variant: 'not-taken' | 'needs_review' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) =>
    p.$variant === 'needs_review'
      ? `${p.theme.colors.warning}22`
      : `${p.theme.colors.tertiary}22`};
  color: ${(p) =>
    p.$variant === 'needs_review' ? p.theme.colors.warning : p.theme.colors.tertiary};

  ${(p) =>
    p.$variant === 'needs_review' &&
    `
      @media (prefers-reduced-motion: no-preference) {
        animation: overviewHeaderQuizPulse 2.4s ease-in-out infinite;
      }
      @keyframes overviewHeaderQuizPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.55; }
      }
    `}
`;

export const ModuleTitle = styled.span`
  flex: 1;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

export const ModuleDot = styled.span`
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0.125rem;
`;

export const ModuleProgress = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
`;

export const ModuleDescription = styled.p`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const LessonList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LessonItem = styled.button<{ $focus?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 1.25rem;
  /* Subtle gold left rail on the UpNextHero target row so the eye lands
     on the same lesson the CTA points at, even when the user scrolls past
     the hero. The 3px rail mirrors the sidebar's "active lesson" treatment
     for visual consistency, but uses tertiary (gold) instead of accent
     (green) — it's a "next action" hint, not a "currently viewing" mark. */
  border: none;
  border-left: 3px solid ${(p) => (p.$focus ? p.theme.colors.tertiary : 'transparent')};
  padding-left: ${(p) => (p.$focus ? 'calc(1.25rem - 3px)' : '1.25rem')};
  background: ${(p) =>
    p.$focus
      ? `color-mix(in oklab, ${p.theme.colors.tertiary} 6%, transparent)`
      : 'transparent'};
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.15s,
    padding-left 0.15s ease,
    padding-right 0.15s ease;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${(p) =>
      p.$focus
        ? `color-mix(in oklab, ${p.theme.colors.tertiary} 10%, transparent)`
        : `${p.theme.colors.accent}06`};
    padding-left: ${(p) => (p.$focus ? 'calc(1.25rem - 3px + 4px)' : 'calc(1.25rem + 4px)')};
    padding-right: calc(1.25rem - 4px);
  }
`;

export const LessonContent = styled.div`
  flex: 1;
`;

export const LessonName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.4;
`;

export const LessonDescription = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.4;
  margin-top: 0.125rem;
`;

// ── Quiz row ─────────────────────────────────────────

export const QuizRow = styled.button<{ $locked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 1.25rem;
  border: none;
  background: transparent;
  font-family: inherit;
  cursor: ${(p) => (p.$locked ? 'default' : 'pointer')};
  opacity: ${(p) => (p.$locked ? 0.4 : 1)};
  text-align: left;
  transition:
    background 0.15s,
    padding-left 0.15s ease,
    padding-right 0.15s ease;

  ${(p) =>
    !p.$locked &&
    `
    &:hover {
      background: ${p.theme.colors.accent}06;
      padding-left: calc(1.25rem + 4px);
      padding-right: calc(1.25rem - 4px);
    }
  `}
`;

const quizIconColor = ({
  variant,
  colors,
}: {
  variant: QuizIconVariant;
  colors: { success: string; accent: string; error: string; tertiary: string; muted: string };
}) => {
  switch (variant) {
    case 'mastered':
      return colors.success;
    case 'passed':
      return colors.accent;
    case 'needs_review':
      return colors.error;
    case 'locked':
      return colors.muted;
    default:
      return colors.tertiary;
  }
};

export const QuizIcon = styled.span<{ $variant: QuizIconVariant }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) =>
    p.$variant === 'locked'
      ? p.theme.colors.surfaceBorder
      : `${quizIconColor({ variant: p.$variant, colors: p.theme.colors })}18`};
  color: ${(p) => quizIconColor({ variant: p.$variant, colors: p.theme.colors })};
`;

export const QuizLabel = styled.span`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const QuizBadge = styled.span<{ $tier: QuizMasteryTier }>`
  padding: 0.1875rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: ${(p) =>
    p.$tier === 'mastered'
      ? `${p.theme.colors.success}20`
      : p.$tier === 'passed'
        ? `${p.theme.colors.accent}20`
        : `${p.theme.colors.error}20`};
  color: ${(p) =>
    p.$tier === 'mastered'
      ? p.theme.colors.success
      : p.$tier === 'passed'
        ? p.theme.colors.accent
        : p.theme.colors.error};
`;

export const ReviewDueBadge = styled.span`
  padding: 0.125rem 0.4375rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  background: ${(p) => `${p.theme.colors.warning}18`};
  color: ${(p) => p.theme.colors.warning};
  flex-shrink: 0;
`;

export const TakeQuizBadge = styled.span`
  padding: 0.125rem 0.4375rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  background: ${(p) => `${p.theme.colors.accent}18`};
  color: ${(p) => p.theme.colors.accent};
  flex-shrink: 0;
`;

// TakeQuizAction removed — use RowArrow

// ── Danger zone ──────────────────────────────────────

export const DangerZone = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

export const ArchiveLink = styled(TextAction)`
  margin-bottom: 0.75rem;
  display: block;
`;
