import styled, { keyframes, css } from 'styled-components';

const fillIn = keyframes`
  from { transform: translateY(20%); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
`;

const drain = keyframes`
  from { transform: translateY(0);   opacity: 1; }
  to   { transform: translateY(-20%); opacity: 0; }
`;

const refillSweep = keyframes`
  0%   { transform: translateY(110%); opacity: 0.55; }
  60%  { transform: translateY(0);    opacity: 0.45; }
  100% { transform: translateY(0);    opacity: 0;    }
`;

const ringPulse = keyframes`
  0%   { transform: scale(0.85); opacity: 0.7; }
  60%  { transform: scale(1.55); opacity: 0.15; }
  100% { transform: scale(1.85); opacity: 0;    }
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
`;

export const Stage = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 2.75rem;
  height: 100%;
  width: 100%;
  max-width: 380px;
  justify-content: center;

  @media (max-width: 520px) {
    gap: 1.5rem;
  }
`;

export const Vessel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

export const VesselLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const VesselBody = styled.div`
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  gap: 6px;
  padding: 0.625rem;
  width: 88px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  min-height: 168px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
`;

export const RefillWave = styled.span`
  position: absolute;
  inset: auto 0 0 0;
  height: 100%;
  background: linear-gradient(
    to top,
    ${(p) => p.theme.colors.tertiaryMuted},
    transparent 60%
  );
  z-index: 0;
  ${css`animation: ${refillSweep} 0.9s cubic-bezier(0.16, 1, 0.3, 1);`}
`;

export const Drop = styled.div<{ $filled: boolean; $tone: 'monthly' | 'topup' }>`
  position: relative;
  height: 16px;
  border-radius: 4px;
  background: ${(p) =>
    p.$filled
      ? p.$tone === 'monthly'
        ? p.theme.colors.tertiary
        : p.theme.colors.accent
      : p.theme.colors.surfaceBorder};
  opacity: ${(p) => (p.$filled ? 1 : 0.3)};
  transition: background 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.4s ease;
  ${(p) => css`animation: ${p.$filled ? fillIn : drain} 0.5s ease-out;`}
  z-index: 1;
`;

export const VesselFoot = styled.span<{ $emphasis?: boolean }>`
  font-size: 0.7rem;
  color: ${(p) => (p.$emphasis ? p.theme.colors.tertiary : p.theme.colors.muted)};
  font-style: italic;
  font-weight: ${(p) => (p.$emphasis ? 600 : 400)};
  transition: color 0.3s ease, font-weight 0.3s ease;
`;

// ── Mid-stage action pulse (lesson / narrate / quiz / recall) ──
// Stable column; icon cross-fades inside the glyph, label cross-fades
// below. PulseRing beats outward on each tick to convey "credit fired".
export const ActionPulse = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 3;
  pointer-events: none;
`;

const toneColor = (tone: 'monthly' | 'topup', t: { colors: { tertiary: string; accent: string } }) =>
  tone === 'topup' ? t.colors.accent : t.colors.tertiary;

export const ActionGlyph = styled.span<{ $tone: 'monthly' | 'topup' }>`
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.surface};
  border: 1.5px solid ${(p) => toneColor(p.$tone, p.theme)};
  color: ${(p) => toneColor(p.$tone, p.theme)};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  box-shadow: var(--shadow-lift);
  transition: border-color 0.4s ease, color 0.4s ease;
`;

export const PulseRing = styled.span<{ $tone: 'monthly' | 'topup' }>`
  position: absolute;
  inset: -1.5px;
  border-radius: 50%;
  border: 1.5px solid ${(p) => toneColor(p.$tone, p.theme)};
  pointer-events: none;
  z-index: 0;
  ${css`animation: ${ringPulse} 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards;`}
`;

export const ActionLabel = styled.span<{ $tone: 'monthly' | 'topup' }>`
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 700;
  color: ${(p) => toneColor(p.$tone, p.theme)};
  background: ${(p) => p.theme.colors.surface};
  padding: 1px 5px;
  border-radius: 3px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  transition: color 0.4s ease;
`;
