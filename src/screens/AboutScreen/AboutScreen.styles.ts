import styled from 'styled-components';

export const Layout = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 1.25rem 4.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  ${(p) => p.theme.media.mobile} {
    padding: 2rem 1.25rem 3rem;
    gap: 2rem;
  }
`;

export const Header = styled.header`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(2rem, 4vw, 2.75rem);
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const Subtitle = styled.p`
  color: ${(p) => p.theme.colors.muted};
  font-size: 1rem;
  max-width: 42rem;
  margin: 0 auto;
  line-height: 1.55;
`;

export const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Card = styled.section`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 12px;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const CardChip = styled.span`
  align-self: flex-start;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: ${(p) => `color-mix(in oklab, ${p.theme.colors.accent} 12%, transparent)`};
  color: ${(p) => p.theme.colors.accent};
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
`;

export const CardTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 1.35rem;
  line-height: 1.2;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const CardBody = styled.p`
  font-size: 0.9rem;
  line-height: 1.65;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const CardLink = styled.a`
  margin-top: auto;
  padding-top: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.accent};
  text-decoration: none;

  &::after {
    content: ' →';
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
`;

export const SupportLine = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;

  a {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 3px;

    ${(p) => p.theme.media.hover} {
      &:hover {
        color: ${(p) => p.theme.colors.accent};
      }
    }
  }
`;
