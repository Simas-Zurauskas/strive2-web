import styled, { keyframes } from 'styled-components';

const drawIn = keyframes`
  from { transform: scaleX(0); opacity: 0; }
  to   { transform: scaleX(1); opacity: 0.75; }
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 0.75; transform: scale(1); }
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

// Orbit ring — the hero icon for each goal type sits on a circle around
// the centred shape. Active glyph scales up and fills with tertiary.
export const OrbitRing = styled.div`
  position: relative;
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px dashed ${(p) => p.theme.colors.surfaceBorder};
    border-radius: 50%;
    opacity: 0.5;
  }
`;

export const OrbitGlyph = styled.span<{ $angle: number; $active: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 26px;
  height: 26px;
  margin: -13px 0 0 -13px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => (p.$active ? p.theme.colors.surface : p.theme.colors.tertiary)};
  background: ${(p) => (p.$active ? p.theme.colors.tertiary : p.theme.colors.surface)};
  border: 1px solid ${(p) => p.theme.colors.tertiary};
  transform: rotate(${(p) => p.$angle}deg) translate(118px) rotate(${(p) => -p.$angle}deg)
    scale(${(p) => (p.$active ? 1.15 : 1)});
  transform-origin: center;
  box-shadow: ${(p) =>
    p.$active ? `0 0 0 4px ${p.theme.colors.tertiary}33` : 'none'};
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2;
`;

export const Center = styled.div`
  position: relative;
  z-index: 1;
`;

export const Caption = styled.div`
  position: absolute;
  bottom: -2.5rem;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
`;

export const CaptionVerb = styled.span`
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const CaptionLabel = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1rem;
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Inner shape canvas ────────────────────────────────────
export const ShapeBox = styled.div`
  width: 130px;
  height: 130px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: stretch;
  padding: 0.625rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  justify-content: center;
  box-shadow: var(--shadow-lift);
`;

export const TreeRow = styled.span<{ $w: number; $delay: number }>`
  display: block;
  height: 5px;
  width: ${(p) => p.$w}%;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.tertiary};
  transform-origin: left center;
  align-self: flex-start;
  animation: ${drawIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
`;

export const ListRow = styled.span<{ $w: number; $delay: number }>`
  display: block;
  height: 12px;
  width: ${(p) => p.$w}%;
  border-radius: 4px;
  background: ${(p) => p.theme.colors.tertiary};
  opacity: 0.6;
  margin: 4px 0;
  transform-origin: left center;
  animation: ${drawIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
`;

export const ArcRow = styled.span<{ $w: number; $delay: number }>`
  display: block;
  height: 6px;
  width: ${(p) => p.$w}%;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.tertiary};
  align-self: center;
  animation: ${drawIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
  transform-origin: center;
`;

export const ProjectCanvas = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background:
    linear-gradient(135deg,
      ${(p) => p.theme.colors.tertiary} 0%,
      transparent 50%),
    ${(p) => p.theme.colors.tertiaryMuted};
  border: 1px dashed ${(p) => p.theme.colors.tertiary};
  position: relative;
  animation: ${popIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &::before, &::after {
    content: '';
    position: absolute;
    background: ${(p) => p.theme.colors.surface};
    border-radius: 4px;
  }
  &::before { left: 16%; top: 24%; width: 40%; height: 18%; }
  &::after  { left: 30%; top: 56%; width: 50%; height: 18%; }
`;

export const Bubble = styled.span<{ $align: 'left' | 'right'; $w: number; $delay: number }>`
  display: block;
  height: 14px;
  width: ${(p) => p.$w}%;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.tertiary};
  opacity: 0.7;
  align-self: ${(p) => (p.$align === 'left' ? 'flex-start' : 'flex-end')};
  margin: 2px 0;
  transform-origin: ${(p) => (p.$align === 'left' ? 'left center' : 'right center')};
  animation: ${drawIn} 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
`;
