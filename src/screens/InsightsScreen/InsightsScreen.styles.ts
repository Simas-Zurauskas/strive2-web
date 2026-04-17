import styled from 'styled-components';

export const ContentWrap = styled.div`
  padding-top: 4vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: calc(100vh - 56px);
`;

// ── Header ──────────────────────────────────────────

export const PageHeader = styled.div`
  margin-bottom: 0.5rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0.5rem 0 0;
  max-width: 60ch;
`;

// ── Card area ───────────────────────────────────────

export const CardArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.25rem;
  max-width: 720px;
  width: 100%;
`;

// ── Empty state ─────────────────────────────────────

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  gap: 1rem;
  max-width: 560px;
  margin: 0 auto;
`;

export const EmptyIconWrap = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${(p) => `${p.theme.colors.accent}18`};
  color: ${(p) => p.theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

export const EmptyTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

export const EmptyText = styled.p`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  max-width: 46ch;
`;

export const EmptyStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
`;

export const EmptyStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

export const EmptyStatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.02em;
`;

export const EmptyStatLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.theme.colors.muted};
`;
