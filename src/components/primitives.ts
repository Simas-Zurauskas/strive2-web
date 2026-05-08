/**
 * Shared styled-component primitives (page shell, labels, tab strips, etc.)
 * that are too small to warrant a per-component folder. Defined at file level
 * by design — the `ComponentName/ComponentName.tsx + .styles.ts + index.ts`
 * pattern is reserved for primitives that ship logic, props, or refs.
 */
import styled from 'styled-components';

// ── Page layout ────────────────────────────────────

export const PageLayout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 2rem;
  width: 100%;
  max-width: 860px;
  margin: 0 auto;

  ${(p) => p.theme.media.tablet} {
    padding: 2rem 1.25rem;
  }
`;

// ── Filter pills ────────────────────────────────────

export const FilterTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const FilterTab = styled.button<{ $active?: boolean }>`
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  border: none;
  background: ${(p) => (p.$active ? p.theme.colors.surface : 'transparent')};
  color: ${(p) => (p.$active ? p.theme.colors.foreground : p.theme.colors.muted)};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

  ${(p) => p.$active && `box-shadow: 0 0 0 1px ${p.theme.colors.surfaceBorder};`}

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

// ── Top-level tabs ─────────────────────────────────

export const TopTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  margin-bottom: 1.25rem;
`;

export const TopTab = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0;
  border: none;
  background: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  color: ${(p) => (p.$active ? p.theme.colors.foreground : p.theme.colors.muted)};
  border-bottom: 2px solid ${(p) => (p.$active ? p.theme.colors.accent : 'transparent')};
  margin-bottom: -1px;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;

// ── Typography ──────────────────────────────────────

export const Eyebrow = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const SectionLabel = styled.h2`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const TextAction = styled.button<{ $variant?: 'default' | 'danger' }>`
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  color: ${(p) => p.theme.colors.muted};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => (p.$variant === 'danger' ? p.theme.colors.error : p.theme.colors.foreground)};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid
      ${(p) => (p.$variant === 'danger' ? p.theme.colors.error : p.theme.colors.accent)};
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;
