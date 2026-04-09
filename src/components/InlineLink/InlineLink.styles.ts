import styled from 'styled-components';

export const StyledLink = styled.a`
  color: ${(p) => p.theme.colors.accent};
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: ${(p) => p.theme.colors.accent}40;
  text-underline-offset: 2px;
  transition:
    color 0.15s,
    text-decoration-color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.accentHover};
    text-decoration-color: ${(p) => p.theme.colors.accentHover};
  }
`;
