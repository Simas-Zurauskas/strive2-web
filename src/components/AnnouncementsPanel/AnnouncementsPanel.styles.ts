import { motion } from 'framer-motion';
import styled from 'styled-components';
import { thinScrollbar, touchHitArea } from '@/theme';

/**
 * The panel borrows its vocabulary from the landing page's RoadmapSection
 * (`screens/LandingScreen/internal/RoadmapSection/RoadmapSection.styles.ts`):
 * a dotted gold trail with a ringed seal at each stop, serif-italic titles,
 * a gold eyebrow. That section is the most characterful thing in the product
 * and it reads as a *journey*, which is exactly what a reverse-chronological
 * changelog is. Reusing it keeps the panel recognisably Strive rather than a
 * generic notification tray.
 *
 * The drawer is a SIBLING of the navbar, never a child. `S.Nav` carries
 * `backdrop-filter`, `transform` and `will-change: transform` — any one makes
 * it a containing block for fixed descendants, which would clip this panel to
 * the 56px navbar strip. Navbar.tsx:293-301 records the same trap.
 */

export const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: var(--scrim-light);
  opacity: ${(p) => (p.$open ? 1 : 0)};
  pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`;

export const Panel = styled(motion.aside)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(440px, 92vw);
  z-index: 61;
  background: ${(p) => p.theme.colors.background};
  border-left: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  box-shadow: var(--shadow-drawer-l);
  display: flex;
  flex-direction: column;
  /* Home-indicator avoidance. env() is 0 without a cutout, so desktop is
     unchanged. Also what satisfies the mobile audit's R4 rule for a fixed,
     edge-anchored surface. */
  padding-bottom: max(0px, var(--safe-area-bottom));
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 1.5rem 1.25rem;
  flex-shrink: 0;
`;

export const HeaderText = styled.div`
  min-width: 0;
`;

export const Eyebrow = styled.span`
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.tertiaryText};
`;

export const Title = styled.h2`
  margin: 0;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: 1.5rem;
  letter-spacing: -0.01em;
  line-height: 1.15;
  color: ${(p) => p.theme.colors.foreground};
`;

/* The rule under the header is dotted, not solid — it reads as the head of
   the same trail the entries hang from rather than a divider. */
export const HeaderRule = styled.div`
  flex-shrink: 0;
  margin: 0 1.5rem;
  border-top: 2px dotted
    ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 55%, transparent)`};
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    color 180ms cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 120ms cubic-bezier(0.22, 0.61, 0.36, 1);

  svg {
    width: 16px;
    height: 16px;
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
    }
  }

  &:active {
    transform: scale(0.95);
    transition-duration: 80ms;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  ${touchHitArea}
`;

export const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  /* Reaching the end of this scroller must not chain to the page behind it —
     on touch that chain is what triggers pull-to-refresh. */
  overscroll-behavior: contain;
  padding: 1.25rem 0 2rem;
  ${thinScrollbar}
`;

/* The trail. A dotted gold line down the seal column, stopping short at both
   ends so it reads as a path with a beginning and an end rather than a border.
   `::before` is on the list, not on each entry, so it is continuous. */
export const Trail = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 14px;
    bottom: 14px;
    left: calc(1.5rem + 13px);
    border-left: 2px dotted
      ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 55%, transparent)`};
  }
`;

export const Entry = styled.article`
  position: relative;
  display: grid;
  grid-template-columns: 28px 1fr;
  column-gap: 1rem;
  padding: 0 1.5rem 1.75rem;

  &:last-child {
    padding-bottom: 0;
  }
`;

/* Ringed seal, opaque so the dotted trail appears to pass behind it — the
   same double-inset ring the roadmap's numbered seals use. */
export const Seal = styled.span<{ $unseen: boolean }>`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid
    ${(p) => (p.$unseen ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  box-shadow:
    inset 0 0 0 2px ${(p) => p.theme.colors.background},
    inset 0 0 0 3px
      ${(p) =>
        p.$unseen
          ? `color-mix(in srgb, ${p.theme.colors.tertiary} 45%, transparent)`
          : 'transparent'};
  color: ${(p) => (p.$unseen ? p.theme.colors.tertiaryText : p.theme.colors.muted)};

  svg {
    width: 12px;
    height: 12px;
  }
`;

/* The unseen marker: a small solid gold pip inside the seal. */
export const SealPip = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.tertiary};
`;

export const Content = styled.div`
  min-width: 0;
  padding-top: 0.125rem;
`;

export const EntryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const EntryDate = styled.time`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
`;

export const NewTag = styled.span`
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.tertiaryText};
  border: 1px solid
    ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 55%, transparent)`};
  border-radius: 999px;
  padding: 0.0625rem 0.4375rem;
  line-height: 1.6;
`;

export const EntryTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: 1.125rem;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: ${(p) => p.theme.colors.foreground};
`;

/* Illustration. Framed rather than bled to the edge, so it sits inside the
   trail's column and reads as part of the entry.
   A <button>, not a <figure>: it opens a lightbox, so it has to be reachable
   by keyboard and announced as an action. */
export const Figure = styled.button`
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  margin: 0 0 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: ${(p) => p.theme.colors.surface};
  line-height: 0;
  cursor: zoom-in;
  transition: border-color 180ms ease;

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      border-color: ${(p) =>
        `color-mix(in srgb, ${p.theme.colors.tertiary} 55%, transparent)`};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

/*
 * The expand affordance.
 *
 * Visible by DEFAULT at a low weight, and only strengthened on hover. A
 * hover-only reveal would leave every touch device with no indication the
 * image opens at all — and touch is where a cramped 380px panel image most
 * needs the escape hatch. The hover step is wrapped in `media.hover` so a tap
 * cannot leave it stuck in the hovered state.
 */
export const ExpandHint = styled.span`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(20, 18, 16, 0.55);
  color: rgba(255, 255, 255, 0.92);
  opacity: 0.85;
  transition:
    opacity 180ms ease,
    background 180ms ease;
  pointer-events: none;

  svg {
    width: 13px;
    height: 13px;
  }

  ${(p) => p.theme.media.hover} {
    ${Figure}:hover & {
      opacity: 1;
      background: rgba(20, 18, 16, 0.78);
    }
  }
`;

export const EntryBody = styled.div`
  font-size: 0.8125rem;
  line-height: 1.65;
  color: ${(p) => p.theme.colors.muted};

  p {
    margin: 0 0 0.625rem;
  }

  p:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin: 0 0 0.625rem;
    padding-left: 1.125rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  strong {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 600;
  }

  code {
    font-size: 0.75rem;
    padding: 0.0625rem 0.25rem;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

export const Empty = styled.p`
  margin: 0;
  padding: 3rem 1.5rem;
  text-align: center;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
`;
