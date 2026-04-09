import styled from 'styled-components';

export const SummaryContainer = styled.div`
  padding: 1.75rem 0 1.75rem 1.5rem;
  position: relative;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1.5px;
    background: ${(p) => p.theme.colors.accent};
  }
`;

export const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: ${(p) => p.theme.colors.foreground};
`;

export const SummaryIcon = styled.span`
  display: flex;

  svg {
    width: 13px;
    height: 13px;
    stroke-width: 2px;
  }
`;

export const SummaryTitle = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const SummaryList = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 0;
  margin: 0;
  counter-reset: takeaway;
`;

export const SummaryItem = styled.li`
  display: flex;
  gap: 0.75rem;
  font-size: 0.9375em;
  line-height: 1.65;
  color: ${(p) => p.theme.colors.foreground};
  counter-increment: takeaway;

  &::before {
    content: counter(takeaway) '.';
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${(p) => p.theme.colors.muted};
    flex-shrink: 0;
    line-height: 1.65;
    min-width: 1.25rem;
    text-align: right;
  }

  p {
    margin: 0;
  }

  strong {
    font-weight: 600;
  }

  code {
    font-size: 0.85em;
    padding: 0.125em 0.375em;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.background};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }
`;
