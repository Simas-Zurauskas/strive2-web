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

// Goal-type chip — sits above the Eyebrow on ClarifyStep. Renders as a soft
// "Designed as a course to {verb} {noun}" sentence followed by an inline row
// of selectable chips. Mirrors the existing DepthContextChip's visual language
// (surfaceBorder, italic-serif emphasis on the active state) so the two
// chips read as the same family of contextual hints.
export const GoalTypeBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 0.625rem;
  background: ${(p) => p.theme.colors.surface};
`;

export const GoalTypeLabel = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.4;

  strong {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-style: italic;
    font-weight: 500;
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const GoalTypeChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

export const GoalTypeChip = styled.button<{ $active: boolean }>`
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 0.8125rem;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  padding: 0.3125rem 0.75rem;
  border-radius: 999px;
  border: 1px solid
    ${(p) => (p.$active ? p.theme.colors.accent : p.theme.colors.surfaceBorder)};
  background: ${(p) =>
    p.$active ? p.theme.colors.accentMuted : 'transparent'};
  color: ${(p) => (p.$active ? p.theme.colors.foreground : p.theme.colors.muted)};
  cursor: ${(p) => (p.$active ? 'default' : 'pointer')};
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
    color: ${(p) => p.theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
