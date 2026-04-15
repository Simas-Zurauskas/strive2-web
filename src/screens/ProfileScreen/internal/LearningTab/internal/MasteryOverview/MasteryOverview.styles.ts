import styled from 'styled-components';

export const Section = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  margin-bottom: 1.5rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
`;

export const Title = styled.h3`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const SummaryLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

export const CourseSelect = styled.select`
  padding: 0.375rem 0.625rem;
  border-radius: 6px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  font-size: 0.75rem;
  cursor: pointer;
  max-width: 200px;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const EmptyText = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  padding: 2rem 0;
  margin: 0;
`;
