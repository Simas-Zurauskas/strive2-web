import Link from 'next/link';
import styled, { css } from 'styled-components';
import { pressable, touchMinHeight } from '@/theme';

const toneStyles = {
  neutral: css`
    background: ${(p) => p.theme.colors.surface};
    color: ${(p) => p.theme.colors.foreground};
    border-color: ${(p) => p.theme.colors.surfaceBorder};
  `,
  warning: css`
    background: ${(p) => p.theme.colorsLib.amber}15;
    color: ${(p) => p.theme.colors.warning};
    border-color: ${(p) => p.theme.colorsLib.amber}40;
  `,
  danger: css`
    background: ${(p) => p.theme.colorsLib.red}15;
    color: ${(p) => p.theme.colors.error};
    border-color: ${(p) => p.theme.colorsLib.red}40;
  `,
};

export type CreditPillTone = keyof typeof toneStyles;

export const PillLink = styled(Link)<{ $tone: CreditPillTone }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.65rem;
  border-radius: 9999px;
  border: 1px solid transparent;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  /* Never let this pill be what shoves the account button off-screen again:
     it may shrink, and its own content is what gives way first. */
  min-width: 0;
  flex-shrink: 1;
  cursor: pointer;
  text-decoration: none;
  transition: transform 120ms ease, box-shadow 120ms ease;

  ${(p) => p.theme.media.hover} {
    &:hover {
      transform: translateY(-1px);
    }
  }

  ${(p) => toneStyles[p.$tone]}

  ${pressable}

  ${touchMinHeight}
`;

export const Label = styled.span`
  opacity: 0.85;
  font-weight: 500;
  letter-spacing: 0.01em;
`;

/**
 * The word "Allowance" next to the bar or the amount. Dropped on phones.
 *
 * The pill measured 163px wide with no max-width and no way to shrink, which
 * made it the widest thing in a 5-item nav row and pushed the account button
 * 97% off-screen at 320px. The word is the compressible part: the bar and the
 * amount carry the meaning visually, and PillLink's aria-label already spells
 * the whole thing out ("62% monthly allowance remaining. Click to manage
 * billing."), so nothing is lost for assistive tech.
 *
 * Deliberately NOT applied to the 'empty' state's label — "Out of allowance"
 * is that state's only content, so hiding it would leave an empty pill.
 */
export const WordLabel = styled(Label)`
  ${(p) => p.theme.media.mobile} {
    display: none;
  }
`;

/**
 * The percentage, shown on phones in place of the hidden word.
 *
 * Hiding the word alone was a mistake: two independent device agents read the
 * resulting bare 48px bar as broken UI, because it carried no label AND no
 * value. Three characters are narrower than "Allowance" and restore the
 * meaning the bar only approximates.
 */
export const PctLabel = styled.span`
  display: none;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: 0.01em;

  ${(p) => p.theme.media.mobile} {
    display: inline;
  }
`;

export const BarTrack = styled.span`
  position: relative;
  display: inline-block;
  width: 72px;

  /* Narrower on phones, where the nav row has five children competing for
     under 400px. Still wide enough to read a percentage at a glance. */
  ${(p) => p.theme.media.mobile} {
    width: 48px;
  }
  height: 6px;
  border-radius: 9999px;
  background: ${(p) => p.theme.colors.surfaceBorder};
  overflow: hidden;
`;

const fillColor = {
  neutral: (theme: { colors: { accent: string } }) => theme.colors.accent,
  warning: (theme: { colors: { warning: string } }) => theme.colors.warning,
  danger: (theme: { colors: { error: string } }) => theme.colors.error,
};

export const BarFill = styled.span<{ $pct: number; $tone: CreditPillTone }>`
  display: block;
  height: 100%;
  width: ${(p) => Math.max(0, Math.min(100, p.$pct))}%;
  background: ${(p) => fillColor[p.$tone](p.theme)};
  border-radius: inherit;
  transition: width 200ms ease;
`;

export const Amount = styled.span`
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: 0.01em;
`;
