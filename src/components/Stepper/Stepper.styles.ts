import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
`;

export const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
    if (p.$state === 'active') return '#fff';
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

  &:hover {
    opacity: ${(p) => (p.$clickable ? 0.8 : 1)};
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
`;

export const Connector = styled.span<{ $completed: boolean }>`
  flex: 1;
  height: 1px;
  margin: 0 0.75rem;
  background: ${(p) => (p.$completed ? p.theme.colors.foreground : p.theme.colors.surfaceBorder)};
  opacity: ${(p) => (p.$completed ? 0.2 : 1)};
  transition: background 0.15s, opacity 0.15s;
`;
