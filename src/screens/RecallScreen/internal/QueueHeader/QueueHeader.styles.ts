import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const Progress = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
`;

export const Counts = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
`;

export const Bar = styled.div`
  position: relative;
  height: 4px;
  border-radius: var(--radius-pill);
  background: ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

export const Fill = styled.div<{ $pct: number }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${(p) => Math.max(0, Math.min(100, p.$pct))}%;
  background: ${(p) => p.theme.colors.accent};
  border-radius: var(--radius-pill);
  transition: width 0.3s ease;
`;
