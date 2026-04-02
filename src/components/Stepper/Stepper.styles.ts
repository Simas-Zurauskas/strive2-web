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

export const Circle = styled.span<{ $state: 'completed' | 'active' | 'future'; $clickable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  transition:
    background 0.15s,
    color 0.15s;

  background: ${(p) => {
    if (p.$state === 'completed' || p.$state === 'active') return p.theme.colors.accent;
    return 'transparent';
  }};

  color: ${(p) => {
    if (p.$state === 'completed' || p.$state === 'active') return '#fff';
    return p.theme.colors.muted;
  }};

  border: 2px solid
    ${(p) => {
      if (p.$state === 'completed' || p.$state === 'active') return p.theme.colors.accent;
      return p.theme.colors.border;
    }};

  &:hover {
    opacity: ${(p) => (p.$clickable ? 0.8 : 1)};
  }
`;

export const Label = styled.span<{ $state: 'completed' | 'active' | 'future'; $clickable: boolean }>`
  font-size: 0.8125rem;
  font-weight: ${(p) => (p.$state === 'active' ? 600 : 400)};
  color: ${(p) => (p.$state === 'future' ? p.theme.colors.muted : p.theme.colors.foreground)};
  white-space: nowrap;
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
`;

export const Connector = styled.span<{ $completed: boolean }>`
  flex: 1;
  height: 1px;
  margin: 0 0.75rem;
  background: ${(p) => (p.$completed ? p.theme.colors.accent : p.theme.colors.border)};
  transition: background 0.15s;
`;
