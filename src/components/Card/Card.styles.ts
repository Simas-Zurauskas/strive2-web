import styled from 'styled-components';

export const Container = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  padding: 1.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s, transform 0.2s;
`;

export const Header = styled.div`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.0625rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.01em;
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;
