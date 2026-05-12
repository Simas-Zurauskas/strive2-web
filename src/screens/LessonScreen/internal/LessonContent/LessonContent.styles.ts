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

/**
 * Wrapper for the "Go to {prevLessonName}" button in the Locked state.
 * The shared Button component sets \`white-space: nowrap\` globally so
 * normal-length labels stay on one line. Long lesson names ("Newton's
 * Three Laws as a Storyteller's Toolkit") overflow the viewport. Here
 * we override per-instance: allow the label to wrap, cap the button
 * width to the placeholder's content column so it never spans full
 * width on desktop, and give the multi-line text some line-height.
 */
export const LockedActionWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  & > button {
    white-space: normal;
    line-height: 1.35;
    text-align: center;
    max-width: 26rem;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
  }
`;

export const GeneratingText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.accent};
  text-align: center;
  font-weight: 500;
`;

/**
 * Recall-cards toggle, lifted out of the generic "optional extras" list
 * because it carries the only pedagogically important on/off decision
 * on this surface — spaced retrieval is the lever that makes reading
 * stick. The whole card is a <label> wrapping a hidden checkbox, so
 * clicking anywhere on it flips the switch. Gold-tinted when enabled
 * so the on/off state is legible at a glance.
 */
export const RecallOptionCard = styled.label<{ $enabled: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 380px;
  padding: 1rem 1.125rem 1.125rem;
  border-radius: var(--radius-lg);
  border: 1px solid
    ${(p) =>
      p.$enabled
        ? `color-mix(in oklab, ${p.theme.colors.tertiary} 45%, transparent)`
        : p.theme.colors.surfaceBorder};
  background: ${(p) =>
    p.$enabled
      ? `color-mix(in oklab, ${p.theme.colors.tertiary} 7%, ${p.theme.colors.surface})`
      : p.theme.colors.surface};
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;

  ${(p) => p.theme.media.hover} {
    &:hover {
      border-color: ${(p) =>
        p.$enabled
          ? `color-mix(in oklab, ${p.theme.colors.tertiary} 65%, transparent)`
          : `color-mix(in oklab, ${p.theme.colors.muted} 35%, ${p.theme.colors.surfaceBorder})`};
    }
  }

  &:focus-within {
    outline: none;
    border-color: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.tertiary} 75%, transparent)`};
    box-shadow: 0 0 0 3px
      ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 22%, transparent)`};
  }
`;

/** Visually hidden but keyboard-reachable. The label's :focus-within
 *  picks up the focus ring so the user can still tab to the toggle. */
export const RecallOptionHiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const RecallOptionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const RecallOptionEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

/** Custom on/off switch — gold pill that slides a dot. Visually
 *  louder than a checkbox tick because this is the decision we want
 *  the user to see, not have to hunt for. */
export const RecallSwitch = styled.span<{ $on: boolean }>`
  position: relative;
  display: inline-block;
  width: 38px;
  height: 22px;
  border-radius: var(--radius-pill);
  border: 1px solid
    ${(p) =>
      p.$on
        ? p.theme.colors.tertiary
        : `color-mix(in oklab, ${p.theme.colors.muted} 35%, ${p.theme.colors.surfaceBorder})`};
  background: ${(p) =>
    p.$on
      ? p.theme.colors.tertiary
      : `color-mix(in oklab, ${p.theme.colors.surfaceBorder} 65%, ${p.theme.colors.surface})`};
  transition:
    background 0.18s ease,
    border-color 0.18s ease;
  flex-shrink: 0;
`;

export const RecallSwitchKnob = styled.span<{ $on: boolean }>`
  position: absolute;
  top: 2px;
  left: ${(p) => (p.$on ? '18px' : '2px')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.surface};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
  transition: left 0.18s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const RecallOptionTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 1.125rem;
  letter-spacing: -0.005em;
  line-height: 1.2;
  margin: 0.5rem 0 0.4375rem;
  color: ${(p) => p.theme.colors.foreground};
`;

export const RecallOptionBody = styled.p`
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
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

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      background: ${(p) => p.theme.colors.accentHover};
      border-color: ${(p) => p.theme.colors.accentHover};
      box-shadow: var(--shadow-btn-hover);
    }

    &:hover:not(:disabled) svg.arrow {
      transform: translateX(3px);
    }
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

  ${(p) => p.theme.media.hover} {
    &:hover {
      border-color: ${(p) => p.theme.colors.accent};
      box-shadow: var(--shadow-pop);
      transform: translateY(-2px);
    }
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

