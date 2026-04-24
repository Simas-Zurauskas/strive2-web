import styled from 'styled-components';

export const Magnitude = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.55;
  margin: 0 0 0.75rem 0;

  strong {
    font-weight: 600;
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const CuesIntro = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0.75rem 0 0.25rem 0;
`;

export const CuesList = styled.ul`
  margin: 0 0 0.75rem 0;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;

  li {
    margin: 0.15rem 0;
  }
`;

export const Question = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0.5rem 0 0 0;
  font-weight: 500;
`;
