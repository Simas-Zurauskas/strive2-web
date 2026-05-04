import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  align-items: stretch;
  width: 100%;
  /* 16rem absorbs both 1-line and 2-line lesson titles without pushing
     the card to grow when the title wraps — keeps the skeleton + real
     card landed at exactly the same height. */
  min-height: 16rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    border-color: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.accent} 35%, ${p.theme.colors.surfaceBorder})`};
    box-shadow: var(--shadow-lift);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

export const Body = styled.div`
  padding: 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  min-width: 0;

  ${(p) => p.theme.media.tablet} {
    padding: 1.5rem 1.25rem;
    gap: 0.75rem;
  }
`;

export const Eyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.accent};
`;

export const Title = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin: 0;
  max-width: 22ch;
  color: ${(p) => p.theme.colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  ${(p) => p.theme.media.tablet} {
    font-size: 1.625rem;
  }
`;

/** Narrative meta line: "Lesson 3 of 8 · Module 2 · ~5 min". */
export const Meta = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  line-height: 1.55;
  max-width: 56ch;
`;

export const MetaSep = styled.span`
  display: inline-block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.5;
  margin: 0 0.5rem;
  vertical-align: middle;
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.25rem;
  flex-wrap: wrap;
`;

// ── Cover panel (right column) ────────────────────────

export const Cover = styled.div<{ $imageUrl?: string | null }>`
  position: relative;
  overflow: hidden;
  min-height: 240px;
  background: ${(p) =>
    p.$imageUrl
      ? `url('${p.$imageUrl}') center / cover no-repeat`
      : 'linear-gradient(135deg, #2c5545 0%, #1e3d31 100%)'};

  /* Two scrims:
     - When NO image: warm radial highlights to give the flat gradient depth.
     - When image: subtle corner scrims (darker top-left + bottom-right) so the
       module label and the "01" watermark stay legible without burying the
       photo. The rest of the image reads clean. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: ${(p) =>
      p.$imageUrl
        ? `radial-gradient(ellipse at 0% 0%, rgba(0, 0, 0, 0.55) 0%, transparent 45%),
           radial-gradient(ellipse at 100% 100%, rgba(0, 0, 0, 0.58) 0%, transparent 48%)`
        : `radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 60%),
           radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)`};
  }

  ${(p) => p.theme.media.tablet} {
    min-height: 140px;
  }
`;

/**
 * Top-left small uppercase label: "MODULE 2 · LESSON 3".
 * Bumped to white-85% with a soft drop shadow so it stays legible over the
 * top-left scrim corner whether the cover is gradient or photo.
 */
export const CoverLabel = styled.span`
  position: absolute;
  left: 1.75rem;
  top: 1.5rem;
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.55);
  z-index: 1;

  ${(p) => p.theme.media.tablet} {
    left: 1.25rem;
    top: 1.125rem;
  }
`;

/**
 * Bottom-right giant serif italic lesson number watermark. Stronger opacity
 * + soft shadow so it reads cleanly over either the gradient or a photo;
 * the bottom-right scrim corner gives it room to sit without burying the
 * image.
 */
export const CoverNumber = styled.span`
  position: absolute;
  right: 1.75rem;
  bottom: 1.5rem;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 5.5rem;
  color: rgba(255, 255, 255, 0.42);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.5);
  z-index: 1;

  ${(p) => p.theme.media.tablet} {
    right: 1.25rem;
    bottom: 1.125rem;
    font-size: 4rem;
  }
`;
