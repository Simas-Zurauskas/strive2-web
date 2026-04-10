import styled from 'styled-components';

export const Container = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LevelBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LevelIcon = styled.span`
  font-size: 1.25rem;
  line-height: 1;
`;

export const LevelText = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
`;

export const XpText = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

// ── XP Progress bar ────────────────────────────────

export const XpBarTrack = styled.div`
  height: 6px;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.surfaceBorder};
`;

export const XpBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.accent};
  width: ${(p) => Math.min(p.$percent, 100)}%;
  transition: width 400ms ease;
`;

// ── Stats row ─────────────────────────────────────

export const Divider = styled.div`
  height: 1px;
  background: ${(p) => p.theme.colors.surfaceBorder};
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
`;

export const Stat = styled.div`
  text-align: center;
`;

export const StatValue = styled.div`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
`;

export const StatLabel = styled.div`
  font-size: 0.625rem;
  color: ${(p) => p.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

// ── Streak calendar ───────────────────────────────

export const CalendarLabel = styled.div`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 0.375rem;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
`;

export const CalendarDay = styled.div<{ $level: 0 | 1 | 2 }>`
  aspect-ratio: 1;
  border-radius: 4px;
  background: ${(p) => {
    if (p.$level === 2) return p.theme.colors.accent;
    if (p.$level === 1) return `color-mix(in srgb, ${p.theme.colors.accent} 40%, ${p.theme.colors.surfaceBorder})`;
    return p.theme.colors.surfaceBorder;
  }};
  box-shadow: ${(p) => {
    if (p.$level === 2) return `0 0 6px ${p.theme.colors.accentMuted}`;
    return 'none';
  }};
  transition: background 0.2s, box-shadow 0.2s;
`;

export const CalendarDayEmpty = styled.div`
  aspect-ratio: 1;
`;

export const CalendarDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-top: 0.25rem;
`;

export const CalendarDayLabel = styled.span`
  font-size: 0.5625rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
`;

// ── Next milestone ────────────────────────────────

export const Milestone = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const MilestoneHighlight = styled.span`
  color: ${(p) => p.theme.colors.accent};
  font-weight: 600;
`;
