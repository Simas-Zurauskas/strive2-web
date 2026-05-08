import styled from 'styled-components';

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1rem;
`;

export const Stage = styled.div`
  display: flex;
  align-items: center;
  gap: 1.75rem;
  width: 100%;
  max-width: 460px;
  justify-content: center;

  @media (max-width: 520px) {
    gap: 1rem;
  }
`;

// ── Tree (the morphing outline) ───────────────────────────
export const Tree = styled.div<{ $recommended: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  background: ${(p) =>
    p.$recommended ? p.theme.colors.tertiaryMuted : p.theme.colors.surface};
  border: 1px solid
    ${(p) => (p.$recommended ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  box-shadow: ${(p) =>
    p.$recommended
      ? `0 0 0 4px ${p.theme.colors.tertiaryMuted}`
      : '0 0 0 0 transparent'};
  overflow: hidden;
`;

// Centred column so rows breathe symmetrically as the tier grows/shrinks
// instead of stacking from the top with a shifting empty pad below.
export const RowsCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 0;
`;

export const RowWrap = styled.div`
  display: flex;
  align-items: center;
  transform-origin: left center;
  padding: 2.5px 0;
  overflow: hidden;
`;

export const Row = styled.span<{ $w: number; $indent: boolean; $highlight: boolean }>`
  display: block;
  height: 5px;
  width: ${(p) => p.$w}%;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.tertiary};
  opacity: ${(p) => (p.$highlight ? 0.85 : 0.55)};
  margin-left: ${(p) => (p.$indent ? '14px' : '0')};
  transition: opacity 0.4s ease;
`;

// ── Gauge (commitment meter) ──────────────────────────────
export const Gauge = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  align-items: flex-start;
  width: 140px;
`;

export const GaugeLabel = styled.span`
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const GaugeTrack = styled.div`
  position: relative;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.surfaceBorder};
`;

export const GaugeFill = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.tertiary};
  will-change: width;
`;

export const GaugeMark = styled.span<{
  $position: number;
  $active: boolean;
  $reached: boolean;
}>`
  position: absolute;
  top: 50%;
  left: ${(p) => p.$position}%;
  transform: translate(-50%, -50%) scale(${(p) => (p.$active ? 1.15 : 1)});
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) =>
    p.$reached ? p.theme.colors.tertiary : p.theme.colors.surface};
  border: 1.5px solid ${(p) => p.theme.colors.tertiary};
  box-shadow: ${(p) =>
    p.$active ? `0 0 0 3px ${p.theme.colors.tertiaryMuted}` : '0 0 0 0 transparent'};
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.35s ease, box-shadow 0.35s ease;
`;

// Fixed-height text region — every tier renders the same vertical footprint
// so the gauge column never resizes, which removes the horizontal shift on
// the tree (Stage uses align-items: center).
export const TextSlot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 0.125rem;
`;

export const GaugeTierSlot = styled.div`
  position: relative;
  height: 1.4em;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.9375rem;
  line-height: 1.4;
  color: ${(p) => p.theme.colors.foreground};

  > span {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
  }
`;

export const GaugeRecSlot = styled.div`
  position: relative;
  height: 1.05em;
  margin-top: 2px;
  font-size: 0.5625rem;
  line-height: 1.05;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.tertiary};

  > span {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
  }
`;

export const GaugeTimeSlot = styled.div`
  position: relative;
  height: 1.2em;
  margin-top: 4px;
  font-size: 0.6875rem;
  line-height: 1.2;
  font-style: italic;
  color: ${(p) => p.theme.colors.muted};

  > span {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
  }
`;
