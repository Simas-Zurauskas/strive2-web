import styled, { css, keyframes } from 'styled-components';

export const Layout = styled.div`
  /* width: 100% is critical here — without it, Layout falls into flex
     shrink-to-fit sizing (because its parent <main> uses align-items:
     stretch on a flex-column with margin: 0 auto on the item). With no
     explicit width, Layout's cross-axis size becomes max-content of its
     widest child. During the skeleton state, the widest measurable child
     was the Subtitle's 42rem max-width, collapsing Layout to ~670px and
     making the entire pricing grid narrow. Forcing width: 100% locks
     Layout to fill parent up to its max-width (1100px). */
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.header`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(2rem, 4vw, 2.75rem);
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const Subtitle = styled.p`
  color: ${(p) => p.theme.colors.muted};
  font-size: 1rem;
  max-width: 42rem;
  margin: 0 auto;
  line-height: 1.55;
`;

export const CadenceToggle = styled.div`
  display: inline-flex;
  align-self: center;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 9999px;
  padding: 0.25rem;
`;

export const CadenceBtn = styled.button<{ $active: boolean }>`
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;

  ${(p) =>
    p.$active &&
    css`
      background: ${p.theme.colors.background};
      color: ${p.theme.colors.foreground};
      box-shadow: var(--shadow-card);
    `}
`;

export const SavingsChip = styled.span`
  margin-left: 0.4rem;
  font-size: 0.7rem;
  background: ${(p) => `color-mix(in oklab, ${p.theme.colors.success} 12%, transparent)`};
  color: ${(p) => p.theme.colors.success};
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
  font-weight: 600;
`;

export const Grid = styled.div`
  width: 100%;
  display: grid;
  /* minmax(0, 1fr) instead of plain 1fr — locks columns to equal width
     regardless of content's intrinsic min-width. Prevents real cards from
     widening past skeleton-card width when text content loads in. */
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Card = styled.div<{ $highlighted?: boolean }>`
  position: relative;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 12px;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${(p) =>
    p.$highlighted &&
    css`
      border-color: ${p.theme.colors.accent};
      box-shadow: var(--shadow-pop);
    `}
`;

export const HighlightRibbon = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: ${(p) => p.theme.colors.accent};
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
  white-space: nowrap;
`;

export const PlanName = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 400;
  /* Explicit line-height so rendered height is deterministic — the skeleton
     block stand-in below sizes against this exact number. */
  line-height: 1.2;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const PlanDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  /* Pin the block to the height of the longest description (~8 lines at the
     narrow 4-column card width) so the price row below is vertically aligned
     across cards. Below 4 columns the cards stack and the min-height becomes
     harmless slack. */
  min-height: 12em;
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
`;

export const Price = styled.span`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  color: ${(p) => p.theme.colors.foreground};
  font-variant-numeric: tabular-nums;
`;

export const PriceMeta = styled.span`
  font-size: 0.8125rem;
  line-height: 1.2;
  color: ${(p) => p.theme.colors.muted};
  white-space: nowrap;
`;

export const AllowanceBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.75rem 0;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  flex: 1;
`;

export const AllowanceNumber = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
`;

export const AllowanceMultiplier = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.muted};
  margin-left: 0.1rem;
`;

export const AllowanceUnit = styled.div`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.01em;
`;

// Per-tier plain-language translation of the abstract allowance count
// (e.g. "≈ 4–5 lessons"). Sits beneath AllowanceUnit inside the same
// bordered AllowanceBlock. The `≈` prefix carries the "approximate"
// semantic without italics.
export const AllowanceGuidance = styled.div`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  margin-top: 0.4rem;
`;

export const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// ── Skeleton primitive (loading state) ──────────────────
// SkBar is the ONLY skeleton primitive — sized as a percentage of its
// parent's content box, taking 1em height that scales to the parent's
// font-size. Designed to be placed INSIDE the real wrappers (PlanName,
// PlanDescription, Price, AllowanceNumber, AllowanceUnit, CardFooter) so
// the wrappers themselves compute layout exactly the same as in the
// loaded state — guaranteed zero width or height shift.

const skeletonPulse = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
`;

export const SkBar = styled.span<{ $w?: string; $h?: string; $radius?: string }>`
  display: inline-block;
  vertical-align: middle;
  width: ${(p) => p.$w ?? '100%'};
  /* 1em scales with the parent's font-size — so a SkBar inside PlanName
     (1.5rem font) is taller than one inside AllowanceUnit (0.8125rem). */
  height: ${(p) => p.$h ?? '1em'};
  background: ${(p) => p.theme.colors.surfaceBorder};
  border-radius: ${(p) => p.$radius ?? 'var(--radius-sm)'};
  animation: ${skeletonPulse} 1.6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// TopupsSection / TopupsTitle were removed alongside the in-pricing
// top-up control. Top-up is reachable via the Billing tab and the
// in-context OutOfCreditsModal — keeping it on /pricing
// cannibalized subscription conversions and confused first-time
// visitors with "Need more mid-month?" framing they couldn't apply.

// ── FAQ wrap + title ────────────────────────────────────
// The accordion items themselves come from the shared <Accordion>
// component (client/src/components/Accordion). Only the wrapper section
// + italic-serif title live here.

// One-line clarification under the plan grid (resolves the "*" on every
// "≈ N lessons*" estimate in the cards above). Same string used on the
// landing page teaser and the top-up control footnote, so the definition
// of a "lesson" stays consistent across the app.
export const LessonFootnote = styled.p`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  margin: 1.5rem auto 0;
  max-width: 60ch;
  opacity: 0.85;
`;

export const FaqSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 1rem;
`;

export const FaqTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.75rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0 0 0.5rem;
`;
