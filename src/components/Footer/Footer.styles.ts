import styled from 'styled-components';

export const Container = styled.footer`
  margin-top: auto;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  /* Horizontal padding lives here (mirroring the home Layout pattern) so
     the inner 1120px-max block aligns flush with the home container's
     content edges on wide viewports. */
  padding: 0 2rem;

  ${(p) => p.theme.media.tablet} {
    padding: 0 1.25rem;
  }
`;

/**
 * No max-width: footer content stretches to the viewport edges (minus the
 * 2rem horizontal padding on the outer Container). This sidesteps the
 * "which page width should the footer match?" problem — different screens
 * use different max-widths (home 1120px, course wizard 1200px, lesson
 * 740px) and a single fixed footer max-width can't align with all of them.
 */
export const Inner = styled.div`
  width: 100%;
  padding: 3rem 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  ${(p) => p.theme.media.tablet} {
    padding: 2.25rem 0 1.25rem;
    gap: 1.75rem;
  }
`;

// ── Top section: brand + tagline | column grid ─────────

export const Top = styled.div`
  display: grid;
  /* Brand block on the left fills available space; column grid on the
     right is "auto" so it sits flush against the right edge. */
  grid-template-columns: 1fr auto;
  gap: 4rem;
  align-items: start;

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  max-width: 32ch;
`;

export const Wordmark = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.015em;
  line-height: 1;
`;

export const Tagline = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  letter-spacing: -0.005em;
  line-height: 1.4;
`;

// ── Column grid (Learn / Legal / Contact) ──────────────

/**
 * Three-up column grid sitting flush against the footer's right edge.
 * Each column has its own header + stack. "auto" columns + start-aligned
 * items keep everything baseline-aligned regardless of which column is
 * tallest. Collapses to a 2-up grid on tablet (Contact wraps below the
 * Learn/Legal pair) and a single column on phone.
 */
export const ColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 1rem 4rem;
  align-items: start;

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem 2rem;
  }

  ${(p) => p.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  min-width: 0;
`;

/** Tertiary-gold uppercase eyebrow — same vocabulary as section
 *  eyebrows elsewhere in the app. */
export const ColumnTitle = styled.h2`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
  margin: 0 0 0.25rem;
`;

/**
 * Footer link — quieter variant of InlineLink: muted text by default, but
 * keeps the always-underlined treatment so links read as links throughout
 * the app. Underline color is faint at rest, brightens with the text on
 * hover.
 */
export const FooterLink = styled.a`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  text-decoration: underline;
  text-decoration-color: ${(p) => p.theme.colors.border};
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  transition:
    color 0.15s,
    text-decoration-color 0.15s;
  width: fit-content;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    text-decoration-color: ${(p) => p.theme.colors.muted};
  }
`;

// ── Bottom row: faint divider + copyright ──────────────

export const Divider = styled.div`
  height: 1px;
  background: ${(p) => p.theme.colors.border};
  opacity: 0.6;
`;

export const Bottom = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;

  ${(p) => p.theme.media.tablet} {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const Copyright = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
`;

/** Subtle right-aligned hint line. Used for the "Made for learners"
 *  flourish so the bottom row isn't visually empty after moving the
 *  contact email into the Contact column. */
export const BottomHint = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.01em;
  font-style: italic;
  font-family: var(--font-heading-serif), Georgia, serif;
  opacity: 0.85;
`;
