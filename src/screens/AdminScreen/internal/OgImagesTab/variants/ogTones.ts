import styled from 'styled-components';
import { colorsLib } from '@/theme';

/**
 * Shared OG-only tones + product-UI primitives for the app-moment variant
 * set (V63–V72, 2026-08-01, second attempt — the first, landing-section
 * motifs, was rejected: an OG card must show THE PRODUCT, a believable
 * moment of Strive in use, the way V52's notification did).
 *
 * NOT theme tokens — an OG card is a fixed brand artifact and must render
 * identically whatever theme the operator runs (V52's rule). Values mirror
 * the brand: cream paper, deep plate greens, the emphasis gold.
 *
 * The UI primitives here draw app chrome at OG scale (~1.6× the app's
 * real density — 1200×630 is read as a thumbnail, so panels, type and
 * chips run larger than life). Mock CONTENT in the variants is
 * illustrative product state; claims discipline still binds every string:
 * no generation-speed claims, no outcome claims, no user counts, no
 * "credits".
 */
export const OG = {
  cream: '#faf9f7',
  ink: '#161312',
  muted: '#6c655e',
  faint: 'rgba(22, 19, 18, 0.12)',
  plate: colorsLib.primary, // #2c5545
  plateDeep: colorsLib.primaryHover, // #1e3d31
  gold: '#96793e',
  goldSoft: '#b89a5c',
  surface: '#ffffff',
} as const;

export const SERIF = "var(--font-heading-serif), Georgia, serif";

/* Paper ground with a whisper of warmth — the app's own light chrome. */
export const Stage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(120% 90% at 18% 0%, rgba(150, 121, 62, 0.05), transparent 55%),
    ${OG.cream};
  color: ${OG.ink};
`;

/* Deep-green ground for the two dark cards. */
export const StageDark = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(110% 100% at 50% -10%, rgba(245, 241, 230, 0.06), transparent 60%),
    linear-gradient(160deg, ${OG.plate}, ${OG.plateDeep});
  color: #f5f1e6;
`;

/* Identity — small, constant slot so the set reads as one campaign. */
export const Wordmark = styled.span<{ $onDark?: boolean }>`
  position: absolute;
  left: 56px;
  top: 48px;
  font-family: ${SERIF};
  font-style: italic;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.015em;
  color: ${(p) => (p.$onDark ? '#f5f1e6' : OG.ink)};
`;

/* One short line under the wordmark — what this product moment IS. */
export const Caption = styled.span<{ $onDark?: boolean }>`
  position: absolute;
  left: 56px;
  top: 96px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${(p) => (p.$onDark ? 'rgba(245, 241, 230, 0.72)' : OG.gold)};
`;

/* The floating app panel — window chrome the product moments live in. */
export const Panel = styled.div<{ $onDark?: boolean }>`
  position: absolute;
  background: ${OG.surface};
  border: 1px solid ${(p) => (p.$onDark ? 'rgba(245, 241, 230, 0.25)' : OG.faint)};
  border-radius: 18px;
  box-shadow: 0 28px 64px rgba(22, 19, 18, ${(p) => (p.$onDark ? 0.38 : 0.14)});
`;

/* Skeleton text row — the app's own loading vocabulary, used for body
   lines the card doesn't need to spell out. */
export const Ghost = styled.span<{ $w: number; $h?: number }>`
  display: block;
  width: ${(p) => p.$w}px;
  height: ${(p) => p.$h ?? 10}px;
  border-radius: 5px;
  background: rgba(22, 19, 18, 0.12);
`;

export const GoldChip = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background: color-mix(in srgb, ${OG.gold} 15%, transparent);
  color: ${OG.gold};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

export const GreenButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 26px;
  border-radius: 11px;
  background: ${OG.plate};
  color: #ffffff;
  font-size: 19px;
  font-weight: 600;
`;
