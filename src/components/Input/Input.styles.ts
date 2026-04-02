import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.01em;
`;

export const Field = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${(p) => p.theme.colors.accent};
  }

  &::placeholder {
    opacity: 0.4;
  }
`;

export const Error = styled.p`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.error};
`;
