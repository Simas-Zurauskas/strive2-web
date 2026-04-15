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
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

export const Title = styled.h3`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const Stat = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const CalendarWrap = styled.div`
  display: flex;
  justify-content: center;

  /* Override react-activity-calendar defaults for theme consistency */
  .react-activity-calendar__footer {
    font-size: 0.625rem !important;
  }
`;
