import styled from 'styled-components';

export const Wrap = styled.section`
  display: flex;
  align-items: baseline;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.75rem;
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};

  ${(p) => p.theme.media.tablet} {
    font-size: 2rem;
  }
`;

export const TitleAccent = styled.span`
  color: ${(p) => p.theme.colors.foreground};
`;
