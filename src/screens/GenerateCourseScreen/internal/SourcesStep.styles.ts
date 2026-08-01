import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 4vh;

  ${(p) => p.theme.media.tablet} {
    padding-top: 1rem;
    gap: 1.5rem;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 3.25rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.03em;
  line-height: 1.05;

  ${(p) => p.theme.media.tabletLarge} {
    font-size: 2.5rem;
  }

  ${(p) => p.theme.media.mobile} {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.0625rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  max-width: 560px;
`;

// ── URL input row — one composed control ────────────────
//
// Input + "Add link" share a single bordered field: the button is the
// field's suffix action, so heights and baselines can't drift apart.

export const UrlRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const UrlField = styled.div<{ $error: boolean }>`
  display: flex;
  align-items: stretch;
  overflow: hidden;
  border: 1px solid ${(p) => (p.$error ? p.theme.colors.error : p.theme.colors.border)};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

  &:focus-within {
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colorsLib.primary}10;
  }
`;

export const UrlFieldIcon = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  color: ${(p) => p.theme.colors.muted};

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const UrlInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: 0.875rem 0.75rem 0.875rem 0.625rem;
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  font-size: 0.9375rem;

  &::placeholder {
    opacity: 0.4;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const UrlAddButton = styled.button`
  all: unset;
  box-sizing: border-box;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0 1.125rem;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  color: ${(p) => p.theme.colors.accent};
  background: ${(p) => p.theme.colors.surface};
  border-left: 1px solid ${(p) => p.theme.colors.border};
  transition:
    color 0.15s ease,
    background 0.15s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      background: ${(p) => p.theme.colors.accentMuted};
    }
  }

  /* Ring sits inside the field (the wrapper clips overflow). */
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: -2px;
  }

  &:disabled {
    cursor: not-allowed;
    color: ${(p) => p.theme.colors.muted};
    opacity: 0.55;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const UrlSpinner = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid ${(p) => p.theme.colors.border};
  border-top-color: ${(p) => p.theme.colors.accent};
  animation: ${spin} 0.7s linear infinite;
`;

export const UrlError = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.error};
  line-height: 1.4;
`;

// ── "Add more sources" (collapsed add-UI, post-analysis) ─

export const AddMoreRow = styled.div`
  display: flex;
`;

export const AddMoreButton = styled.button`
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  border: 1px dashed ${(p) => p.theme.colors.surfaceBorder};
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      border-color: ${(p) => p.theme.colors.tertiary};
      color: ${(p) => p.theme.colors.foreground};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const AddMoreHint = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
  margin-top: -1.25rem;
`;

// ── Analyze phase ───────────────────────────────────────

export const AnalyzeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;

  ${(p) => p.theme.media.mobile} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const AnalyzeHint = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

// ── Error card ──────────────────────────────────────────

export const ErrorCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid color-mix(in srgb, ${(p) => p.theme.colors.error} 35%, ${(p) => p.theme.colors.surfaceBorder});
  box-shadow: var(--shadow-card);
`;

export const ErrorTitle = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const ErrorBody = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
`;

export const ErrorActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
`;

// ── Mode-switch escape (documents → standard creation) ──

export const SwitchModeRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
`;

export const SwitchModeButton = styled.button`
  all: unset;
  box-sizing: border-box;
  font-size: 0.9375rem;
  font-style: italic;
  font-family: var(--font-heading-serif), Georgia, serif;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  transition: color 0.15s ease;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.accent};
      text-decoration: underline;
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

// ── Analysis panel ──────────────────────────────────────

export const AnalysisPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const PanelDivider = styled.hr`
  border: none;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  margin: 0.5rem 0 0.75rem;
`;

export const PanelEyebrow = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const TopicChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const TopicChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  color: ${(p) => p.theme.colors.foreground};
`;

export const SizeLine = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.6;

  strong {
    font-weight: 600;
  }
`;

export const ModeNote = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  padding: 0.75rem 1rem;
  border-left: 2px solid ${(p) => p.theme.colors.tertiary};
  background: ${(p) => p.theme.colorsLib.secondary + '08'};
  border-radius: 0 8px 8px 0;
`;

export const WarningList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  li {
    font-size: 0.875rem;
    color: ${(p) => p.theme.colors.warning};
    line-height: 1.5;
  }
`;

export const QuestionsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const QuestionsCaption = styled.p`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
`;

export const QuestionsList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;

  li {
    font-size: 0.875rem;
    color: ${(p) => p.theme.colors.muted};
    line-height: 1.55;
  }
`;

export const GoalBlock = styled.div`
  margin-top: 0.25rem;
`;

// ── Fidelity control — a labeled, obviously-interactive card ──

export const FidelityCardAction = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.muted};
  transition: color 0.15s ease;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const FidelityCard = styled.button`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  background: ${(p) => p.theme.colorsLib.secondary + '08'};
  border: 1px solid ${(p) => p.theme.colors.tertiary};
  transition:
    box-shadow 0.2s ease,
    border-color 0.15s ease;

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      box-shadow: var(--shadow-lift);

      ${FidelityCardAction} {
        color: ${(p) => p.theme.colors.tertiary};
      }
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const FidelityCardBody = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const FidelityCardEyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const FidelityCardValue = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const FidelityCardDescription = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const ConfirmRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;

  ${(p) => p.theme.media.mobile} {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;
