'use client';

import Link from 'next/link';
import styled from 'styled-components';

export const Body = styled.div`
  text-align: center;
  padding: 4rem 1rem 2rem;
  margin: 0 auto;
  max-width: 48ch;

  ${(p) => p.theme.media.tablet} {
    padding: 2.5rem 1rem 1.5rem;
  }
`;

export const Eyebrow = styled.span`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
  margin-bottom: 0.625rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.5rem;
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.1;
  margin: 0 0 0.875rem;
  color: ${(p) => p.theme.colors.foreground};

  ${(p) => p.theme.media.tablet} {
    font-size: 1.875rem;
  }
`;

export const Copy = styled.p`
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  margin: 0 0 2rem;
`;

export const Links = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
`;

export const NavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 44px, not the product's usual 32-38px: this is the only escape hatch on
     the page and the sweep's systemic pattern #2 is that base control heights
     are the reason tap targets fail. Do not shrink it. */
  min-height: 44px;
  padding: 0 1.125rem;
  border-radius: var(--radius-pill);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition:
    border-color 0.15s,
    color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      border-color: ${(p) => p.theme.colors.tertiary};
      color: ${(p) => p.theme.colors.tertiary};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;
