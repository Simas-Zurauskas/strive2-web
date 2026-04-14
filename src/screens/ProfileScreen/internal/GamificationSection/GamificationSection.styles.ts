import styled from 'styled-components';

export const Section = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: clamp(1rem, 3cqw, 1.5rem);
  background: ${(p) => p.theme.colors.surface};
  margin-bottom: 1.5rem;
  container-type: inline-size;
`;

export const SectionTitle = styled.h2`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1rem 0;
`;

// ── Badge grid ───────────────────────────────────

export const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: clamp(0.75rem, 3cqw, 1.25rem);
`;

export const BadgeTile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.25rem, 1cqw, 0.375rem);
  cursor: default;
`;

export const BadgeImageWrap = styled.div<{ $earned: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: clamp(6px, 1.5cqw, 12px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.3s, opacity 0.3s;

  ${(p) =>
    !p.$earned &&
    `
    filter: grayscale(1) blur(1.5px);
    opacity: 0.45;
  `}

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
    pointer-events: none;
  }
`;

export const BadgeName = styled.span<{ $earned: boolean }>`
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.25;
  color: ${(p) => (p.$earned ? p.theme.colors.foreground : p.theme.colors.muted)};
`;

export const BadgeRequirement = styled.span<{ $earned: boolean }>`
  font-size: 0.6875rem;
  text-align: center;
  line-height: 1.3;
  color: ${(p) => p.theme.colors.muted};
  opacity: ${(p) => (p.$earned ? 0.85 : 0.65)};
`;

// ── Stats ──────────────────────────────────────────

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 0.5rem;

  ${(p) => p.theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const StatMini = styled.div`
  text-align: center;
  padding: 0.75rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
`;

export const StatMiniValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
`;

export const StatMiniLabel = styled.div`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 0.125rem;
`;

// ── XP bar chart ───────────────────────────────────

export const ChartContainer = styled.div`
  margin-top: 0.75rem;
`;

export const ChartLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 0.5rem;
`;

export const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 80px;
`;

export const Bar = styled.div<{ $height: number }>`
  flex: 1;
  min-width: 0;
  height: ${(p) => Math.max(p.$height, 2)}%;
  background: ${(p) => p.theme.colors.accent};
  border-radius: 3px 3px 0 0;
  transition: height 0.3s ease;
`;

export const BarLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
`;

export const BarLabel = styled.span`
  font-size: 0.5625rem;
  color: ${(p) => p.theme.colors.muted};
`;
