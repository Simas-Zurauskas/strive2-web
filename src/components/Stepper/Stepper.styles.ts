import styled from 'styled-components';
import { onAccent } from '@/theme';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  /* Belt-and-suspenders: if labels ever overflow at an unusual breakpoint,
     hidden + min-width:0 keeps the stepper inside the viewport instead
     of pushing past the clip. */
  min-width: 0;
  overflow: hidden;
`;

export const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Wraps the Circle + Label of a navigable step so keyboard users get a
// single tab stop per step. Resets default button chrome so the inner
// Circle/Label spans keep rendering as before.
export const StepButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: transparent;
  font: inherit;
  color: inherit;
  cursor: pointer;
  border-radius: var(--radius-md);

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 4px;
  }
`;

export const Circle = styled.span<{ $state: 'completed' | 'active' | 'navigable' | 'future'; $clickable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.6875rem;
  font-weight: 600;
  flex-shrink: 0;
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;

  background: ${(p) => {
    if (p.$state === 'active') return p.theme.colors.accent;
    return 'transparent';
  }};

  color: ${(p) => {
    if (p.$state === 'active') return onAccent;
    if (p.$state === 'completed') return p.theme.colors.foreground;
    if (p.$state === 'navigable') return p.theme.colors.accent;
    return p.theme.colors.muted;
  }};

  border: 1.5px solid
    ${(p) => {
      if (p.$state === 'active') return p.theme.colors.accent;
      if (p.$state === 'completed') return p.theme.colors.foreground;
      if (p.$state === 'navigable') return p.theme.colors.accent;
      return p.theme.colorsLib.gray400;
    }};

  ${(p) => p.theme.media.hover} {
    ${StepButton}:hover & {
      opacity: 0.8;
    }
  }
`;

export const Label = styled.span<{ $state: 'completed' | 'active' | 'navigable' | 'future'; $clickable: boolean }>`
  font-size: 0.75rem;
  font-weight: ${(p) => (p.$state === 'active' ? 600 : 400)};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => {
    if (p.$state === 'active') return p.theme.colors.foreground;
    if (p.$state === 'completed') return p.theme.colors.foreground;
    if (p.$state === 'navigable') return p.theme.colors.foreground;
    return p.theme.colors.muted;
  }};
  white-space: nowrap;
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};

  /* On tablet and below, five labels + connectors don't fit. Hide
     them — the circles alone communicate position, and the active
     step's name is already shown in the step content header. The
     active label stays visible so the user always knows where they
     are. */
  ${(p) => p.theme.media.tabletLarge} {
    display: ${(p) => (p.$state === 'active' ? 'inline' : 'none')};
  }
`;

export const Connector = styled.span<{ $completed: boolean }>`
  flex: 1;
  height: 1px;
  margin: 0 0.75rem;
  background: ${(p) => (p.$completed ? p.theme.colors.foreground : p.theme.colors.surfaceBorder)};
  opacity: ${(p) => (p.$completed ? 0.2 : 1)};
  transition: background 0.15s, opacity 0.15s;
  min-width: 0.5rem;

  ${(p) => p.theme.media.tabletLarge} {
    margin: 0 0.4375rem;
  }

  ${(p) => p.theme.media.mobile} {
    margin: 0 0.25rem;
    min-width: 0.25rem;
  }
`;
