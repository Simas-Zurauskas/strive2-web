import styled, { css, keyframes } from 'styled-components';

const typeIn = keyframes`
  from { width: 0; }
  to   { width: 100%; }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
`;

// ── Outline (top) ─────────────────────────────────────
export const Outline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  max-width: 260px;
`;

export const Row = styled.div<{ $isNew?: boolean }>`
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 0.75rem;
  color: ${(p) =>
    p.$isNew ? p.theme.colors.foreground : p.theme.colors.muted};
  background: ${(p) =>
    p.$isNew ? `${p.theme.colors.tertiary}1c` : 'transparent'};
  box-shadow: ${(p) =>
    p.$isNew ? `inset 0 0 0 1px ${p.theme.colors.tertiary}55` : 'none'};
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease,
    color 0.3s ease;
`;

export const RowNum = styled.span<{ $isNew?: boolean }>`
  width: 22px;
  height: 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5625rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  background: ${(p) =>
    p.$isNew ? p.theme.colors.tertiary : 'transparent'};
  color: ${(p) =>
    p.$isNew ? p.theme.colors.surface : p.theme.colors.tertiary};
  border: 1px solid ${(p) => p.theme.colors.tertiary};
  transition: all 0.3s ease;
`;

export const RowLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// ── Instruction stack (bottom) ────────────────────────
export const InstructionStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 100%;
`;

export const Instruction = styled.div<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 200px;
  max-width: 280px;
  padding: 7px 10px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid
    ${(p) => (p.$active ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.75rem;
  line-height: 1;
  transition: border-color 0.3s ease;
`;

export const InstructionText = styled.span<{ $charCount: number }>`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
  ${(p) => css`
    animation: ${typeIn} ${Math.max(0.45, Math.min(0.95, p.$charCount * 0.03))}s
      steps(${p.$charCount}, end);
  `}
`;

export const InstructionCaret = styled.span`
  display: inline-block;
  width: 1px;
  height: 11px;
  background: ${(p) => p.theme.colors.tertiary};
  flex-shrink: 0;
  ${css`animation: ${blink} 1s step-end infinite;`}
`;

export const InstructionCheck = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.tertiary};
  color: ${(p) => p.theme.colors.surface};
  font-size: 0.5625rem;
  font-weight: 700;
  flex-shrink: 0;
`;

// ── Inline answer (for ASK scenarios) ─────────────────
export const Answer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  font-size: 0.6875rem;
  font-style: italic;
  color: ${(p) => p.theme.colors.muted};
`;

export const AnswerArrow = styled.span`
  color: ${(p) => p.theme.colors.tertiary};
  font-style: normal;
  font-weight: 700;
  flex-shrink: 0;
`;

export const AnswerText = styled.span`
  white-space: nowrap;
`;
