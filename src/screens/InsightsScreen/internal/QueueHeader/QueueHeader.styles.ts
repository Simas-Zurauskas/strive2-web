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
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.muted};
`;

export const Counts = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const Bar = styled.div`
  position: relative;
  height: 4px;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.surfaceBorder};
  overflow: hidden;
`;

export const Fill = styled.div<{ $pct: number }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${(p) => p.$pct}%;
  background: ${(p) => p.theme.colors.accent};
  transition: width 0.3s ease;
`;
