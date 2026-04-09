import styled, { keyframes } from 'styled-components';
import type { QuizMasteryTier } from '@/api/types';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// ── Layout ────────────────────────────────────────────

export const Container = styled.div`
  min-height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 2rem 2rem 3rem;

  ${(p) => p.theme.media.tablet} {
    padding: 2rem 1.25rem 3rem;
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 1.5rem;
`;

export const DevResetButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: none;
  border: 1px dashed ${(p) => p.theme.colors.border};
  border-radius: 4px;
  font-size: 0.6875rem;
  font-family: inherit;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  opacity: 0.5;
  transition:
    opacity 0.15s,
    color 0.15s,
    border-color 0.15s;

  &:hover {
    opacity: 1;
    color: #e55;
    border-color: #e55;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.muted};
  }
`;

// ── Header ────────────────────────────────────────────

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

export const Subtitle = styled.p`
  font-size: 1.0625rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
`;

// ── Loading / pre-quiz ────────────────────────────────

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 0;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.muted};
  animation: ${fadeIn} 0.4s ease;
`;

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${(p) => p.theme.colors.border};
  border-top-color: ${(p) => p.theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const DescriptionText = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
`;

export const StartButton = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: ${(p) => p.theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.08);
  transition:
    background 0.15s,
    box-shadow 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.accentHover};
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.15),
      0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.98);
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
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  white-space: nowrap;
  font-weight: 500;
`;

// ── Question ──────────────────────────────────────────

export const QuestionCard = styled.div`
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

export const QuestionText = styled.p`
  padding: 1.5rem 1.75rem;
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.55;
  letter-spacing: -0.01em;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.75rem;
  gap: 0.625rem;
`;

type OptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'dimmed';

export const Option = styled.button<{ $state: OptionState }>`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1.125rem 1.25rem;
  border-radius: 8px;
  border: ${(p) =>
    p.$state === 'selected'
      ? `2px solid ${p.theme.colors.accent}`
      : p.$state === 'correct'
        ? `2px solid ${p.theme.colors.success}`
        : p.$state === 'incorrect'
          ? `2px solid ${p.theme.colors.error}`
          : `1px solid ${p.theme.colors.surfaceBorder}`};
  background: ${(p) =>
    p.$state === 'selected'
      ? `${p.theme.colors.accent}06`
      : p.$state === 'correct'
        ? `${p.theme.colors.success}08`
        : p.$state === 'incorrect'
          ? `${p.theme.colors.error}08`
          : p.theme.colors.background};
  color: ${(p) => (p.$state === 'dimmed' ? p.theme.colors.muted : p.theme.colors.foreground)};
  font-size: 0.9375rem;
  font-family: inherit;
  text-align: left;
  cursor: ${(p) => (p.$state === 'default' || p.$state === 'selected' ? 'pointer' : 'default')};
  line-height: 1.5;
  transition:
    border-color 0.15s,
    background 0.15s;

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
  font-size: 0.6875rem;
  font-weight: 700;
  background: ${(p) =>
    p.$state === 'selected'
      ? p.theme.colors.accent
      : p.$state === 'correct'
        ? p.theme.colors.success
        : p.$state === 'incorrect'
          ? p.theme.colors.error
          : p.theme.colors.background};
  color: ${(p) =>
    p.$state === 'selected' || p.$state === 'correct' || p.$state === 'incorrect'
      ? '#fff'
      : p.theme.colors.muted};
  border: 1px solid
    ${(p) =>
      p.$state === 'selected'
        ? p.theme.colors.accent
        : p.$state === 'correct'
          ? p.theme.colors.success
          : p.$state === 'incorrect'
            ? p.theme.colors.error
            : p.theme.colors.border};
`;

export const Explanation = styled.div`
  padding: 1rem 1.75rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  font-size: 0.8125rem;
  line-height: 1.5;
`;

export const SourceTag = styled.span`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: ${(p) => `${p.theme.colors.tertiary}15`};
  border: 1px solid ${(p) => `${p.theme.colors.tertiary}30`};
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const SourceLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  margin-top: 0.625rem;
  font-size: 0.8125rem;
`;

export const NextButton = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 1.75rem;
  background: ${(p) => p.theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.08);
  transition:
    background 0.15s,
    box-shadow 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.accentHover};
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.15),
      0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

// ── Results ───────────────────────────────────────────

export const ResultsHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
`;

export const ScoreDisplay = styled.div`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 4rem;
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1;
  color: ${(p) => p.theme.colors.foreground};

  ${(p) => p.theme.media.mobile} {
    font-size: 3rem;
  }
`;

export const MasteryBadge = styled.span<{ $tier: QuizMasteryTier }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
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

export const NextReviewInfo = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ResultItem = styled.div<{ $correct: boolean }>`
  border-radius: 8px;
  border: 1px solid
    ${(p) => (p.$correct ? `${p.theme.colors.success}40` : `${p.theme.colors.error}40`)};
  background: ${(p) => p.theme.colors.surface};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

export const ResultItemHeader = styled.div<{ $correct: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: ${(p) =>
    p.$correct ? `${p.theme.colors.success}06` : `${p.theme.colors.error}06`};
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.5;
`;

export const ResultIndicator = styled.span<{ $correct: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: 1px;
  background: ${(p) => (p.$correct ? p.theme.colors.success : p.theme.colors.error)};
  color: #fff;
`;

export const ResultExplanation = styled.div`
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.muted};
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 1.75rem;
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition:
    border-color 0.15s,
    color 0.15s,
    background 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.tertiary};
    color: ${(p) => p.theme.colors.tertiary};
    background: ${(p) => `${p.theme.colorsLib.secondary}08`};
  }

  &:active {
    transform: scale(0.98);
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
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
`;
