import Link from 'next/link';
import styled, { css } from 'styled-components';

// ── Layout ────────────────────────────────────────────

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 4rem 2rem 6rem;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;

  ${(p) => p.theme.media.tablet} {
    padding: 2.5rem 1.25rem 4rem;
  }
`;

// ── Editorial header (shared by hub / topic / article) ───

export const Eyebrow = styled.span`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
  margin-bottom: 0.625rem;
`;

export const HeroTitle = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.75rem;
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.1;
  margin: 0 0 0.875rem 0;
  color: ${(p) => p.theme.colors.foreground};

  ${(p) => p.theme.media.tablet} {
    font-size: 2.125rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.0625rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 2.25rem 0;
  max-width: 60ch;
`;

/**
 * Section heading — serif non-italic. The page title above is already
 * italic; making section headings italic too means two italic moments
 * stacking, which crowds the page. Italic budget: one per screen.
 */
export const SectionHeading = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.375rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin: 3.25rem 0 1.25rem 0;
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Topic grid (hub) ──────────────────────────────────

export const TopicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
  }
`;

/**
 * Card hover uses accent-green (the "go" / interactive semantic across
 * the app). Tertiary-gold is reserved for "earned/saved" affordances
 * (bookmarks, finished states) — using it here read as a different
 * meaning than intended and felt off against the cream surface.
 */
const cardBase = css`
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    border-color: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.accent} 35%, ${p.theme.colors.surfaceBorder})`};
    background: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.accent} 3%, ${p.theme.colors.surface})`};
  }
`;

/**
 * Topic card — type-led, no icon. Title uses serif (no italic) so it
 * doesn't compete with the section heading and hero, both of which are
 * italic. The arrow at the bottom uses margin-top: auto so it bottom-
 * aligns across every card regardless of summary length.
 */
export const TopicCardLink = styled(Link)`
  ${cardBase}
  padding: 1.5rem 1.5rem 1.375rem;
  gap: 0.5rem;
  position: relative;
`;

export const TopicCardHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
`;

export const TopicCardTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const TopicCardCount = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
`;

export const TopicCardSummary = styled.p`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const TopicCardArrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  margin-top: auto;
  padding-top: 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  transition:
    color 0.15s ease,
    gap 0.15s ease;

  ${TopicCardLink}:hover & {
    color: ${(p) => p.theme.colors.accent};
    gap: 0.5rem;
  }
`;

// ── Article list (topic page + related) ───────────────

export const ArticleList = styled.div`
  display: flex;
  flex-direction: column;
`;

/**
 * Article rows are list items separated by hairlines, not floating cards.
 * Reads as a table-of-contents — denser, more editorial than cards.
 * Hover matches the lesson sidebar / Further Reading pattern: faint
 * accent background tint + a subtle 4px slide right + title shifts to
 * accent. Same affordance language across the app.
 */
export const ArticleCardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.25rem 1rem;
  margin: 0 -1rem;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  transition:
    background 0.15s ease,
    transform 0.15s ease,
    color 0.15s ease;

  &:first-child {
    border-top: 1px solid ${(p) => p.theme.colors.border};
  }

  &:hover {
    background: ${(p) => `color-mix(in oklab, ${p.theme.colors.accent} 5%, transparent)`};
    transform: translateX(4px);
  }

  &:hover h3 {
    color: ${(p) => p.theme.colors.accent};
  }
`;

export const ArticleCardTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.0625rem;
  font-weight: 500;
  letter-spacing: -0.005em;
  line-height: 1.3;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};
  transition: color 0.15s ease;
`;

export const ArticleCardSummary = styled.p`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

// ── Breadcrumb ────────────────────────────────────────

export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
`;

export const BreadcrumbLink = styled(Link)`
  color: ${(p) => p.theme.colors.muted};
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

/** Editorial middle-dot separator instead of slash. */
export const BreadcrumbDivider = styled.span`
  display: inline-block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.5;
`;

export const BreadcrumbCurrent = styled.span`
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Article page ──────────────────────────────────────

export const ArticleTitle = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.5rem;
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.1;
  margin: 0 0 1rem 0;
  color: ${(p) => p.theme.colors.foreground};

  ${(p) => p.theme.media.tablet} {
    font-size: 2rem;
  }
`;

export const ArticleSummary = styled.p`
  font-size: 1.125rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1.25rem 0;
  max-width: 60ch;
`;

export const ArticleMeta = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

/**
 * Article body. Cleaner than v1: code/blockquote use neutral surfaces
 * instead of tertiary-gold backgrounds (the gold was over-decorative for
 * a reading page — looked like marketing). H2/H3 sized for editorial
 * rhythm. Links use the inline accent underline.
 */
export const ArticleBody = styled.div`
  font-size: 1rem;
  line-height: 1.75;
  color: ${(p) => p.theme.colors.foreground};

  > * + * {
    margin-top: 1rem;
  }

  h2 {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: -0.015em;
    line-height: 1.2;
    margin: 2.5rem 0 0.75rem 0;
    color: ${(p) => p.theme.colors.foreground};
  }

  h3 {
    font-size: 1.0625rem;
    font-weight: 600;
    letter-spacing: -0.005em;
    line-height: 1.3;
    margin: 1.75rem 0 0.5rem 0;
    color: ${(p) => p.theme.colors.foreground};
  }

  p {
    margin: 0 0 1rem 0;
  }

  ul,
  ol {
    margin: 0 0 1rem 0;
    padding-left: 1.25rem;
  }

  li {
    margin-bottom: 0.4rem;
    padding-left: 0.25rem;
  }

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: underline;
    text-decoration-color: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.accent} 40%, transparent)`};
    text-underline-offset: 3px;
    text-decoration-thickness: 1px;
    transition: text-decoration-color 0.15s;

    &:hover {
      text-decoration-color: ${(p) => p.theme.colors.accent};
    }
  }

  strong {
    font-weight: 600;
  }

  code {
    font-family:
      ui-monospace,
      SFMono-Regular,
      'SF Mono',
      Menlo,
      Consolas,
      monospace;
    font-size: 0.875em;
    padding: 0.125rem 0.375rem;
    border-radius: var(--radius-sm);
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    color: ${(p) => p.theme.colors.foreground};
  }

  pre {
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    border-radius: var(--radius-md);
    padding: 1rem 1.125rem;
    overflow-x: auto;
    font-size: 0.875rem;
    line-height: 1.6;

    code {
      background: none;
      border: none;
      color: inherit;
      padding: 0;
      font-size: inherit;
    }
  }

  blockquote {
    margin: 1.25rem 0;
    padding: 0.5rem 0 0.5rem 1.25rem;
    border-left: 2px solid
      ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 60%, transparent)`};
    color: ${(p) => p.theme.colors.foreground};
    font-family: var(--font-heading-serif), Georgia, serif;
    font-style: italic;
    font-size: 1.0625rem;
    line-height: 1.55;

    p {
      margin: 0;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.25rem 0;
    font-size: 0.9375rem;
  }

  th,
  td {
    padding: 0.625rem 0.875rem;
    text-align: left;
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
  }

  th {
    font-weight: 600;
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${(p) => p.theme.colors.muted};
    border-bottom-color: ${(p) => p.theme.colors.surfaceBorder};
  }
`;

// ── Related articles ──────────────────────────────────
// No top border on the section: the article list below has its own
// border-top on the first row, so a second hairline here would just
// stack against it. Whitespace + the uppercase eyebrow is enough
// visual division from the article body above.

export const RelatedSection = styled.section`
  margin-top: 4rem;
`;

export const RelatedHeading = styled.h2`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 0.5rem 0;
`;

// ── Not-found ─────────────────────────────────────────

export const NotFoundContainer = styled.div`
  text-align: center;
  padding: 4rem 1rem 2rem;

  p {
    color: ${(p) => p.theme.colors.muted};
    margin: 0 auto 2rem;
    max-width: 48ch;
    line-height: 1.6;
  }
`;
