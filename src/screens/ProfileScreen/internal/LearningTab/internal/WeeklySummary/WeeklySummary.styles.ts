import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Card = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 1rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  text-align: center;
`;

export const Value = styled.div`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Label = styled.div`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 500;
  margin-top: 0.125rem;
`;

export const Delta = styled.span<{ $positive: boolean; $neutral: boolean }>`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${(p) =>
    p.$neutral ? p.theme.colors.muted : p.$positive ? p.theme.colors.success : p.theme.colors.error};
  margin-top: 0.25rem;
  display: block;
`;
