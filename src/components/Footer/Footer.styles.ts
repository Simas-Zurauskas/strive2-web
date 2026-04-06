import styled from 'styled-components';

export const Container = styled.footer`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  ${(p) => p.theme.media.tablet} {
    padding: 1.5rem 1.25rem;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

export const Brand = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: -0.01em;
`;

export const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const FooterLink = styled.a`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const Copyright = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;
