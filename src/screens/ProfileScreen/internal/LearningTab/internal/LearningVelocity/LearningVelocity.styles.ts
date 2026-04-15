import styled from 'styled-components';

export const Section = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  background: ${(p) => p.theme.colors.surface};
`;

export const Title = styled.h3`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 0.75rem 0;
`;

export const MetricRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;

  & + & {
    border-top: 1px solid ${(p) => p.theme.colors.border};
  }
`;

export const MetricLabel = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const MetricValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Delta = styled.span<{ $positive: boolean }>`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${(p) => (p.$positive ? p.theme.colors.success : p.theme.colors.error)};
  margin-left: 0.375rem;
`;

export const ProjectionDate = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.accent};
`;

export const EmptyText = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  padding: 1rem 0;
  margin: 0;
`;
