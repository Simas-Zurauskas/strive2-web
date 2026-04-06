import styled, { keyframes, css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Eyebrow = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const Title = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.5rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.025em;
  line-height: 1.1;

  ${(p) => p.theme.media.tablet} {
    font-size: 1.75rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.0625rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  position: sticky;
  bottom: 0;
  background: ${(p) => p.theme.colors.background};
  padding: 0.5rem 1rem 1.25rem;
  margin: 0 -1rem;
  z-index: 2;
  box-shadow: 0 -8px 16px ${(p) => p.theme.colors.background};
`;

// ── Recommendation bar ──────────────────────────────────

export const RecommendationBar = styled.div`
  font-size: 1rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  flex-wrap: wrap;
`;

// ── Depth cards ─────────────────────────────────────────

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const DepthCard = styled.button<{ $selected: boolean }>`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  cursor: pointer;
  background: ${(p) => (p.$selected ? p.theme.colorsLib.secondary + '08' : p.theme.colors.surface)};
  border: 1px solid ${(p) => (p.$selected ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  border-radius: 8px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: ${(p) =>
    p.$selected
      ? `0 0 0 1px ${p.theme.colors.tertiary}, 0 4px 12px rgba(0, 0, 0, 0.08)`
      : '0 1px 3px rgba(0, 0, 0, 0.04)'};
  transition:
    border-color 0.15s ease,
    box-shadow 0.2s ease,
    transform 0.15s ease,
    background 0.15s ease;

  &:hover {
    border-color: ${(p) => (p.$selected ? p.theme.colors.tertiary : p.theme.colors.muted)};
    box-shadow: ${(p) =>
      p.$selected
        ? `0 0 0 1px ${p.theme.colors.tertiary}, 0 4px 12px rgba(0, 0, 0, 0.08)`
        : '0 4px 12px rgba(0, 0, 0, 0.08)'};
    transform: ${(p) => (p.$selected ? 'none' : 'translateY(-1px)')};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const CardLabel = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.01em;
`;

export const CardSummary = styled.p`
  font-size: 1rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  margin: 0;
`;

export const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const BulletItem = styled.li`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.5;
`;

// ── Skeleton loading ────────────────────────────────────

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
`;

const skeletonBase = css`
  background: ${(p) => p.theme.colors.border};
  border-radius: 4px;
  animation: ${pulse} 1.8s ease-in-out infinite;
`;

export const SkeletonCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

// ── Error state ─────────────────────────────────────────

export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.9375rem;
`;
