import styled from 'styled-components';

export const Layout = styled.div`
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 2rem;

  ${(p) => p.theme.media.tablet} {
    padding: 1.5rem 1.25rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Lightweight header strip — admin lives outside the main app chrome,
// so we render our own minimal title + sign-out affordance instead of
// the full Navbar.
export const Header = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const Eyebrow = styled.span`
  display: block;
  font-family: var(--font-body-sans);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 0.25rem;
`;

export const ExitLink = styled.a`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  text-decoration: none;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;
