import styled from 'styled-components';
import { thinScrollbar } from '@/theme';

export const Container = styled.div`
  width: 360px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.surface};

  ${(p) => p.theme.media.desktop} {
    position: static;
    height: 100%;
  }

  ${(p) => p.theme.media.tablet} {
    width: 100%;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`;

export const MentorAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  flex-shrink: 0;
`;

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
`;

export const Title = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

export const StatusBadge = styled.span`
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.success};
  }
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  font-size: 1rem;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.background};
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  ${thinScrollbar}
`;

export const ContextBadge = styled.div`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  padding: 0.375rem 0.625rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PlaceholderMessage = styled.div`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  padding: 1rem;
  border-radius: 12px;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

export const SuggestedPrompts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 0.25rem;
`;

export const PromptChip = styled.button`
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.75rem;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.accent};
    color: ${(p) => p.theme.colors.accent};
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const InputArea = styled.div`
  padding: 0.875rem 1rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
    font-style: italic;
  }

  &:focus {
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow: 0 0 0 3px ${(p) => `${p.theme.colors.accent}15`};
  }
`;
