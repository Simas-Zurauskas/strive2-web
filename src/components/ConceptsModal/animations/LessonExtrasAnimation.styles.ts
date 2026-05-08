import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0%   { background-position: -120% 0; }
  100% { background-position: 220% 0; }
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  padding: 0.5rem 1rem;
`;

// ── Status row ────────────────────────────────────────────
export const StatusRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.6875rem;
  letter-spacing: 0.005em;
`;

export const StatusItem = styled.span<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${(p) => (p.$on ? p.theme.colors.foreground : p.theme.colors.muted)};
  opacity: ${(p) => (p.$on ? 1 : 0.6)};
  transition: color 0.3s ease, opacity 0.3s ease;
`;

export const StatusDot = styled.span<{ $on: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) =>
    p.$on ? p.theme.colors.tertiary : 'transparent'};
  border: 1px solid
    ${(p) =>
      p.$on
        ? p.theme.colors.tertiary
        : `color-mix(in oklab, ${p.theme.colors.muted} 50%, transparent)`};
  transition: background 0.3s ease, border-color 0.3s ease;
`;

export const StatusSep = styled.span`
  color: ${(p) => p.theme.colors.muted};
  opacity: 0.6;
`;

// ── Lesson card ───────────────────────────────────────────
export const LessonCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 280px;
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  overflow: hidden;
`;

export const HeroBlock = styled.div`
  position: relative;
  height: 42px;
  background: linear-gradient(
      90deg,
      transparent 0%,
      ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 20%, transparent)`} 50%,
      transparent 100%
    ),
    ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 12%, ${p.theme.colors.surfaceBorder})`};
  background-size: 220% 100%, 100% 100%;
  animation: ${shimmer} 3.2s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const HeroLabel = styled.span`
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
  font-weight: 600;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.75rem 0.875rem 0.875rem;
`;

export const BodyTitle = styled.div`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.foreground};
  margin-bottom: 4px;
`;

export const BodyLine = styled.span<{ $w: number }>`
  display: block;
  height: 4px;
  width: ${(p) => p.$w}%;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.surfaceBorder};
  opacity: 0.85;
`;

export const LinksBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0.625rem 0.875rem 0.875rem;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 5%, transparent)`};
`;

export const LinksHeader = styled.div`
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.tertiary};
  margin-bottom: 3px;
`;

export const LinkItem = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
`;
