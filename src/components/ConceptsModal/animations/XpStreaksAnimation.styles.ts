import styled, { css, keyframes } from 'styled-components';

const pop = keyframes`
  from { transform: scale(0.9); opacity: 0.6; }
  to   { transform: scale(1);   opacity: 1; }
`;

const dotPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.12); }
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
    gap: 0.875rem;
  }
`;

// ── XP gauge (circular ring + content) ────────────────────
export const Gauge = styled.div`
  position: relative;
  width: 130px;
  height: 130px;
  flex-shrink: 0;
`;

export const RingSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

// Stroke-dasharray + dashoffset = animated arc fill.
// Circumference of r=42 is ~263.9. We use a fixed 264 here.
export const RingArc = styled.circle<{ $pct: number }>`
  stroke: ${(p) => p.theme.colors.tertiary};
  stroke-dasharray: 264;
  stroke-dashoffset: ${(p) => 264 - (p.$pct / 100) * 264};
  transition: stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const GaugeContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

export const GaugeXpRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
  font-family: var(--font-heading-serif), Georgia, serif;
  color: ${(p) => p.theme.colors.foreground};
  animation: ${pop} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const XpPlus = styled.span`
  font-size: 0.875rem;
  font-style: italic;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const XpValue = styled.span`
  font-size: 1.625rem;
  font-style: italic;
  font-variant-numeric: tabular-nums;
`;

export const XpUnit = styled.span`
  font-size: 0.625rem;
  font-style: normal;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.tertiary};
  margin-left: 1px;
`;

export const GaugeSource = styled.span`
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.muted};
`;

// ── Day chain (calendar bridge) ───────────────────────────
export const Calendar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  max-width: 240px;
`;

export const CalLabel = styled.span`
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const DayChain = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const DayCell = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  &:last-child {
    flex: 0;
  }
`;

export const DayDot = styled.span<{ $lit: boolean; $weekend: boolean; $active: boolean }>`
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  border: 1.5px solid
    ${(p) =>
      p.$lit ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder};
  background: ${(p) =>
    p.$lit
      ? p.theme.colors.tertiary
      : p.$weekend
      ? p.theme.colors.tertiaryMuted
      : p.theme.colors.surface};
  color: ${(p) =>
    p.$lit
      ? p.theme.colors.surface
      : p.$weekend
      ? p.theme.colors.tertiary
      : p.theme.colors.muted};
  transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  ${(p) => p.$active && css`animation: ${dotPulse} 1.2s ease-in-out infinite;`}
`;

export const Bridge = styled.span<{ $lit: boolean; $dimmed: boolean }>`
  flex: 1;
  height: 2px;
  margin: 0 -1px;
  border-radius: 1px;
  background: ${(p) =>
    p.$lit ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder};
  opacity: ${(p) => (p.$dimmed ? 0.5 : 1)};
  transition: background 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
`;

export const CalFootnote = styled.span`
  font-size: 0.625rem;
  color: ${(p) => p.theme.colors.muted};
  font-style: italic;
  text-align: center;
`;
