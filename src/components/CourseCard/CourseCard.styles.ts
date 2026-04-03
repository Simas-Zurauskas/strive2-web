import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

export const CourseName = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.01em;
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`;

export const MetaText = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const GeneratingBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
  border-radius: 6px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid ${(p) => p.theme.colors.border};
  border-top-color: ${(p) => p.theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
`;

export const GeneratingText = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.accent};
`;

export const Goal = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
`;

export const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-top: 0.75rem;
`;

export const ProgressTrack = styled.div`
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.border};
`;

export const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.success};
  width: ${(p) => p.$percent}%;
  transition: width 300ms ease;
`;

export const ProgressLabel = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
`;
