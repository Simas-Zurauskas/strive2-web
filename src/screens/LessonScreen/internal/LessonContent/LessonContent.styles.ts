import styled from 'styled-components';
import { SectionLabel } from '@/components';

// ── Container ─────────────────────────────────────────

export const Container = styled.div`
  max-width: 740px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;

  ${(p) => p.theme.media.tablet} {
    padding: 1.25rem 1.25rem;
    gap: 1.5rem;
  }
`;

// ── Scaled content wrapper ────────────────────────────

export const ScaledContent = styled.div<{ $scale: number }>`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-size: ${(p) => p.$scale}rem;

  ${(p) => p.theme.media.tablet} {
    gap: 1.5rem;
  }
`;

// ── Lesson description ────────────────────────────────

export const LessonDescription = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.125em;
  font-style: italic;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  max-width: 620px;
`;

// ── Placeholder (no content yet) ──────────────────────
// Editorial "ready to generate" moment, not a dashed empty-state box.
// Clean surface card with a typographic header (eyebrow + serif italic
// heading + muted lead) above the optional-extras checkbox rows and the
// primary CTA.

export const Placeholder = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.75rem;
  padding: 3.25rem 2rem;
  border-radius: var(--radius-xl);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
`;

export const PlaceholderHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  max-width: 30ch;
`;

export const PlaceholderRule = styled.span`
  display: block;
  width: 36px;
  height: 1px;
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
  margin-bottom: 0.375rem;
`;

export const PlaceholderEyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const PlaceholderTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.75rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const PlaceholderLead = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.55;
  margin: 0;
  max-width: 32ch;
`;

/** Fallback line used when the previous lesson hasn't been generated yet. */
export const PlaceholderText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  line-height: 1.55;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  max-width: 28ch;
`;

export const GeneratingText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.accent};
  text-align: center;
  font-weight: 500;
`;

/** Wrapper that pairs the small "Optional" caption with the options card. */
export const GenerateOptionsBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 380px;
`;

/** Small uppercase caption above the options card; sits next to the help "?" so
 *  the question mark has a labelled home instead of floating in body prose. */
export const GenerateOptionsCaption = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.muted};
`;

/** Two checkbox rows in a slim hairline-bordered card. */
export const GenerateOptions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.background};
  overflow: hidden;

  /* Hairline divider between rows. */
  & > * + * {
    border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }
`;

export const GenerateOptionRow = styled.div`
  padding: 0.875rem 1rem;
`;

export const GenerateOptionsHeading = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  align-self: center;
`;

// ── Streaming indicators ──────────────────────────────

export const StreamingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.accent};
  font-weight: 500;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.accent};
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
`;

export const FinishingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  font-weight: 400;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.muted};
    animation: pulse 1.5s ease-in-out infinite;
  }
`;

// ── Finish section ────────────────────────────────────

/**
 * Sits at the closing of a lesson — between the inline notes and the
 * prev/next nav. Generous vertical breathing so it reads as "the lesson's
 * end" rather than yet-another-button. Hairline above + below frame the
 * moment without competing with the lesson content.
 */
/**
 * Padding is intentionally asymmetric: the parent Container has gap: 2rem
 * which sits between this section's bottom edge and the Nav's border-top
 * below. To make the *visible* distance from the button to each hairline
 * symmetric, we add 2rem to padding-top (compensating for that gap below).
 * If you change Container.gap, change this padding-top in lockstep.
 */
export const CompleteSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem 0 0;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

/** Primary, filled accent green — this is the page's main action. */
export const CompleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  min-height: 3rem;
  padding: 0.75rem 1.625rem;
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => p.theme.colors.accent};
  background: ${(p) => p.theme.colors.accent};
  color: var(--on-accent);
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  letter-spacing: -0.005em;
  cursor: pointer;
  box-shadow: var(--shadow-btn);
  transition:
    background 160ms ease,
    box-shadow 160ms ease,
    transform 80ms ease;

  & svg {
    width: 14px;
    height: 14px;
    transition: transform 160ms ease;
  }

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.accentHover};
    border-color: ${(p) => p.theme.colors.accentHover};
    box-shadow: var(--shadow-btn-hover);
  }

  &:hover:not(:disabled) svg.arrow {
    transform: translateX(3px);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
    box-shadow: none;
  }
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * Post-finish acknowledgement. Tertiary-gold tinted (matches the "earned"
 * vocabulary used by bookmarks) rather than success-green so it doesn't
 * compete with the green primary button. Past-imperfect copy.
 */
export const CompletedBanner = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  min-height: 3rem;
  padding: 0.6875rem 1.5rem;
  border-radius: var(--radius-md);
  background: ${(p) => p.theme.colors.tertiaryMuted};
  border: 1px solid
    ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 30%, transparent)`};
  color: ${(p) => p.theme.colors.tertiary};
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.005em;

  & svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

// ── Navigation ────────────────────────────────────────

/**
 * Prev/Next nav. No border-top + no padding-top — each NavButton is its
 * own bordered card so the parent hairline would just create a competing
 * frame, and the parent Container.gap (2rem) already provides breathing
 * room above the row. That gap mirrors the Container's top padding (2rem)
 * so the page feels symmetric top-to-bottom whether the lesson is
 * generated or still in the placeholder state.
 */
export const Nav = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  ${(p) => p.theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const NavButton = styled.button<{ $hidden?: boolean; $direction?: 'prev' | 'next' }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  text-align: ${(p) => (p.$direction === 'next' ? 'right' : 'left')};
  font-family: inherit;
  cursor: pointer;
  visibility: ${(p) => (p.$hidden ? 'hidden' : 'visible')};
  transition:
    border-color 0.2s,
    box-shadow 0.2s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow: var(--shadow-pop);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
`;

export const NavLabel = styled(SectionLabel).attrs({ as: 'span' })``;

export const NavLessonName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.3;
`;

