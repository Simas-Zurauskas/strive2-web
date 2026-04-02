import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1rem;
  background: ${(p) => p.theme.colors.background};
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: 0;
`;

export const ChatScrollArea = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 0;
`;

export const MessagesArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
`;

export const ScrollDownButton = styled.button`
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    opacity 0.25s ease,
    background 0.15s ease;
  z-index: 2;

  &:hover {
    background: ${(p) => p.theme.colors.surface};
  }

  &:active {
    transform: translateX(-50%) scale(0.95);
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
  gap: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.875rem;
  line-height: 1.5;
  animation: ${fadeIn} 0.4s ease-out;
`;

export const SuggestedPrompts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  justify-content: center;
`;

export const SuggestedPrompt = styled.button`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;
  animation: ${fadeIn} 0.4s ease-out both;

  &:nth-child(1) { animation-delay: 0.05s; }
  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.15s; }

  &:hover {
    background: ${(p) => p.theme.colors.border};
    transform: translateY(-1px) scale(1.02);
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.875rem 1rem;
  background: ${(p) => p.theme.colors.surface};
  position: relative;
  z-index: 1;
  border-radius: 0 0 1rem 1rem;
  box-shadow:
    0 -1px 3px 0 rgba(79, 70, 229, 0.04),
    0 -4px 12px 0 rgba(79, 70, 229, 0.03),
    0 -8px 24px 0 rgba(79, 70, 229, 0.02);
`;

export const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;

export const ChatInput = styled.textarea`
  flex: 1;
  resize: none;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-family: inherit;
  line-height: 1.4;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  min-height: 2.5rem;
  max-height: 6rem;
  overflow-y: hidden;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow: 0 0 0 2px ${(p) => p.theme.colors.accent}20;
  }

  &:disabled {
    opacity: 0.6;
  }

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
  }
`;

export const SendButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  border: none;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent};
  color: #fff;
  cursor: pointer;
  padding: 0;
  transition:
    background 0.2s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.accentHover};
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const LoaderIcon = styled.span`
  display: inline-flex;
  animation: ${spin} 0.8s linear infinite;
`;

export const ErrorText = styled.p`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.error};
  animation: ${fadeIn} 0.3s ease-out;
`;
