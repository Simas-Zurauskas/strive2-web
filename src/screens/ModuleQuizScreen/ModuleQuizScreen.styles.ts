import styled from 'styled-components';

// ── Layout ────────────────────────────────────────────

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 2rem 1rem;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 640px;
`;

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

export const Subtitle = styled.p`
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.875rem;
  margin-bottom: 2rem;
`;

// ── Loading / pre-quiz ────────────────────────────────

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 0;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.875rem;
`;

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${(p) => p.theme.colors.border};
  border-top-color: ${(p) => p.theme.colors.accent};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const StartButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${(p) => p.theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ── Progress bar ──────────────────────────────────────

export const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const ProgressBarTrack = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: ${(p) => p.theme.colors.accent};
  border-radius: 3px;
  transition: width 0.3s ease;
`;

export const ProgressText = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  white-space: nowrap;
`;

// ── Question ──────────────────────────────────────────

export const QuestionCard = styled.div`
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

export const QuestionText = styled.p`
  padding: 1.25rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1.25rem 1.25rem;
  gap: 0.5rem;
`;

type OptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'dimmed';

export const Option = styled.button<{ $state: OptionState }>`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(p) =>
    p.$state === 'selected'
      ? p.theme.colors.accent
      : p.$state === 'correct'
        ? p.theme.colors.success
        : p.$state === 'incorrect'
          ? p.theme.colors.error
          : p.theme.colors.border};
  background: ${(p) =>
    p.$state === 'selected'
      ? `${p.theme.colors.accent}10`
      : p.$state === 'correct'
        ? `${p.theme.colors.success}10`
        : p.$state === 'incorrect'
          ? `${p.theme.colors.error}10`
          : p.theme.colors.background};
  color: ${(p) => (p.$state === 'dimmed' ? p.theme.colors.muted : p.theme.colors.foreground)};
  font-size: 0.9375rem;
  font-family: inherit;
  text-align: left;
  cursor: ${(p) => (p.$state === 'default' || p.$state === 'selected' ? 'pointer' : 'default')};
  line-height: 1.4;
  transition: border-color 0.15s, background 0.15s;

  ${(p) =>
    (p.$state === 'default' || p.$state === 'selected') &&
    `&:hover {
      border-color: ${p.theme.colors.accent};
      background: ${p.theme.colors.surface};
    }`}
`;

export const OptionLetter = styled.span<{ $state: OptionState }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${(p) =>
    p.$state === 'selected'
      ? p.theme.colors.accent
      : p.$state === 'correct'
        ? p.theme.colors.success
        : p.$state === 'incorrect'
          ? p.theme.colors.error
          : p.theme.colors.surface};
  color: ${(p) =>
    p.$state === 'selected' || p.$state === 'correct' || p.$state === 'incorrect' ? '#fff' : p.theme.colors.muted};
  border: 1px solid ${(p) =>
    p.$state === 'selected'
      ? p.theme.colors.accent
      : p.$state === 'correct'
        ? p.theme.colors.success
        : p.$state === 'incorrect'
          ? p.theme.colors.error
          : p.theme.colors.border};
`;

export const Explanation = styled.div`
  padding: 1rem 1.25rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-size: 0.8125rem;
  line-height: 1.5;
`;

export const SourceTag = styled.span`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const NextButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.25rem;
  background: ${(p) => p.theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }
`;

// ── Results ───────────────────────────────────────────

export const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const ScoreDisplay = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export const MasteryBadge = styled.span<{ $tier: 'needs_review' | 'passed' | 'mastered' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

export const NextReviewInfo = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  margin-top: 0.25rem;
`;

export const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

export const ResultItem = styled.div<{ $correct: boolean }>`
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$correct ? p.theme.colors.success : p.theme.colors.error)};
  overflow: hidden;
`;

export const ResultItemHeader = styled.div<{ $correct: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${(p) =>
    p.$correct ? `${p.theme.colors.success}08` : `${p.theme.colors.error}08`};
  font-size: 0.875rem;
  font-weight: 500;
`;

export const ResultIndicator = styled.span<{ $correct: boolean }>`
  font-size: 0.875rem;
  color: ${(p) => (p.$correct ? p.theme.colors.success : p.theme.colors.error)};
`;

export const ResultExplanation = styled.div`
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.25rem;
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PreviousAttempt = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-size: 0.8125rem;
  margin-bottom: 1.5rem;
`;
