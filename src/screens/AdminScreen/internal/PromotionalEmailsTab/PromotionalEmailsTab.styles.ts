import styled from 'styled-components';

export const Card = styled.section`
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 12px;
  background: ${(p) => p.theme.colors.surface};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 400;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const FieldLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.muted};
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.9375rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.9375rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
`;

export const StatusLine = styled.span<{ $kind: 'success' | 'error' }>`
  font-size: 0.8125rem;
  color: ${(p) => (p.$kind === 'success' ? p.theme.colors.accent : p.theme.colors.error)};
`;
