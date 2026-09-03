import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  margin-bottom: 0;
  width: 100%;
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.125rem;
  border-radius: var(--radius-lg);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

  &:focus-within {
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.accentMuted};
  }
`;

export const SearchIcon = styled.span`
  color: ${(p) => p.theme.colors.muted};
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const InputEl = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  outline: none;

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
  }

  /* Strip the native search clear control — we render our own. */
  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
  }
`;

export const ClearBtn = styled.button`
  border: none;
  background: none;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
  transition: color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
    }
  }
`;

export const Results = styled.ul`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  /* Below the sticky header, not above it. PublicTopBar.styles.ts Bar is
     position:sticky with z-index 30 and this panel was also 30, so on a tie
     DOM order decided it and the dropdown painted over the wordmark, slicing
     it mid-glyph while scrolling. The signed-in path already got this right
     by accident — Navbar is z-index 50 — which is why it was only ever
     visible signed out. Nothing in the app occupies 20-29. (S3-14) */
  z-index: 20;
  list-style: none;
  margin: 0;
  padding: 0.5rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lift);
  /* 380px is the DESKTOP ceiling only; KbSearchBar.tsx overrides this with a
     measured inline max-height whenever the space below the field is smaller.
     Kept here as the SSR / no-JS default. */
  max-height: 380px;
  overflow-y: auto;
  /* Reaching the end of the list must not start scrolling the page behind the
     panel — the same containment the markdown scrollers use. */
  overscroll-behavior: contain;
`;

export const ResultItem = styled.li<{ $active?: boolean }>`
  padding: 0.6875rem 0.875rem;
  border-radius: var(--radius-md);
  background: ${(p) => (p.$active ? p.theme.colors.accentMuted : 'transparent')};
  cursor: pointer;
  transition: background 0.1s;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.accentMuted};
    }
  }
`;

export const ResultTitle = styled.div`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const ResultMeta = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.muted};
`;

export const ResultEmpty = styled.div`
  padding: 1rem 0.875rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  font-style: italic;
  font-family: var(--font-heading-serif), Georgia, serif;
`;
