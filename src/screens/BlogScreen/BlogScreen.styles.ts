import Link from 'next/link';
import styled from 'styled-components';

// Hub layout — wider than reading column. The blog hub is a topic index, like
// /learn — visitors scan, jump in. Posts themselves render in the narrower
// 760px reading column.

// Width matches PublicTopBar / LandingTopBar inner max-width (1120px) so the
// hub content edge-aligns with the nav links above it.
export const HubLayout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 4rem 2rem 6rem;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;

  ${(p) => p.theme.media.tablet} {
    padding: 2.5rem 1.25rem 4rem;
  }
`;

export const Hero = styled.header`
  max-width: 720px;
  margin-bottom: 2.5rem;
`;

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
  margin: 0;
  max-width: 60ch;
`;

// ── Featured post card ────────────────────────────────

export const FeaturedSection = styled.section`
  margin-bottom: 3rem;
`;

export const FeaturedLink = styled(Link)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  padding: 2rem 2rem 2.125rem;
  background: ${(p) => `color-mix(in oklab, ${p.theme.colors.accent} 4%, ${p.theme.colors.surface})`};
  border: 1px solid ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.accent} 22%, ${p.theme.colors.surfaceBorder})`};
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.accent} 50%, ${p.theme.colors.surfaceBorder})`};
  }
`;

export const FeaturedTag = styled.span`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.accent};
`;

export const FeaturedTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.75rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.2;
  margin: 0.375rem 0 0.625rem 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const FeaturedSummary = styled.p`
  font-size: 1rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  max-width: 64ch;
`;

export const FeaturedMeta = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

// ── Category pills ────────────────────────────────────

export const CategoryFilters = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

export const CategoryPill = styled(Link)<{ $active?: boolean }>`
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.4375rem 0.875rem;
  border-radius: 999px;
  border: 1px solid
    ${(p) =>
      p.$active ? p.theme.colors.foreground : p.theme.colors.surfaceBorder};
  background: ${(p) =>
    p.$active ? p.theme.colors.foreground : p.theme.colors.surface};
  color: ${(p) =>
    p.$active ? p.theme.colors.background : p.theme.colors.foreground};
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.foreground};
  }
`;

// ── Post grid ─────────────────────────────────────────

export const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const PostCardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.5rem 1.5rem 1.375rem;
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

export const PostCardCategory = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const PostCardTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.1875rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.25;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const PostCardSummary = styled.p`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const PostCardMeta = styled.div`
  margin-top: auto;
  padding-top: 0.875rem;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  display: flex;
  gap: 0.625rem;
`;

export const PostCardMetaDot = styled.span`
  &::before {
    content: '·';
    margin-right: 0.625rem;
  }
`;

// ── Empty state (no posts in a category) ──────────────

export const EmptyState = styled.div`
  padding: 3rem 0;
  text-align: center;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.9375rem;
`;

// ── Article (post) layout ─────────────────────────────

export const ArticleLayout = styled.article`
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

export const ArticleEyebrow = styled.span`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
  margin-bottom: 0.625rem;
`;

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
  margin: 0 0 1.5rem 0;
  max-width: 60ch;
`;

export const Byline = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const BylineAuthor = styled.span`
  color: ${(p) => p.theme.colors.foreground};
  font-weight: 500;
`;

export const BylineDot = styled.span`
  &::before {
    content: '·';
  }
`;

// Article body inherits the same prose styling as KbScreen articles. The
// blog reuses these via the global Markdown component plus Strive's
// editorial typography here.

export const ArticleBody = styled.div`
  font-size: 1.0625rem;
  line-height: 1.75;
  color: ${(p) => p.theme.colors.foreground};

  > * + * {
    margin-top: 1rem;
  }

  h2 {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-size: 1.625rem;
    font-weight: 500;
    letter-spacing: -0.015em;
    line-height: 1.2;
    margin: 2.75rem 0 0.875rem 0;
    color: ${(p) => p.theme.colors.foreground};
  }

  h3 {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: -0.01em;
    line-height: 1.25;
    margin: 2rem 0 0.625rem 0;
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
    margin-bottom: 0.45rem;
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
    padding: 1.125rem 1.25rem;
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
    margin: 1.5rem 0;
    padding: 0.5rem 0 0.5rem 1.25rem;
    border-left: 2px solid
      ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 60%, transparent)`};
    color: ${(p) => p.theme.colors.foreground};
    font-family: var(--font-heading-serif), Georgia, serif;
    font-style: italic;
    font-size: 1.125rem;
    line-height: 1.55;

    p {
      margin: 0;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
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

  hr {
    border: 0;
    border-top: 1px solid ${(p) => p.theme.colors.border};
    margin: 2.5rem 0;
  }
`;

// ── Read next (curated single recommendation) ─────────

export const ReadNextSection = styled.section`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

export const ReadNextEyebrow = styled.span`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 0.75rem;
`;

export const ReadNextLink = styled(Link)`
  display: block;
  padding: 1.625rem 1.625rem 1.5rem;
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
      `color-mix(in oklab, ${p.theme.colors.accent} 50%, ${p.theme.colors.surfaceBorder})`};
    background: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.accent} 4%, ${p.theme.colors.surface})`};
  }
`;

export const ReadNextCategory = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const ReadNextTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.25;
  margin: 0.5rem 0 0.625rem 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const ReadNextSummary = styled.p`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const ReadNextArrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  margin-top: 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.accent};
  transition: gap 0.15s ease;

  ${ReadNextLink}:hover & {
    gap: 0.5rem;
  }
`;

// ── Related posts ─────────────────────────────────────

export const RelatedSection = styled.section`
  margin-top: 3.25rem;
  padding-top: 2rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

export const RelatedHeading = styled.h2`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1.25rem 0;
`;

export const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
`;

// ── End-of-article CTA back to product ────────────────

export const FinalCta = styled.section`
  margin-top: 3rem;
  padding: 1.75rem 1.75rem;
  border-radius: var(--radius-lg);
  background: ${(p) => `color-mix(in oklab, ${p.theme.colors.accent} 5%, ${p.theme.colors.surface})`};
  border: 1px solid ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.accent} 25%, ${p.theme.colors.surfaceBorder})`};
  text-align: center;
`;

export const FinalCtaHeading = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0 0 0.875rem 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const FinalCtaButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.375rem;
  background: ${(p) => p.theme.colors.accent};
  color: ${(p) => p.theme.colors.background};
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(1.05);
  }
`;
