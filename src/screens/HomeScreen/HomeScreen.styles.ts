import styled from 'styled-components';

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 3.5rem 2rem 6rem;

  ${(p) => p.theme.media.tablet} {
    padding: 2rem 1.25rem 4rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// ── Empty / first-run state ────────────────────────────
// Mirrors the chrome on RecallScreen / QuizzesScreen empty states
// (rule + eyebrow + non-italic serif title) so the three "nothing here
// yet" moments across the app read as the same family.

export const EmptyState = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem 3.5rem;
  gap: 0.75rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
`;

export const EmptyPreviewSlot = styled.div`
  width: 100%;
  margin-bottom: 1.25rem;
`;

export const EmptyRule = styled.span`
  display: block;
  width: 36px;
  height: 1px;
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
  margin-bottom: 0.5rem;
`;

export const EmptyEyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const EmptyTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin: 0.25rem 0 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const EmptyText = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  max-width: 44ch;
  line-height: 1.6;
  margin: 0;
`;

export const EmptyAction = styled.div`
  margin-top: 1rem;
`;

// ── Drafts inline rail ────────────────────────────────

export const DraftsBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const SectionLead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
`;

export const SectionLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
`;

export const SectionLink = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  font: inherit;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const DraftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
`;
