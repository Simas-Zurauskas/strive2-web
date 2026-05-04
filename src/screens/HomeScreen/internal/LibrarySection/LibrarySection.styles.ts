import styled from 'styled-components';

export const Wrap = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const Title = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin: 0 0 0.125rem;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const SortToggle = styled.button`
  padding: 0.4375rem 0.875rem;
  border-radius: var(--radius-md);
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

export const EmptyText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  padding: 2rem 0;
  margin: 0;
`;

// ── Bookmarks ───────────────────────────────────────

export const BookmarkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const BookmarkItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);
  cursor: pointer;
  text-align: left;
  width: 100%;
  font: inherit;
  color: inherit;
  transition:
    border-color 0.15s,
    background 0.15s;

  &:hover {
    border-color: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
    background: ${(p) => p.theme.colors.tertiaryMuted};
  }
`;

/** Tertiary-gold icon mark on the left, signaling "saved/earned." */
export const BookmarkIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.tertiaryMuted};
  color: ${(p) => p.theme.colors.tertiary};
  flex-shrink: 0;
`;

export const BookmarkContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
`;

export const BookmarkLesson = styled.span`
  font-size: 0.9375rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  letter-spacing: -0.005em;
`;

export const BookmarkMeta = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const BookmarkArrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
  transition:
    color 0.15s,
    transform 0.15s;

  ${BookmarkItem}:hover & {
    color: ${(p) => p.theme.colors.tertiary};
    transform: translateX(3px);
  }
`;
