import Link from 'next/link';
import styled, { css } from 'styled-components';

// Topic-page layout (narrow editorial column). Used by /learn/[topic] —
// reading-shaped content with a 760px reading width. Matches KbScreen.

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

// Hub layout (wider). The /learn hub is a topic index, not a reading page.
// 55+ topic cards benefit from a multi-column grid that's both denser for
// visitors and semantically richer for crawlers (more internal links per
// viewport). The hero column is constrained to ~720px so the prose stays
// readable while the topic grid below uses the full width.
//
// Width matches PublicTopBar / LandingTopBar inner max-width (1120px) so
// the hub content edge-aligns with the nav links above it.

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

export const HubHero = styled.header`
  max-width: 720px;
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
  margin: 0 0 2.25rem 0;
  max-width: 60ch;
`;

export const SectionHeading = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.375rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin: 3.25rem 0 1.25rem 0;
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Hub: topic grid ───────────────────────────────────
// Auto-fill: 4 cols on wide desktop, 3 on standard desktop, 2 on tablet,
// 1 on mobile. Min 280px keeps the title + 2-line summary readable.

export const TopicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
  }
`;

// Category sections — group cards by category with an h2 heading. Gives
// Google a clear topic-cluster signal and helps visitors scan a long index.

export const CategoryBlock = styled.section`
  margin-top: 2.75rem;
`;

export const CategoryHeading = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: -0.005em;
  line-height: 1.2;
  margin: 0 0 1rem 0;
  color: ${(p) => p.theme.colors.foreground};
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
`;

export const CategoryCount = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.muted};
`;

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

  ${(p) => p.theme.media.hover} {
    &:hover {
      border-color: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.accent} 35%, ${p.theme.colors.surfaceBorder})`};
      background: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.accent} 3%, ${p.theme.colors.surface})`};
    }
  }
`;

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

export const TopicCardCategory = styled.span`
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
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

// ── Topic page ────────────────────────────────────────

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

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 2.5rem 0;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const PrimaryCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
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

export const CtaMicrocopy = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0.625rem 0 0 0;
`;

export const OutcomesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
`;

export const OutcomeItem = styled.li`
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.foreground};

  &::before {
    content: '';
    flex-shrink: 0;
    width: 6px;
    height: 6px;
    margin-top: 0.6rem;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.accent};
  }
`;

export const ModuleList = styled.ol`
  list-style: none;
  counter-reset: module;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

export const ModuleRow = styled.li`
  counter-increment: module;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  &::before {
    content: counter(module, decimal-leading-zero);
    flex-shrink: 0;
    font-family: var(--font-heading-serif), Georgia, serif;
    font-size: 0.875rem;
    color: ${(p) => p.theme.colors.tertiary};
    min-width: 2rem;
  }
`;

export const ModuleTitle = styled.span`
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.45;
`;

export const ModuleLessonCount = styled.span`
  flex-shrink: 0;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const SampleCaption = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 1rem 0 0 0;
  font-style: italic;
`;

// ── FAQ ───────────────────────────────────────────────

export const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const FaqItem = styled.div`
  padding: 1.25rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);
`;

export const FaqQuestion = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.0625rem;
  font-weight: 500;
  letter-spacing: -0.005em;
  line-height: 1.3;
  margin: 0 0 0.5rem 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const FaqAnswer = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

// ── Final CTA strip ───────────────────────────────────

export const FinalCta = styled.section`
  margin-top: 4rem;
  padding: 2rem 1.75rem;
  border-radius: var(--radius-lg);
  background: ${(p) => `color-mix(in oklab, ${p.theme.colors.accent} 5%, ${p.theme.colors.surface})`};
  border: 1px solid ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.accent} 25%, ${p.theme.colors.surfaceBorder})`};
  text-align: center;
`;

export const FinalCtaHeading = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.625rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.2;
  margin: 0 0 0.625rem 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const FinalCtaSubhead = styled.p`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1.25rem 0;
`;
