import styled from 'styled-components';

export const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: ${(p) => p.theme.colors.background};
  border-bottom: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  z-index: 50;

  ${(p) => p.theme.media.tablet} {
    padding: 0 1rem;
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
`;

export const Logo = styled.a`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.375rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  text-decoration: none;
  letter-spacing: -0.01em;
`;

export const Center = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  ${(p) => p.theme.media.tablet} {
    gap: 1.25rem;
  }
`;

export const NavLink = styled.a<{ $active?: boolean }>`
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => (p.$active ? p.theme.colors.accent : p.theme.colors.foreground)};
  text-decoration: none;
  transition: color 0.15s;
  padding: 0.25rem 0;

  &:hover {
    color: ${(p) => p.theme.colors.accent};
  }
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ThemeToggle = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
    color: ${(p) => p.theme.colors.foreground};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const Avatar = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.foreground};
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 0.8125rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
  }
`;
