import styled from 'styled-components';

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 2rem;

  ${(p) => p.theme.media.tablet} {
    padding: 1.5rem 1.25rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// ── Dashboard grid ──────────────────────────────────

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
  align-items: start;

  ${(p) => p.theme.media.desktop} {
    grid-template-columns: 1fr;
  }
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
`;

export const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
  overflow: hidden;
`;

// ── Filter bar ──────────────────────────────────────

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const SortToggle = styled.button`
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    border-color 0.15s,
    color 0.15s;
  flex-shrink: 0;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
    color: ${(p) => p.theme.colors.foreground};
  }
`;

// ── Course grids ────────────────────────────────────

export const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
`;

export const DraftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
`;

// ── Bookmark list ───────────────────────────────────

export const BookmarkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const BookmarkItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const BookmarkContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const BookmarkCourse = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  display: block;
`;

export const BookmarkLesson = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// ── Empty & loading states ──────────────────────────

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  gap: 1.5rem;
`;

export const EmptyText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  padding: 2rem 0;
  margin: 0;
`;

export const QuizCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  width: 100%;
  transition: border-color 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const QuizCardLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.theme.colors.muted};
`;

export const QuizCardRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

export const QuizCardCount = styled.span<{ $color: 'warning' | 'accent' }>`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.colors[p.$color]};
`;

export const QuizCardText = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
`;

