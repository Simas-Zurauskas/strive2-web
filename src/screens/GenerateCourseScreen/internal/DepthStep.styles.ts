import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  ${(p) => p.theme.media.tablet} {
    gap: 1.75rem;
  }

  ${(p) => p.theme.media.mobile} {
    gap: 1.25rem;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

  ${(p) => p.theme.media.mobile} {
    font-size: 1.5rem;
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

  ${(p) => p.theme.media.tablet} {
    padding: 1.25rem;
    gap: 0.75rem;
  }

  ${(p) => p.theme.media.mobile} {
    padding: 1rem 1.125rem;
    gap: 0.625rem;
  }
  box-shadow: ${(p) =>
    p.$selected
      ? `0 0 0 1px ${p.theme.colors.tertiary}, var(--shadow-lift)`
      : 'var(--shadow-card)'};
  transition:
    border-color 0.15s ease,
    box-shadow 0.2s ease,
    transform 0.15s ease,
    background 0.15s ease;

  ${(p) => p.theme.media.hover} {
    &:hover {
      border-color: ${(p) => (p.$selected ? p.theme.colors.tertiary : p.theme.colors.muted)};
      box-shadow: ${(p) =>
        p.$selected
          ? `0 0 0 1px ${p.theme.colors.tertiary}, var(--shadow-lift)`
          : 'var(--shadow-lift)'};
      transform: ${(p) => (p.$selected ? 'none' : 'translateY(-1px)')};
    }
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
  flex-wrap: wrap;
  min-width: 0;

  /* On tablet/mobile the header stacks: label (with badge inline) on
     one row, scope on the next. Keeps the label intact instead of
     squeezing it next to a long scope string. */
  ${(p) => p.theme.media.tablet} {
    gap: 0.5rem 0.625rem;
  }
`;

export const CardLabel = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.01em;
  /* Don't let the badge/scope push the label into a stack of one word
     per line — keep it whole. */
  white-space: nowrap;
  min-width: 0;

  ${(p) => p.theme.media.tablet} {
    font-size: 1.1875rem;
  }
`;

export const CardScope = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.005em;
  white-space: nowrap;
  /* Pushes scope to the right edge of the header row regardless of
     whether the Recommended badge is present, so cards align vertically
     across all three tiers. */
  margin-left: auto;

  /* On tablet/mobile, drop margin-left:auto so the scope wraps to its
     own line under the label/badge rather than fighting for space. */
  ${(p) => p.theme.media.tablet} {
    margin-left: 0;
    flex-basis: 100%;
    font-size: 0.75rem;
  }
`;

export const CardSummary = styled.p`
  font-size: 1rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  margin: 0;

  ${(p) => p.theme.media.tablet} {
    font-size: 0.9375rem;
    line-height: 1.55;
  }
`;

export const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  ${(p) => p.theme.media.mobile} {
    padding-left: 1rem;
  }
`;

export const BulletItem = styled.li`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.5;

  ${(p) => p.theme.media.tablet} {
    font-size: 0.875rem;
  }
`;

// ── Skeleton loading ────────────────────────────────────

export const SkeletonCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
