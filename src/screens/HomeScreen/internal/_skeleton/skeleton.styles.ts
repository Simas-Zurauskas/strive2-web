import styled, { css, keyframes } from 'styled-components';

/**
 * Subtle 1.6s pulse — calm, editorial, not the Pinterest "shimmer" treatment.
 * Cycles between border-color (low) and a slightly lifted tone so blocks feel
 * alive without being kinetic. Respects prefers-reduced-motion.
 */
const pulse = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1;    }
`;

export const skeletonBlockCss = css`
  background: ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-sm);
  animation: ${pulse} 1.6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/**
 * Generic skeleton block. Width / height / radius are passed via props so
 * callers can shape them to fit the target element. Defaults to a thin
 * inline-friendly bar.
 */
export const SkeletonBlock = styled.div<{
  $w?: string;
  $h?: string;
  $radius?: string;
  $maxW?: string;
}>`
  ${skeletonBlockCss}
  width: ${(p) => p.$w ?? '100%'};
  height: ${(p) => p.$h ?? '0.875rem'};
  ${(p) => (p.$radius ? `border-radius: ${p.$radius};` : '')}
  ${(p) => (p.$maxW ? `max-width: ${p.$maxW};` : '')}
`;

/**
 * Skeleton wrapper that mirrors the same chrome as a real card (white
 * surface, hairline border, identical radius / padding). Children are the
 * skeleton blocks for that card's internal layout.
 */
export const SkeletonCard = styled.div<{ $radius?: string }>`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: ${(p) => p.$radius ?? 'var(--radius-xl)'};
  overflow: hidden;
`;
