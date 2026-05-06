import styled from 'styled-components';

export const Section = styled.section`
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem 1.375rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  background: ${(p) => p.theme.colors.surface};

  ${(p) => p.theme.media.tablet} {
    padding: 1rem 1.125rem 1.125rem;
  }
`;

export const SectionTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.375rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  margin: 0 0 0.4375rem;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Description = styled.p`
  margin: 0 0 1.25rem;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  max-width: 56ch;
`;

export const Row = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  cursor: pointer;
  user-select: none;

  &[data-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: ${(p) => p.theme.colors.accent};
  cursor: inherit;
`;

export const RowText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const RowLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const RowHint = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const Skeleton = styled.div`
  height: 1.25rem;
  width: 12rem;
  border-radius: 4px;
  background: ${(p) => p.theme.colors.surfaceBorder};
  opacity: 0.6;
`;
