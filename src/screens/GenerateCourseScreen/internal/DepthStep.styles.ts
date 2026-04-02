import styled, { keyframes, css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Title = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

// ── Recommendation bar ──────────────────────────────────

export const RecommendationBar = styled.div`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// ── Depth cards ─────────────────────────────────────────

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const DepthCard = styled.button<{ $selected: boolean }>`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  cursor: pointer;
  background: ${(p) => p.theme.colors.surface};
  border: 1.5px solid ${(p) => (p.$selected ? p.theme.colors.accent : p.theme.colors.surfaceBorder)};
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  ${(p) =>
    p.$selected &&
    css`
      box-shadow: 0 0 0 1px ${p.theme.colors.accent};
    `}

  &:hover {
    border-color: ${(p) => (p.$selected ? p.theme.colors.accent : p.theme.colors.muted)};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CardLabel = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.01em;
`;

export const CardSummary = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
  margin: 0;
`;

export const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const BulletItem = styled.li`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.5;
`;

// ── Skeleton loading ────────────────────────────────────

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

const skeletonBase = css`
  background: ${(p) => p.theme.colors.border};
  border-radius: 4px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const SkeletonCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1.5px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SkeletonLine = styled.div<{ $width?: string }>`
  ${skeletonBase}
  height: 1rem;
  width: ${(p) => p.$width ?? '100%'};
`;

export const SkeletonBullets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding-left: 1.25rem;
`;
