import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(6px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 580px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

// ── Left: course preview card ─────────────────────────────
export const LeftCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem;
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  max-width: 220px;
`;

export const LeftEyebrow = styled.span`
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const LeftTitle = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.3;
`;

export const LeftRows = styled.ul`
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const LeftRow = styled.li<{ $on: boolean; $isCurrent: boolean }>`
  display: grid;
  grid-template-columns: 18px 1fr 60px;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 0.75rem;
  color: ${(p) =>
    p.$isCurrent ? p.theme.colors.foreground : p.theme.colors.muted};
  opacity: ${(p) => (p.$on ? 1 : 0.45)};
  background: ${(p) =>
    p.$isCurrent ? `${p.theme.colors.tertiary}14` : 'transparent'};
  box-shadow: ${(p) =>
    p.$isCurrent ? `inset 0 0 0 1px ${p.theme.colors.tertiary}55` : 'none'};
  transition:
    opacity 0.4s ease,
    color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
`;

export const LeftRowNum = styled.span<{ $on: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  background: ${(p) =>
    p.$on ? p.theme.colors.tertiary : 'transparent'};
  color: ${(p) =>
    p.$on ? p.theme.colors.surface : p.theme.colors.tertiary};
  border: 1px solid ${(p) => p.theme.colors.tertiary};
  transition: all 0.3s ease;
`;

export const LeftRowLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LeftRowBar = styled.span`
  display: block;
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.surfaceBorder};
  overflow: hidden;
`;

export const LeftRowFill = styled.span<{ $on: boolean }>`
  display: block;
  height: 100%;
  width: ${(p) => (p.$on ? '100%' : '0')};
  background: ${(p) => p.theme.colors.tertiary};
  border-radius: 999px;
  transition: width 0.55s cubic-bezier(0.16, 1, 0.3, 1);
`;

// ── Right: drill-down outline card ────────────────────────
export const RightCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem;
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  max-width: 220px;
  height: 180px;
`;

export const RightHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const RightEyebrow = styled.span`
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const StepCounter = styled.span`
  font-size: 0.625rem;
  color: ${(p) => p.theme.colors.muted};
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
`;

export const StepCounterCurrent = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1;
`;

export const RightStage = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;

  & > div {
    width: 100%;
  }
`;

export const OutlineGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ModuleHeader = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.foreground};
  margin-bottom: 2px;
`;

export const LessonItem = styled.span<{ $delay: number }>`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  margin-left: 8px;
  animation: ${slideIn} 0.32s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
`;

export const QuizItem = styled.span<{ $delay: number }>`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.tertiary};
  margin-left: 8px;
  margin-top: 2px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  animation: ${slideIn} 0.32s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
`;
