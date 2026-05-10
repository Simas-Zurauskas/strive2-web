import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-bottom: 1.5rem;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Quiet "Designed to {verb} {noun}" context line. Sits below the
// Subtitle, no border or chip — purpose selection already happened on
// the dedicated PurposeStep, so this is purely informational. Italic-
// serif emphasis on the verb + noun keeps the wizard's heading
// vocabulary consistent.
export const GoalTypeContext = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.4;
  margin: 0;

  strong {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-style: italic;
    font-weight: 500;
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const Title = styled.h2`
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
`;

export const Subtitle = styled.p`
  font-size: 1.0625rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
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
    p.$active ? p.theme.colors.accent : p.$answered ? p.theme.colorsLib.gray200 : p.theme.colors.border};
  transition: background 0.2s ease;
`;

export const QuestionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

export const QuestionLabel = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.4;
`;

export const QuestionHint = styled.span`
  display: block;
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.muted};
  margin-top: 0.375rem;
`;

export const QuestionCounter = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;
