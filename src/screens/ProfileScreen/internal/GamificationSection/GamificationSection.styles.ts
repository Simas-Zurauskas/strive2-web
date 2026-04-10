import styled from 'styled-components';

export const Section = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1rem 0;
`;

// ── Achievements grid ──────────────────────────────

export const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const AchievementCard = styled.div<{ $earned: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  opacity: ${(p) => (p.$earned ? 1 : 0.45)};
  transition: opacity 0.2s;
`;

export const AchievementIcon = styled.span`
  font-size: 1.25rem;
  line-height: 1;
  flex-shrink: 0;
`;

export const AchievementInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
`;

export const AchievementName = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

export const AchievementDesc = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
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
