import styled from 'styled-components';

export const Container = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  padding: 1.5rem;
`;

export const Header = styled.div`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.01em;
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;
