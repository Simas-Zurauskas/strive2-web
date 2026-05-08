import styled, { keyframes, css } from 'styled-components';

// Two pulse layers, both run on a 2.2 s loop while the concept is unviewed:
//   1. ring  — a tertiary disc that scales out and fades, like a sonar ping.
//   2. dot   — the button itself wobbles gently in scale on the same beat.
// The button's resting style stays identical to the unviewed state — no
// fill, no extra border, no shadow. The pulse alone signals "look here";
// the chrome stays calm so a page full of these doesn't read busy.

const pulseRing = keyframes`
  0%   { transform: scale(1);    opacity: 0.5;  }
  70%  { transform: scale(1.85); opacity: 0;    }
  100% { transform: scale(1.85); opacity: 0;    }
`;

const pulseDot = keyframes`
  0%, 100% { transform: scale(1);    }
  20%      { transform: scale(1.08); }
  45%      { transform: scale(1);    }
`;

export const Wrap = styled.span<{ $variant: 'inline' | 'floating' }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;

  ${(p) =>
    p.$variant === 'floating' &&
    css`
      position: absolute;
    `}
`;

export const Ring = styled.span<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.tertiary};
  pointer-events: none;
  opacity: 0;
  ${(p) =>
    p.$active &&
    css`
      animation: ${pulseRing} 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    `}
`;

export const Button = styled.button<{ $active: boolean; $size: 'sm' | 'md' }>`
  position: relative;
  width: ${(p) => (p.$size === 'sm' ? '18px' : '22px')};
  height: ${(p) => (p.$size === 'sm' ? '18px' : '22px')};
  padding: 0;
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.tertiary};
  font-size: ${(p) => (p.$size === 'sm' ? '0.6875rem' : '0.8125rem')};
  font-weight: 600;
  font-family: inherit;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, border-color 0.15s, background 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.tertiaryHover};
    border-color: ${(p) => p.theme.colors.tertiary};
    background: ${(p) => p.theme.colors.tertiaryMuted};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  ${(p) =>
    p.$active &&
    css`
      animation: ${pulseDot} 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    `}
`;
