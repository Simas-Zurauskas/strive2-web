import Link from 'next/link';
import styled from 'styled-components';

export const Nav = styled.nav<{ $hidden?: boolean }>`
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
  transform: translateY(${(p) => (p.$hidden ? '-100%' : '0%')});
  transition: transform 0.3s ease;
  will-change: transform;

  ${(p) => p.theme.media.tablet} {
    padding: 0 1rem;
  }
`;

export const LeftCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  ${(p) => p.theme.media.tablet} {
    gap: 0.75rem;
  }
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

export const Divider = styled.span`
  width: 1px;
  height: 18px;
  background: ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`;

export const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  ${(p) => p.theme.media.tablet} {
    gap: 1rem;
  }
`;

export const NavLink = styled(Link)<{ $active?: boolean }>`
  position: relative;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => (p.$active ? p.theme.colors.foreground : p.theme.colors.muted)};
  text-decoration: none;
  transition: color 0.15s;
  padding: 0.375rem 0;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    border-radius: 1px;
    background: ${(p) => p.theme.colors.accent};
    opacity: ${(p) => (p.$active ? 1 : 0)};
    transform: scaleX(${(p) => (p.$active ? 1 : 0.6)});
    transform-origin: center;
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
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
  transition:
    border-color 0.15s,
    color 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
    color: ${(p) => p.theme.colors.foreground};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ThemeSwitch = styled.div`
  height: 32px;
  display: inline-flex;
  align-items: stretch;
  padding: 3px;
  border-radius: 9999px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: transparent;
`;

export const ThemeOption = styled.button<{ $active: boolean }>`
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background: ${(p) => (p.$active ? p.theme.colors.accent : 'transparent')};
  color: ${(p) => (p.$active ? p.theme.colors.surface : p.theme.colors.muted)};
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    color: ${(p) => (p.$active ? p.theme.colors.surface : p.theme.colors.foreground)};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

