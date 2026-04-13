import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: stretch;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const Accent = styled.div`
  width: 4px;
  background: ${(p) => p.theme.colors.accent};
  flex-shrink: 0;
`;

export const Content = styled.div`
  flex: 1;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
`;

export const Label = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.theme.colors.accent};
`;

export const CourseName = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LessonInfo = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.375rem;
`;

export const ProgressBarTrack = styled.div`
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.surfaceBorder};
`;

export const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.success};
  width: ${(p) => p.$percent}%;
  transition: width 300ms ease;
`;

export const ProgressText = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
`;

export const Action = styled.div`
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  flex-shrink: 0;

  ${(p) => p.theme.media.tablet} {
    display: none;
  }
`;
