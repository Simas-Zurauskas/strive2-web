'use client';

import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

export const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    background: ${(p) => p.theme.colors.background};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 160px;
  padding: 0.25rem 0;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: var(--shadow-lift-strong);
  z-index: 50;
  animation: ${fadeIn} 120ms ease-out;
`;

export const MenuItem = styled.button<{ $variant?: 'default' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  font-family: inherit;
  color: ${(p) =>
    p.$variant === 'danger' ? p.theme.colors.error : p.theme.colors.foreground};
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover,
  &:focus-visible {
    background: ${(p) => p.theme.colors.background};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: -2px;
  }
`;
