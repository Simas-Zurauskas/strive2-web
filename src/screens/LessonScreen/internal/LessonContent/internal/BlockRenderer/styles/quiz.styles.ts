import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const QuizContainer = styled.div`
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.3s ease-out;
`;

export const QuizHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: ${(p) => p.theme.colors.warning}0a;
  border-bottom: 1px solid ${(p) => p.theme.colors.warning}20;
  color: ${(p) => p.theme.colors.warning};
`;

export const QuizHeaderIcon = styled.span`
  display: flex;

  svg {
    width: 13px;
    height: 13px;
    stroke-width: 2px;
  }
`;

export const QuizHeaderLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const QuizBody = styled.div`
  padding: 1.5rem 1.25rem;
`;

export const QuizQuestion = styled.p`
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 1.0625em;
  font-weight: 500;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.foreground};
  margin-bottom: 1.5rem;
`;

export const QuizOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

type QuizOptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'dimmed';

export const QuizOption = styled.button<{ $state: QuizOptionState }>`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border: none;
  background: ${(p) => {
    switch (p.$state) {
      case 'selected': return `${p.theme.colors.accent}12`;
      case 'correct': return `${p.theme.colors.success}12`;
      case 'incorrect': return `${p.theme.colors.error}12`;
      default: return 'transparent';
    }
  }};
  color: ${(p) => (p.$state === 'dimmed' ? p.theme.colors.muted : p.theme.colors.foreground)};
  font-size: 0.9375em;
  font-family: inherit;
  text-align: left;
  cursor: ${(p) => (p.$state === 'default' || p.$state === 'selected' ? 'pointer' : 'default')};
  line-height: 1.4;
  transition: background 0.15s ease, box-shadow 0.15s ease;

  ${(p) =>
    p.$state === 'default' &&
    `&:hover {
      background: ${p.theme.colors.surface};
      box-shadow: 0 0 0 1px ${p.theme.colors.border};
    }`}

  ${(p) =>
    p.$state === 'selected' &&
    `&:hover {
      background: ${p.theme.colors.accent}18;
    }`}
`;

export const QuizOptionLetter = styled.span<{ $state: QuizOptionState }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 0.6875rem;
  font-weight: 700;
  transition: all 0.2s ease;

  background: ${(p) => {
    switch (p.$state) {
      case 'selected': return p.theme.colors.accent;
      case 'correct': return p.theme.colors.success;
      case 'incorrect': return p.theme.colors.error;
      default: return 'transparent';
    }
  }};
  color: ${(p) => {
    switch (p.$state) {
      case 'selected':
      case 'correct':
      case 'incorrect':
        return '#fff';
      case 'dimmed': return p.theme.colors.border;
      default: return p.theme.colors.muted;
    }
  }};
  border: 1px solid ${(p) => {
    switch (p.$state) {
      case 'selected': return p.theme.colors.accent;
      case 'correct': return p.theme.colors.success;
      case 'incorrect': return p.theme.colors.error;
      case 'dimmed': return p.theme.colors.border;
      default: return 'currentColor';
    }
  }};
`;

export const QuizConfirmButton = styled.button`
  margin-top: 1.25rem;
  padding: 0.625rem 2rem;
  border-radius: 8px;
  border: 1.5px solid ${(p) => p.theme.colors.accent};
  background: transparent;
  color: ${(p) => p.theme.colors.accent};
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${(p) => p.theme.colors.accent};
    color: #fff;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const QuizResult = styled.div<{ $correct: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => (p.$correct ? p.theme.colors.success : p.theme.colors.error)};
`;

export const QuizExplanationWrapper = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  padding: 1.25rem;
`;

export const QuizExplanationLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 0.625rem;
`;

export const QuizExplanation = styled.div`
  font-size: 0.9375em;
  line-height: 1.65;
  color: ${(p) => p.theme.colors.foreground};
`;
