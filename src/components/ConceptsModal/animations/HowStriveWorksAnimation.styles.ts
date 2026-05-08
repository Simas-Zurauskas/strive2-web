import styled, { keyframes, css } from 'styled-components';

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const drawIn = keyframes`
  from { transform: scaleX(0); opacity: 0; }
  to { transform: scaleX(1); opacity: 0.85; }
`;

const orbitOut = keyframes`
  0%   { transform: translate(-50%, 0) scale(0.5); opacity: 0; }
  20%  { transform: translate(-50%, 0) scale(1);   opacity: 1; }
  100% { transform: var(--orbit-end); opacity: 0;   }
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
`;

export const Canvas = styled.div`
  position: relative;
  width: 100%;
  max-width: 460px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 1.25rem;
  gap: 0.875rem;
`;

// ── Stage 1: typed goal pill ─────────────────────────────
export const GoalPill = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.875rem;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.tertiary};
  box-shadow: var(--shadow-card-soft);
  z-index: 4;
`;

export const GoalText = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  display: inline-flex;
  align-items: center;
  gap: 1px;
`;

export const TypedSpan = styled.span`
  display: inline-block;
`;

export const Caret = styled.span`
  display: inline-block;
  width: 1.5px;
  height: 0.95em;
  background: ${(p) => p.theme.colors.tertiary};
  margin-left: 2px;
  ${css`animation: ${blink} 1s steps(2) infinite;`}
`;

// ── Stage 2: module fan ──────────────────────────────────
export const ModuleFan = styled.div<{ $on: boolean }>`
  display: flex;
  gap: 0.375rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: ${(p) => (p.$on ? 1 : 0)};
  transform: translateY(${(p) => (p.$on ? '0' : '-6px')});
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;

  /* Three thin lines branching from the goal pill above */
  &::before {
    content: '';
    position: absolute;
    top: -14px;
    left: 50%;
    width: 1px;
    height: 14px;
    background: ${(p) => p.theme.colors.tertiary};
    opacity: 0.4;
  }
`;

export const ModulePill = styled.span<{ $delay: number; $highlighted?: boolean }>`
  font-size: 0.6875rem;
  padding: 3px 10px;
  border-radius: 999px;
  background: ${(p) =>
    p.$highlighted ? p.theme.colors.tertiary : p.theme.colors.tertiaryMuted};
  color: ${(p) =>
    p.$highlighted ? p.theme.colors.surface : p.theme.colors.tertiary};
  border: 1px solid ${(p) => p.theme.colors.tertiary};
  white-space: nowrap;
  animation: ${fadeUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
  transition: background 0.4s ease, color 0.4s ease;
`;

// ── Stage 3: streaming lesson page ───────────────────────
export const LessonPage = styled.div<{ $on: boolean }>`
  width: 78%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  opacity: ${(p) => (p.$on ? 1 : 0)};
  transform: translateY(${(p) => (p.$on ? '0' : '-4px')}) scale(${(p) => (p.$on ? 1 : 0.96)});
  transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const LessonRow = styled.span<{ $w: number; $delay: number }>`
  display: block;
  height: 5px;
  width: ${(p) => p.$w}%;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.tertiary};
  opacity: 0.65;
  transform-origin: left center;
  animation: ${drawIn} 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
`;

// ── Stage 4: recall cards orbiting out ───────────────────
export const OrbitField = styled.div<{ $on: boolean }>`
  position: relative;
  width: 100%;
  height: 72px;
  opacity: ${(p) => (p.$on ? 1 : 0)};
  transition: opacity 0.4s ease;
  margin-top: 0;
`;

export const OrbitArc = styled.span`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 200px;
  height: 80px;
  border-top: 1px dashed ${(p) => p.theme.colors.tertiary};
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  opacity: 0.45;
`;

export const OrbitCard = styled.span<{ $i: number }>`
  position: absolute;
  bottom: 50%;
  left: 50%;
  width: 14px;
  height: 18px;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.surface};
  border: 1.5px solid ${(p) => p.theme.colors.tertiary};
  box-shadow: var(--shadow-card-soft);
  --orbit-end: translate(${(p) => (p.$i === 0 ? '-180%' : p.$i === 1 ? '-50%' : '80%')}, ${(p) => (p.$i === 1 ? '-220%' : '-160%')}) scale(0.85);
  ${(p) => css`
    animation: ${orbitOut} 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${p.$i * 280}ms infinite;
  `}
`;
