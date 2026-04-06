import Link from 'next/link';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 2rem 3rem 2rem;

  ${(p) => p.theme.media.tablet} {
    padding: 2rem 1.25rem 3rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 1.5rem;
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: ${(p) => p.theme.colors.foreground};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.muted};
  }
`;

export const DeleteLink = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    text-decoration: underline;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const Eyebrow = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.5rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.025em;
  line-height: 1.1;

  ${(p) => p.theme.media.tablet} {
    font-size: 1.75rem;
  }

  ${(p) => p.theme.media.mobile} {
    font-size: 1.5rem;
  }
`;

export const Goal = styled.p`
  font-size: 1.0625rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  max-width: 600px;
`;

export const Meta = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

/* ── Progress Section ─────────────────────────────── */

export const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 0;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const ProgressHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
`;

export const ProgressLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.muted};
`;

export const ProgressValue = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.foreground};
`;

export const ProgressBarTrack = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.border};
`;

export const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.accent};
  width: ${(p) => p.$percent}%;
  transition: width 300ms ease;
`;

/* ── Section Headers ──────────────────────────────── */

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SectionEyebrow = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

/* ── Modules ──────────────────────────────────────── */

export const Modules = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ModuleHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

export const ModuleHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const ModuleCounter = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
  font-family: inherit;
`;

export const ModuleTitle = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.0625rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: ${(p) => p.theme.colors.foreground};
`;

export const ModuleProgressText = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
  margin-top: 0.25rem;
`;

export const ModuleDescription = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

/* ── Lesson List ──────────────────────────────────── */

export const LessonList = styled.ol`
  list-style: none;
  counter-reset: lesson;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const LessonItem = styled.li<{
  $status: 'completed' | 'in_progress' | 'default';
}>`
  counter-increment: lesson;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.surface};
    border-color: ${(p) => p.theme.colors.border};
  }

  &::before {
    content: ${(p) => (p.$status === 'completed' ? "'\\2713'" : 'counter(lesson)')};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 0.6875rem;
    font-weight: 600;
    margin-top: 1px;
    transition:
      background 0.15s,
      border-color 0.15s,
      color 0.15s;

    ${(p) => {
      switch (p.$status) {
        case 'completed':
          return `
            background: ${p.theme.colors.success};
            border: 1px solid ${p.theme.colors.success};
            color: #fff;
          `;
        case 'in_progress':
          return `
            background: transparent;
            border: 2px solid ${p.theme.colors.accent};
            color: ${p.theme.colors.accent};
          `;
        default:
          return `
            background: ${p.theme.colors.background};
            border: 1px solid ${p.theme.colors.border};
            color: ${p.theme.colors.muted};
          `;
      }
    }}
  }
`;

export const LessonContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
`;

export const LessonName = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const LessonDescription = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

/* ── Quiz Row ─────────────────────────────────────── */

export const QuizRow = styled.button<{ $locked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
  background: ${(p) => p.theme.colors.background};
  font-family: inherit;
  text-align: left;
  margin-top: 0.5rem;
  cursor: ${(p) => (p.$locked ? 'default' : 'pointer')};
  opacity: ${(p) => (p.$locked ? 0.5 : 1)};
  transition:
    border-color 0.15s,
    background 0.15s,
    opacity 0.15s;

  ${(p) =>
    !p.$locked &&
    `
    &:hover {
      border-color: ${p.theme.colors.tertiary};
      background: ${p.theme.colorsLib.secondary}08;
    }
  `}
`;

export const QuizIcon = styled.span<{ $locked?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.6875rem;
  font-weight: 700;
  background: ${(p) =>
    p.$locked ? p.theme.colors.border : `${p.theme.colors.tertiary}20`};
  color: ${(p) =>
    p.$locked ? p.theme.colors.muted : p.theme.colors.tertiary};
`;

export const QuizLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.theme.colors.foreground};
`;

export type QuizBadgeTier = 'needs_review' | 'passed' | 'mastered';

export const ReviewIndicator = styled.span`
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: ${(p) => `${p.theme.colors.warning}20`};
  color: ${(p) => p.theme.colors.warning};
`;

export const QuizBadge = styled.span<{ $tier: QuizBadgeTier }>`
  margin-left: auto;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
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

/* ── Empty / Loading ──────────────────────────────── */

export const EmptyState = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  padding: 6rem 2rem;
  animation: ${fadeIn} 0.4s ease;
`;
