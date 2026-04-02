import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Title = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const ProgressBar = styled.div`
  display: flex;
  gap: 0.375rem;
`;

export const ProgressDot = styled.div<{ $active: boolean; $answered: boolean }>`
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background: ${(p) =>
    p.$active
      ? p.theme.colors.accent
      : p.$answered
        ? p.theme.colors.accent + '55'
        : p.theme.colors.border};
  transition: background 0.2s ease;
`;

export const QuestionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const QuestionLabel = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

export const QuestionHint = styled.span`
  display: block;
  font-size: 0.8125rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.muted};
  margin-top: 0.125rem;
`;

export const QuestionCounter = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
`;
