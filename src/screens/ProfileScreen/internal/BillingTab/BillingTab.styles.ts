import styled from 'styled-components';

export const DevSection = styled.section`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px dashed ${(p) => p.theme.colors.surfaceBorder};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const DevToggle = styled.button`
  align-self: flex-start;
  background: transparent;
  border: 1px dashed ${(p) => p.theme.colors.warning};
  color: ${(p) => p.theme.colors.warning};
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${(p) => p.theme.colorsLib.amber}15;
  }
`;

export const DevTools = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px dashed ${(p) => p.theme.colors.warning};
  border-radius: 8px;
  background: ${(p) => p.theme.colorsLib.amber}10;
`;

export const DevLabel = styled.span`
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 700;
  color: ${(p) => p.theme.colors.warning};
`;
