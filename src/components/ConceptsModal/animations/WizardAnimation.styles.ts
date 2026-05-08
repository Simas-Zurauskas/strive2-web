import styled, { css, keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const grow = keyframes`
  from { opacity: 0; transform: scaleY(0); }
  to   { opacity: 1; transform: scaleY(1); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0   var(--pulse-color); }
  50%      { box-shadow: 0 0 0 5px transparent; }
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  gap: 0.875rem;
`;

// ── Stage: the central slot where each step rides through ────
export const Stage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 130px;
  overflow: hidden;
`;

export const Slot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${slideIn} 0.45s cubic-bezier(0.16, 1, 0.3, 1);
`;

// ── Step 1: goal ─────────────────────────────────────────
export const GoalCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.tertiary};
  width: 220px;
`;

export const GoalCursor = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  color: ${(p) => p.theme.colors.tertiary};
  font-size: 1rem;
  line-height: 1;
`;

export const GoalLine = styled.span<{ $w: number; $delay: number }>`
  display: block;
  height: 5px;
  width: ${(p) => p.$w}%;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.tertiary};
  opacity: 0.7;
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
`;

export const GoalHint = styled.span`
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.muted};
`;

// ── Step 2: questions ────────────────────────────────────
export const QuestionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0.75rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  width: 200px;
`;

export const QuestionTitle = styled.span`
  display: block;
  height: 4px;
  width: 75%;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.muted};
  opacity: 0.5;
  margin-bottom: 4px;
`;

export const QuestionOpt = styled.span<{ $on?: boolean; $delay: number }>`
  font-size: 0.625rem;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid
    ${(p) => (p.$on ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  background: ${(p) => (p.$on ? p.theme.colors.tertiaryMuted : 'transparent')};
  color: ${(p) => (p.$on ? p.theme.colors.tertiary : p.theme.colors.muted)};
  font-weight: ${(p) => (p.$on ? 600 : 500)};
  animation: ${slideUp} 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
`;

// ── Step 3: depth picker (3 cards, increasing height) ────
export const DepthRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: flex-end;
`;

export const DepthCard = styled.div<{ $h: number; $delay: number; $highlight?: boolean }>`
  width: 32px;
  height: ${(p) => p.$h}px;
  border-radius: 6px;
  background: ${(p) =>
    p.$highlight ? p.theme.colors.tertiaryMuted : p.theme.colors.surface};
  border: 1px solid
    ${(p) => (p.$highlight ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  transform-origin: bottom center;
  animation: ${grow} 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
`;

// ── Step 4: outline tree ─────────────────────────────────
export const Outline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  width: 200px;
`;

export const OutlineRow = styled.span<{ $w: number; $delay: number; $indent?: boolean }>`
  display: block;
  font-size: 0.625rem;
  color: ${(p) => p.theme.colors.muted};
  font-weight: ${(p) => (p.$indent ? 400 : 600)};
  width: ${(p) => p.$w}%;
  margin-left: ${(p) => (p.$indent ? '12px' : '0')};
  padding: 2px 0;
  border-left: 2px solid
    ${(p) => (p.$indent ? p.theme.colors.tertiary : 'transparent')};
  padding-left: 6px;
  animation: ${slideIn} 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
`;

// ── Progress rail ───────────────────────────────────────
export const Rail = styled.div`
  position: relative;
  height: 28px;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
`;

export const RailLine = styled.span`
  position: absolute;
  top: 6px;
  left: calc(4% - 7px);
  right: calc(4% - 7px);
  height: 2px;
  border-radius: 1px;
  background: ${(p) => p.theme.colors.surfaceBorder};
`;

export const RailDot = styled.div<{ $position: number; $reached: boolean; $active: boolean }>`
  position: absolute;
  top: 0;
  left: ${(p) => 4 + p.$position * 0.92}%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  --pulse-color: ${(p) => p.theme.colors.tertiary}66;

  &::before {
    content: '';
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid
      ${(p) => (p.$reached ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
    background: ${(p) =>
      p.$active
        ? p.theme.colors.tertiary
        : p.$reached
        ? p.theme.colors.surface
        : p.theme.colors.surface};
    transition: background 0.3s ease, border-color 0.3s ease;
    ${(p) => p.$active && css`animation: ${pulse} 1.4s ease-out infinite;`}
  }
`;

export const RailLabel = styled.span<{ $active: boolean }>`
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  color: ${(p) => (p.$active ? p.theme.colors.tertiary : p.theme.colors.muted)};
  white-space: nowrap;
  transition: color 0.3s ease;
`;
