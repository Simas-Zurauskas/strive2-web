import Link from 'next/link';
import styled from 'styled-components';

export const Nav = styled.nav<{ $hidden?: boolean; $scrolled?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: ${(p) =>
    p.$scrolled
      ? `color-mix(in oklab, ${p.theme.colors.background} 65%, transparent)`
      : `color-mix(in oklab, ${p.theme.colors.background} 80%, transparent)`};
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border-bottom: 1px solid
    ${(p) => (p.$scrolled ? p.theme.colors.surfaceBorder : 'transparent')};
  z-index: 50;
  transform: translateY(${(p) => (p.$hidden ? '-100%' : '0%')});
  transition:
    transform 0.3s ease,
    background 0.2s,
    border-color 0.2s;
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
  /* Mirrors ThemeSwitch's quiet container language: surfaceBorder ring,
     transparent fill, muted icon. Hover only warms the icon — no fill,
     no lift, no shadow — so these stay calm next to the segmented switch. */
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    color 180ms cubic-bezier(0.22, 0.61, 0.36, 1),
    border-color 180ms cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 120ms cubic-bezier(0.22, 0.61, 0.36, 1);

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    border-color: ${(p) => p.theme.colors.border};
  }

  &:active {
    transform: scale(0.95);
    transition-duration: 80ms;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const FeedbackButton = styled.button`
  /* Same-hue tinted-pill language as CreditPill's warning/danger states:
     muted accent fill + accent-tinted border + saturated accent text/icon.
     Hover lifts to a solid accent fill with surface-colored content. */
  height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 0.85rem 0 0.75rem;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, ${(p) => p.theme.colors.accent} 40%, transparent);
  background: color-mix(in srgb, ${(p) => p.theme.colors.accent} 15%, transparent);
  color: ${(p) => p.theme.colors.accent};
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.005em;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
    color 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
    border-color 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 160ms cubic-bezier(0.22, 0.61, 0.36, 1);

  svg {
    width: 14px;
    height: 14px;
    color: currentColor;
    transition: transform 260ms cubic-bezier(0.22, 0.61, 0.36, 1);
  }

  &:hover {
    background: ${(p) => p.theme.colors.accent};
    color: ${(p) => p.theme.colors.surface};
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow:
      0 2px 10px ${(p) => p.theme.colors.accentMuted},
      var(--shadow-card);
    transform: translateY(-0.5px);
  }

  &:hover svg {
    transform: translateX(-1px);
  }

  &:active {
    transform: translateY(0) scale(0.97);
    transition-duration: 80ms;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  ${(p) => p.theme.media.tablet} {
    /* Drop the label on narrow screens — the icon + tooltip carry the meaning. */
    padding: 0;
    width: 32px;
    justify-content: center;
    border-radius: 50%;
    gap: 0;

    span {
      display: none;
    }
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

