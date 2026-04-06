import styled from 'styled-components';

export const Container = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  padding-top: 1.5rem;
`;

export const Header = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.accent};
  }
`;

export const Chevron = styled.span<{ $expanded: boolean }>`
  display: inline-flex;
  font-size: 0.625rem;
  transition: transform 150ms ease;
  transform: ${(p) => (p.$expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
  color: ${(p) => p.theme.colors.muted};
`;

export const SaveStatus = styled.span`
  margin-left: auto;
  font-size: 0.6875rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.muted};
`;

export const Body = styled.div`
  padding: 0.5rem 0;
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 0.875rem;
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.875em;
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
  }

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow: 0 0 0 3px ${(p) => `${p.theme.colors.accent}10`};
  }
`;
