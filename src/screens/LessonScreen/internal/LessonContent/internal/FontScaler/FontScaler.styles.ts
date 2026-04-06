import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const ScaleButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${(p) => (p.$active ? p.theme.colors.accent : 'transparent')};
  background: ${(p) => (p.$active ? `${p.theme.colors.accent}10` : 'transparent')};
  color: ${(p) => (p.$active ? p.theme.colors.accent : p.theme.colors.muted)};
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 500;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;
