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
  gap: 0.4375rem;
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

  & svg {
    width: 14px;
    height: 14px;
  }
`;

export const SaveStatus = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  font-style: italic;
  font-family: var(--font-heading-serif), Georgia, serif;
`;

/** Wraps the textarea so the char-count warning can sit absolutely on top. */
export const TextareaWrap = styled.div`
  position: relative;
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  max-height: 400px;
  padding: 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.9375rem;
  font-family: inherit;
  line-height: 1.65;
  resize: vertical;
  transition: border-color 0.2s;
  display: block;

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
    font-style: italic;
  }

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

/** Char count overlay — only renders at >90% capacity. */
export const CharCount = styled.span<{ $warn?: boolean }>`
  position: absolute;
  right: 0.75rem;
  bottom: 0.625rem;
  font-size: 0.6875rem;
  color: ${(p) => (p.$warn ? p.theme.colors.error : p.theme.colors.muted)};
  background: ${(p) => p.theme.colors.surface};
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  pointer-events: none;
`;
