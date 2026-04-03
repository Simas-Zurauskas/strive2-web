import styled from 'styled-components';

export const Container = styled.nav`
  width: 260px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.surface};
  border-right: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;

  @media (max-width: 1023px) {
    position: static;
    height: 100%;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`;

export const BackLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  text-decoration: none;
  cursor: pointer;
  min-width: 0;
  flex: 1;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const CourseName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  font-size: 0.875rem;

  &:hover {
    background: ${(p) => p.theme.colors.background};
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const Tree = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
`;

export const ModuleHeader = styled.button<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${(p) => p.theme.colors.background};
  }
`;

export const Chevron = styled.span<{ $expanded: boolean }>`
  display: inline-flex;
  font-size: 0.625rem;
  transition: transform 150ms ease;
  transform: ${(p) => (p.$expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
  color: ${(p) => p.theme.colors.muted};
`;

export const ModuleLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LessonList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LessonItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.375rem 0.75rem 0.375rem 1.5rem;
  border: none;
  background: ${(p) => (p.$active ? p.theme.colors.background : 'transparent')};
  color: ${(p) => (p.$active ? p.theme.colors.accent : p.theme.colors.foreground)};
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  line-height: 1.4;

  &:hover {
    background: ${(p) => p.theme.colors.background};
  }
`;

export type LessonDotState = 'completed' | 'in_progress' | 'not_started' | 'not_generated' | 'active';

const dotStyles = (p: { $state: LessonDotState; theme: { colors: Record<string, string> } }) => {
  switch (p.$state) {
    case 'completed':
      return `background: ${p.theme.colors.success}; border: 1.5px solid ${p.theme.colors.success};`;
    case 'in_progress':
      return `background: ${p.theme.colors.accent}40; border: 1.5px solid ${p.theme.colors.accent};`;
    case 'active':
      return `background: ${p.theme.colors.accent}; border: 1.5px solid ${p.theme.colors.accent};`;
    case 'not_started':
      return `background: transparent; border: 1.5px solid ${p.theme.colors.muted};`;
    case 'not_generated':
      return `background: transparent; border: 1.5px dashed ${p.theme.colors.border};`;
  }
};

export const LessonDot = styled.span<{ $state: LessonDotState }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  ${dotStyles}
`;

export const LessonName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ModuleProgress = styled.span`
  margin-left: auto;
  font-size: 0.6875rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
`;

export const BookmarkIcon = styled.span`
  margin-left: 0.25rem;
  font-size: 0.625rem;
  color: ${(p) => p.theme.colors.accent};
  flex-shrink: 0;
`;

export const Footer = styled.div`
  padding: 0.75rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const FooterText = styled.span``;

export const FooterAccent = styled.span`
  color: ${(p) => p.theme.colors.accent};
  font-weight: 500;
`;

export const ProgressBarTrack = styled.div`
  width: 100%;
  height: 3px;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.border};
`;

export const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.success};
  width: ${(p) => p.$percent}%;
  transition: width 300ms ease;
`;

// ── Module Quiz ───────────────────────────────────────

export const QuizItem = styled.button<{ $locked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.375rem 0.5rem 0.375rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: inherit;
  text-align: left;
  background: none;
  border: none;
  color: ${(p) => (p.$locked ? p.theme.colors.muted : p.theme.colors.foreground)};
  cursor: ${(p) => (p.$locked ? 'default' : 'pointer')};
  opacity: ${(p) => (p.$locked ? 0.5 : 1)};

  ${(p) => !p.$locked && `&:hover { background: ${p.theme.colors.background}; }`}
`;

export const QuizIcon = styled.span`
  font-size: 0.625rem;
  flex-shrink: 0;
`;

export type QuizBadgeTier = 'needs_review' | 'passed' | 'mastered';

export const QuizBadge = styled.span<{ $tier: QuizBadgeTier }>`
  margin-left: auto;
  padding: 0.0625rem 0.375rem;
  border-radius: 9999px;
  font-size: 0.5625rem;
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
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;
