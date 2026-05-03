import Link from 'next/link';
import styled, { css } from 'styled-components';

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 3rem 2rem 5rem;
  width: 100%;
  max-width: 980px;
  margin: 0 auto;

  ${(p) => p.theme.media.tablet} {
    padding: 2rem 1.25rem 3rem;
  }
`;

export const ArticleLayout = styled(Layout)`
  max-width: 760px;
`;

export const Eyebrow = styled.span`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
  margin-bottom: 0.75rem;
`;

export const HeroTitle = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.5rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin: 0 0 0.75rem 0;
  color: ${(p) => p.theme.colors.foreground};

  ${(p) => p.theme.media.tablet} {
    font-size: 2rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.0625rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 2rem 0;
  max-width: 620px;
`;

export const SectionHeading = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 500;
  margin: 3rem 0 1.25rem 0;
  letter-spacing: -0.01em;
`;

export const TopicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const cardBase = css`
  display: block;
  padding: 1.25rem 1.25rem 1.5rem;
  border-radius: 12px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.15s ease-out,
    border-color 0.15s ease-out,
    background 0.15s ease-out;

  &:hover {
    transform: translateY(-1px);
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const TopicCardLink = styled(Link)`
  ${cardBase}
`;

export const TopicCardIconWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${(p) => p.theme.colors.tertiaryMuted};
  color: ${(p) => p.theme.colors.tertiary};
  margin-bottom: 0.875rem;
`;

export const TopicCardTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const TopicCardSummary = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 0.75rem 0;
`;

export const TopicCardCount = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.tertiary};
  letter-spacing: 0.04em;
`;

export const ArticleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const ArticleCardLink = styled(Link)`
  ${cardBase}
  padding: 1rem 1.25rem;
`;

export const ArticleCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const ArticleCardSummary = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.4rem;
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
    color: ${(p) => p.theme.colors.accent};
  }
`;

export const BreadcrumbDivider = styled.span`
  color: ${(p) => p.theme.colors.border};
`;

export const BreadcrumbCurrent = styled.span`
  color: ${(p) => p.theme.colors.foreground};
  font-weight: 500;
`;

export const ArticleTitle = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.125rem;
  font-weight: 500;
  letter-spacing: -0.015em;
  margin: 0 0 0.75rem 0;

  ${(p) => p.theme.media.tablet} {
    font-size: 1.75rem;
  }
`;

export const ArticleSummary = styled.p`
  font-size: 1rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1.5rem 0;
`;

export const ArticleMeta = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 2rem;
  letter-spacing: 0.02em;
`;

export const ArticleBody = styled.div`
  font-size: 1rem;
  line-height: 1.7;
  color: ${(p) => p.theme.colors.foreground};

  > * + * {
    margin-top: 1rem;
  }

  h2 {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-style: italic;
    font-size: 1.4rem;
    font-weight: 500;
    letter-spacing: -0.01em;
    margin: 2.25rem 0 0.75rem 0;
  }

  h3 {
    font-size: 1.0625rem;
    font-weight: 600;
    margin: 1.5rem 0 0.5rem 0;
  }

  p {
    margin: 0 0 1rem 0;
  }

  ul,
  ol {
    margin: 0 0 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.4rem;
  }

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      opacity: 0.85;
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
      'Liberation Mono',
      monospace;
    font-size: 0.875em;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.tertiaryMuted};
    color: ${(p) => p.theme.colors.tertiary};
  }

  pre {
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
    font-size: 0.875rem;
    line-height: 1.55;

    code {
      background: none;
      color: inherit;
      padding: 0;
      font-size: inherit;
    }
  }

  blockquote {
    margin: 1rem 0;
    padding: 0.75rem 1rem;
    border-left: 3px solid ${(p) => p.theme.colors.tertiary};
    background: ${(p) => p.theme.colors.tertiaryMuted};
    border-radius: 0 6px 6px 0;
    color: ${(p) => p.theme.colors.foreground};

    p {
      margin: 0;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.9375rem;
  }

  th,
  td {
    padding: 0.5rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
  }

  th {
    font-weight: 600;
    background: ${(p) => p.theme.colors.surface};
  }
`;

export const RelatedSection = styled.section`
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

export const RelatedHeading = styled.h2`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1rem 0;
`;

export const StillNeedHelpCard = styled.section`
  margin-top: 3rem;
  padding: 1.75rem;
  border-radius: 14px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

export const StillNeedHelpText = styled.div`
  flex: 1;
  min-width: 220px;
`;

export const StillNeedHelpTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
`;

export const StillNeedHelpBody = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const ContactLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  border: 1px solid ${(p) => p.theme.colors.border};
  transition:
    border-color 0.15s,
    color 0.15s,
    background 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.tertiary};
    color: ${(p) => p.theme.colors.tertiary};
  }
`;

export const NotFoundContainer = styled.div`
  text-align: center;
  padding: 4rem 1rem;

  p {
    color: ${(p) => p.theme.colors.muted};
    margin-bottom: 2rem;
  }
`;
