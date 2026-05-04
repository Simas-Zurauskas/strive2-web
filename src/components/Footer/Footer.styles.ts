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
 * Going edge-to-edge means the right edge of the footer content always
 * sits at viewport-right minus the same edge padding the pages use.
 */
export const Inner = styled.div`
  width: 100%;
  padding: 2.75rem 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${(p) => p.theme.media.tablet} {
    padding: 2rem 0 1.25rem;
    gap: 1.25rem;
  }
`;

// ── Top section: brand + tagline | nav columns ─────────

export const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 3rem;
  align-items: start;

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
`;

export const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 36ch;
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

/**
 * Two-column link grid sitting flush against the footer's right edge.
 * `auto` columns + `justify-items: end` aligns each link to the end of
 * its column so the rightmost link's right edge sits exactly at the
 * footer's right edge — same line as the email link in the Bottom row.
 */
export const Nav = styled.nav`
  display: grid;
  grid-template-columns: repeat(2, auto);
  justify-items: end;
  gap: 0.625rem 2.5rem;

  ${(p) => p.theme.media.tablet} {
    gap: 0.625rem 1.5rem;
  }
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
    gap: 0.375rem;
  }
`;

export const Copyright = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
`;

/** Contact email — same underlined link family as FooterLink, slightly smaller. */
export const ContactLink = styled.a`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  text-decoration: underline;
  text-decoration-color: ${(p) => p.theme.colors.border};
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  font-variant-numeric: tabular-nums;
  transition:
    color 0.15s,
    text-decoration-color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    text-decoration-color: ${(p) => p.theme.colors.muted};
  }
`;
