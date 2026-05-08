import styled, { css, keyframes } from 'styled-components';

const stopPulse = keyframes`
  0%   { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 0 var(--pulse-color); }
  60%  { transform: translate(-50%, -50%) scale(1.4); box-shadow: 0 0 0 8px transparent; }
  100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 0 transparent; }
`;

const cardLand = keyframes`
  0%   { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
  35%  { transform: translate(-50%, -65%) scale(1.12) rotate(-3deg); }
  100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem;

  @media (max-width: 520px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: 260px;
`;

export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  min-width: 0;
  width: 100%;
  max-width: 240px;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const RightLabel = styled.span`
  font-size: 0.5625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
  text-align: center;
`;

export const Track = styled.div`
  position: relative;
  height: 50px;
  width: 100%;
`;

// Curved guide arc (the "schedule" the card travels along)
export const Arc = styled.span`
  position: absolute;
  left: 6%;
  right: 6%;
  top: 30%;
  height: 24px;
  border-top: 1.5px dashed ${(p) => p.theme.colors.tertiary};
  border-radius: 50% / 100% 100% 0 0;
  opacity: 0.4;
`;

export const Stop = styled.span<{ $position: number; $reached: boolean; $isCurrent: boolean }>`
  position: absolute;
  top: 50%;
  left: ${(p) => p.$position}%;
  transform: translate(-50%, -50%);
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${(p) =>
    p.$reached ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder};
  border: 1.5px solid ${(p) => p.theme.colors.tertiary};
  z-index: 1;
  transition: background 0.3s ease;
  --pulse-color: ${(p) => p.theme.colors.tertiary}80;
  ${(p) =>
    p.$isCurrent &&
    css`animation: ${stopPulse} 0.7s cubic-bezier(0.16, 1, 0.3, 1);`}
`;

export const HoppingCard = styled.span<{ $position: number; $key: number }>`
  position: absolute;
  top: 50%;
  left: ${(p) => p.$position}%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 26px;
  border-radius: 4px;
  background: ${(p) => p.theme.colors.surface};
  border: 1.5px solid ${(p) => p.theme.colors.tertiary};
  box-shadow: var(--shadow-lift-strong);
  z-index: 2;
  transition: left 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  animation: ${cardLand} 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* React re-mounts on prop change to re-trigger the landing keyframe each hop. */
  &::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 4px;
    right: 4px;
    height: 2px;
    border-radius: 1px;
    background: ${(p) => p.theme.colors.tertiary};
    opacity: 0.7;
  }
`;

export const IntervalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.625rem;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  padding: 0 4px;
`;

export const IntervalCell = styled.span<{ $current: boolean }>`
  color: ${(p) => (p.$current ? p.theme.colors.tertiary : p.theme.colors.muted)};
  transition: color 0.3s ease;
`;

export const Footnote = styled.span`
  font-size: 0.625rem;
  color: ${(p) => p.theme.colors.muted};
  font-style: italic;
  text-align: center;
  margin-top: 4px;
`;
