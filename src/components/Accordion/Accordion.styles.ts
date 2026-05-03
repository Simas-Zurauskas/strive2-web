import styled from 'styled-components';

export const Item = styled.div`
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const Trigger = styled.button<{ $open?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  background: none;
  border: none;
  text-align: left;
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const TriggerLabel = styled.span`
  flex: 1;
`;

export const TriggerIcon = styled.span<{ $open?: boolean }>`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.muted};
  transform: rotate(${(p) => (p.$open ? '180deg' : '0deg')});
  transition: transform 0.2s;
`;

export const Body = styled.div<{ $open?: boolean }>`
  display: ${(p) => (p.$open ? 'block' : 'none')};
  padding: 0 0 1.25rem 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.foreground};
`;
