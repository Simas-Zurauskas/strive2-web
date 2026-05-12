import styled from 'styled-components';
import { thinScrollbar } from '@/theme';
import type { QuizMasteryTier } from '@/api/types';
import type { QuizIconVariant } from '@/types';

export const Container = styled.nav`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.surface};
  border-right: 1px solid ${(p) => p.theme.colors.surfaceBorder};

  ${(p) => p.theme.media.desktop} {
    border-right: none;
  }
`;

// ── Header ───────────────────────────────────────────

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1.25rem 1.25rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  flex-shrink: 0;
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
`;

export const CollapseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  flex-shrink: 0;
  margin-top: -2px;
  transition:
    background 0.15s,
    color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.background};
      color: ${(p) => p.theme.colors.foreground};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const CourseName = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.01em;
  line-height: 1.3;
  flex: 1;
`;

export const CourseNameLink = styled.button`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.01em;
  line-height: 1.3;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  text-decoration: underline;
  text-decoration-color: ${(p) => p.theme.colors.surfaceBorder};
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  /* Shrink to text width — without this the button stretches to fill
     the column-flex cross-axis of HeaderContent and the hover area
     extends across the entire empty space to the right of the title. */
  align-self: flex-start;
  max-width: 100%;
  transition:
    text-decoration-color 0.15s,
    text-decoration-thickness 0.15s,
    color 0.15s;

  &:hover {
    text-decoration-color: ${(p) => p.theme.colors.accent};
    text-decoration-thickness: 2px;
    color: ${(p) => p.theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 4px;
    border-radius: 2px;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const MetaText = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.01em;
`;

// ── Progress bar (in header) ──────────────────────────

export const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ProgressPercent = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.accent};
  flex-shrink: 0;
`;

export const ProgressBarTrack = styled.div`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.surfaceBorder};
`;

export const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.accent};
  width: ${(p) => p.$percent}%;
  transition: width 400ms ease;
`;

export const ReviewsDueBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.warning};
`;

// ── Module tree ───────────────────────────────────────

export const Tree = styled.div`
  flex: 1;
  overflow-y: auto;
  /* Prevent scroll chaining — without this, scrolling past the tree's
     top or bottom on mobile pushes the lesson body in the background
     up/down. Same pattern as the chat panel's scrolling area. */
  overscroll-behavior: contain;
  /* Allow only vertical pan here; horizontal gestures propagate to the
     parent (SidebarPanelFixed) so the swipe-to-close drag works even
     when the touch starts on a lesson row. Without this, the browser
     captures the touch for native vertical scrolling and never hands
     horizontal movement to framer-motion's drag. */
  touch-action: pan-y;
  padding: 0.5rem 0;
  ${thinScrollbar}
`;

export const ModuleSection = styled.div`
  & + & {
    border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }
`;

export const ModuleHeader = styled.button<{ $expanded: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1.25rem;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  line-height: 1.4;
  transition: background 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.background};
    }
  }
`;

export const ChevronIcon = styled.span<{ $expanded: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  margin-top: 3px;
  transition: transform 150ms ease;
  transform: ${(p) => (p.$expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
  color: ${(p) => p.theme.colors.muted};
`;

export const ModuleLabel = styled.span`
  flex: 1;
  line-height: 1.4;
`;

export const ModuleProgress = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
  margin-top: 1px;
`;

// Inline quiz indicator that surfaces on a COLLAPSED module header so the
// user knows there's an actionable quiz inside without having to expand.
// Variants:
//   - not-taken     → tertiary (gold) — "available, take it"
//   - needs_review  → warning  (amber) — "due", subtle pulse to earn the click
// `mastered`/`passed`/`locked` are intentionally not surfaced here: passed
// quizzes don't need a nudge, and `locked` is implied by the closed module.
export const HeaderQuizBadge = styled.span<{ $variant: 'not-taken' | 'needs_review' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: 0.5rem;
  margin-top: 1px;
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
        animation: headerQuizPulse 2.4s ease-in-out infinite;
      }
      @keyframes headerQuizPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.55; }
      }
    `}
`;

// ── Lesson list ──────────────────────────────────────

export const LessonList = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 0.5rem;
`;

export const LessonItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
  padding: 0.4375rem 1.25rem 0.4375rem 2rem;
  border: none;
  border-left: 3px solid ${(p) => (p.$active ? p.theme.colors.accent : 'transparent')};
  padding-left: ${(p) => (p.$active ? 'calc(2rem - 3px)' : '2rem')};
  background: ${(p) => (p.$active ? p.theme.colors.background : 'transparent')};
  color: ${(p) => (p.$active ? p.theme.colors.foreground : p.theme.colors.muted)};
  font-size: 0.8125rem;
  font-weight: ${(p) => (p.$active ? 500 : 400)};
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  line-height: 1.4;
  transition:
    background 0.15s,
    color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
      background: ${(p) => p.theme.colors.background};
    }
  }
`;

export const LessonName = styled.span`
  flex: 1;
  line-height: 1.4;
`;

export const BookmarkIcon = styled.span`
  margin-left: auto;
  flex-shrink: 0;
  color: ${(p) => p.theme.colors.tertiary};
  display: inline-flex;
  margin-top: 2px;
`;

// ── Module Quiz ───────────────────────────────────────

export const QuizItem = styled.button<{ $locked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.4375rem 1.25rem 0.4375rem 2rem;
  font-size: 0.8125rem;
  font-weight: 400;
  font-family: inherit;
  text-align: left;
  background: none;
  border: none;
  color: ${(p) => (p.$locked ? p.theme.colors.muted : p.theme.colors.foreground)};
  cursor: ${(p) => (p.$locked ? 'default' : 'pointer')};
  opacity: ${(p) => (p.$locked ? 0.4 : 1)};
  transition:
    background 0.15s,
    opacity 0.15s;

  ${(p) =>
    !p.$locked &&
    `${p.theme.media.hover} { &:hover { background: ${p.theme.colors.background}; } }`}
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

export const QuizIconCircle = styled.span<{ $variant: QuizIconVariant }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) =>
    p.$variant === 'locked'
      ? p.theme.colors.surfaceBorder
      : `${quizIconColor({ variant: p.$variant, colors: p.theme.colors })}20`};
  color: ${(p) => quizIconColor({ variant: p.$variant, colors: p.theme.colors })};
`;

export const QuizBadge = styled.span<{ $tier: QuizMasteryTier }>`
  margin-left: auto;
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
  margin-left: auto;
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

export const ReviewDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.warning};
  flex-shrink: 0;

  @media (prefers-reduced-motion: no-preference) {
    animation: reviewPulse 2s ease-in-out infinite;
  }

  @keyframes reviewPulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`;
