import styled, { keyframes } from 'styled-components';

const toolFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
`;

export const MessageWrapper = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(p) => (p.$isUser ? 'flex-end' : 'flex-start')};
  gap: 0.3rem;
`;

export const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: min(85%, 480px);
  padding: 0.75rem 1rem;
  border-radius: 1.25rem;
  ${(p) =>
    p.$isUser ? 'border-top-right-radius: 0.375rem;' : 'border-top-left-radius: 0.375rem;'}
  font-size: 0.875rem;
  line-height: 1.55;
  background: ${(p) => (p.$isUser ? p.theme.colors.accent : p.theme.colors.surface)};
  color: ${(p) => (p.$isUser ? '#fff' : p.theme.colors.foreground)};
  border: ${(p) => (p.$isUser ? 'none' : `1px solid ${p.theme.colors.border}`)};
  transition: background 0.2s ease;

  p {
    margin: 0;
  }

  p + p {
    margin-top: 0.5rem;
  }

  ul,
  ol {
    margin: 0.375rem 0;
    padding-left: 1.25rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  code {
    font-size: 0.8125rem;
    background: ${(p) =>
      p.$isUser ? 'rgba(255, 255, 255, 0.15)' : p.theme.colors.background};
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }
`;

export const ToolRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const ToolSpinner = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-top-color: ${(p) => p.theme.colors.accent};
  animation: ${spin} 0.6s linear infinite;
  flex-shrink: 0;
`;

export const ToolBadge = styled.span<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  opacity: ${(p) => (p.$isActive ? 0.8 : 1)};
  animation: ${toolFadeIn} 0.25s ease-out both;
  transition: opacity 0.2s ease;
`;
