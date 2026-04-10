import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 1.5rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Toggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const SaveStatus = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  max-height: 400px;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.9375em;
  font-family: inherit;
  line-height: 1.65;
  resize: vertical;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
    font-style: italic;
  }

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.375rem;
  padding: 0 0.25rem;
`;

export const CharCount = styled.span<{ $warn?: boolean }>`
  font-size: 0.6875rem;
  color: ${(p) => (p.$warn ? p.theme.colors.error : p.theme.colors.muted)};
  opacity: ${(p) => (p.$warn ? 1 : 0.7)};
  transition: color 0.2s, opacity 0.2s;
`;

export const ShortcutHint = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  opacity: 0.5;
`;
