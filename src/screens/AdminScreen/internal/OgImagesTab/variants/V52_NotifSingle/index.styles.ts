import styled from 'styled-components';
import { colorsLib, themeColors } from '@/theme';

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/*                                                                     */
/* Canvas: 1200 × 630.                                                 */
/*                                                                     */
/* Stage:                                                              */
/*   Deep theme-green 160° gradient + radial wash (subtle).            */
/*                                                                     */
/* Identity (top-left):                                                */
/*   Wordmark         — x:64,  y:64    (italic-serif, 36px, cream)     */
/*   Eyebrow          — x:64,  y:114   (small-caps, 14px, muted cream) */
/*                                                                     */
/* Hero toast (centered):                                              */
/*   720 × 200, radius 24, padding 28×36                               */
/*   left:240, top:215  (centers within 1200×630)                      */
/*                                                                     */
/* Tagline (bottom-right):                                             */
/*   Italic-serif 28px, cream-warm 0.85 — anchored br with 64px gutter */
/* ------------------------------------------------------------------ */

/*
 * OG-image-only tones. These are *not* theme tokens — the OpenGraph card is
 * rendered server-side as a fixed brand artifact and must look identical
 * regardless of the user's active theme. The greens map exactly to brand
 * tokens in `colorsLib`/`themeColors.dark`; the cream/ink/muted are subtle
 * brand-warmer variants tuned for the OG card and stay inline here.
 */
const TONE_INK = '#161312';
const TONE_CREAM_WARM = '#f8f4ea';
const TONE_MUTED = '#7a716a';
const TONE_THEME_GREEN = colorsLib.primary;
const TONE_DEEP_GREEN = colorsLib.primaryHover;
const TONE_BRIGHT_GREEN = themeColors.dark.accent;

/* Tinted overlays of the brand tones — kept as named constants so the rest
 * of this file references semantic intent ("cream wash") instead of raw
 * rgba literals. */
const TONE_CREAM_FAINT = `color-mix(in srgb, ${TONE_CREAM_WARM} 2.5%, transparent)`;
const TONE_INK_FAINT = `color-mix(in srgb, ${TONE_INK} 4%, transparent)`;
const TONE_BRIGHT_GREEN_WASH = `color-mix(in srgb, ${TONE_BRIGHT_GREEN} 18%, transparent)`;
const TONE_CREAM_BORDER = `color-mix(in srgb, ${TONE_CREAM_WARM} 40%, transparent)`;
const TONE_EYEBROW = `color-mix(in srgb, ${TONE_CREAM_WARM} 70%, transparent)`;
const TONE_TAGLINE = `color-mix(in srgb, ${TONE_CREAM_WARM} 88%, transparent)`;
const TONE_INK_HAIRLINE = `color-mix(in srgb, ${TONE_INK} 20%, transparent)`;

/* ------------------------------------------------------------------ */
/* Stage                                                                */
/* ------------------------------------------------------------------ */

export const Stage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 55%, ${TONE_BRIGHT_GREEN_WASH} 0%, transparent 60%),
    linear-gradient(160deg, ${TONE_THEME_GREEN} 0%, ${TONE_DEEP_GREEN} 100%);
  font-family: var(--font-body-sans), system-ui, sans-serif;
`;

export const Grain = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(${TONE_CREAM_FAINT} 1px, transparent 1px),
    radial-gradient(${TONE_INK_FAINT} 1px, transparent 1px);
  background-size: 3px 3px, 5px 5px;
  background-position: 0 0, 1px 2px;
  mix-blend-mode: overlay;
  z-index: 1;
`;

/* ------------------------------------------------------------------ */
/* Identity — top-left                                                  */
/* ------------------------------------------------------------------ */

export const Wordmark = styled.div`
  position: absolute;
  left: 64px;
  top: 56px;
  font-family: var(--font-heading-serif), 'Iowan Old Style', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 64px;
  line-height: 1;
  letter-spacing: -1.2px;
  color: ${TONE_CREAM_WARM};
  z-index: 5;
`;

export const Eyebrow = styled.div`
  position: absolute;
  left: 64px;
  top: 132px;
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: ${TONE_EYEBROW};
  z-index: 5;
`;

/* ------------------------------------------------------------------ */
/* Tagline — bottom-right                                               */
/* ------------------------------------------------------------------ */

export const Tagline = styled.div`
  position: absolute;
  right: 64px;
  bottom: 56px;
  font-family: var(--font-heading-serif), 'Iowan Old Style', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 36px;
  line-height: 1;
  letter-spacing: -0.6px;
  color: ${TONE_TAGLINE};
  z-index: 5;
`;

/* ------------------------------------------------------------------ */
/* Hero toast — single, oversized, centered                             */
/* ------------------------------------------------------------------ */

export const HeroToast = styled.div`
  position: absolute;
  left: 160px;
  top: 215px;
  width: 880px;
  height: 240px;
  border-radius: 28px;
  background: ${TONE_CREAM_WARM};
  border: 1px solid ${TONE_CREAM_BORDER};
  box-shadow: var(--shadow-og);
  padding: 32px 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 32px;
  z-index: 10;
`;

/* ------------------------------------------------------------------ */
/* Hero toast — icon (64×64, bright green)                              */
/* ------------------------------------------------------------------ */

export const HeroIcon = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 20px;
  flex: 0 0 88px;
  background: ${TONE_BRIGHT_GREEN};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeroIconLetter = styled.div`
  font-family: var(--font-heading-serif), 'Iowan Old Style', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 44px;
  line-height: 1;
  letter-spacing: -0.8px;
  color: ${TONE_CREAM_WARM};
`;

/* ------------------------------------------------------------------ */
/* Hero toast — body                                                    */
/* ------------------------------------------------------------------ */

export const HeroBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  /* Single uniform gap between title → sub → actions so the
   * vertical rhythm reads cleanly without the per-element
   * margin-tops they used to carry. */
  gap: 14px;
`;

export const HeroHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

export const HeroBrand = styled.div`
  font-family: var(--font-mono), ui-monospace, SFMono-Regular, monospace;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: ${TONE_THEME_GREEN};
`;

export const HeroStamp = styled.div`
  font-family: var(--font-mono), ui-monospace, SFMono-Regular, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: ${TONE_MUTED};
`;

export const HeroTitle = styled.div`
  font-family: var(--font-heading-serif), 'Iowan Old Style', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 46px;
  line-height: 1.08;
  letter-spacing: -0.8px;
  color: ${TONE_INK};
`;

export const HeroSub = styled.div`
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.35;
  color: ${TONE_MUTED};
`;

/* ------------------------------------------------------------------ */
/* Hero toast — action chips                                            */
/* ------------------------------------------------------------------ */

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ChipPrimary = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 999px;
  background: ${TONE_THEME_GREEN};
  color: ${TONE_CREAM_WARM};
  font-family: var(--font-mono), ui-monospace, SFMono-Regular, monospace;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  line-height: 1;
`;

export const ChipGhost = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid ${TONE_INK_HAIRLINE};
  color: ${TONE_INK};
  font-family: var(--font-mono), ui-monospace, SFMono-Regular, monospace;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  line-height: 1;
`;
