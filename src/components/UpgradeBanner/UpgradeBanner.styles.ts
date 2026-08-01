'use client';

import styled from 'styled-components';
import { touchHitArea } from '@/theme';

export const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-5);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-left: 2px solid ${(p) => p.theme.colors.tertiary};
  border-radius: var(--radius-md);

  ${(p) => p.theme.media.tabletLarge} {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }
`;

export const Text = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
`;

export const UpgradeLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--on-accent);
  background: ${(p) => p.theme.colors.accent};
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: background 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.accentHover};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const DismissButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: ${(p) => p.theme.colors.muted};
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
      background: ${(p) => p.theme.colors.surfaceBorder};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  ${touchHitArea}
`;
