import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;

  ${(p) => p.theme.media.mobile} {
    grid-template-columns: 1fr;
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
  font-variant-numeric: tabular-nums;
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

export const ByService = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 1rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  margin-bottom: 1.5rem;
`;

export const ByServiceTitle = styled.h3`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 0.75rem 0;
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Chip = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.surfaceBorder}40;
  font-size: 0.75rem;
`;

export const ChipService = styled.span`
  color: ${(p) => p.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.625rem;
  font-weight: 600;
`;

export const ChipValue = styled.span`
  font-variant-numeric: tabular-nums;
  color: ${(p) => p.theme.colors.foreground};
  font-weight: 600;
`;
