import styled, { css } from 'styled-components';

export const Wrap = styled.div<{ $stacked: boolean; $compact?: boolean }>`
  display: flex;
  flex-direction: column;
  /* Both layouts now stack: chips row → custom toggle (or input row) →
     footnote. 0.75rem keeps the toggle visually paired with the chips
     above without crowding; compact stays at 0.875rem because it adds a
     full-width Buy CTA below the footnote. */
  gap: ${(p) => (p.$compact ? '0.875rem' : '0.75rem')};
  ${(p) =>
    p.$stacked &&
    css`
      width: 100%;
    `}
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const InputWrap = styled.div<{ $state: 'neutral' | 'error' }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  /* Matches the default <Button> height so the input, chips, and Buy CTA
     all sit on the same baseline. Earlier the input/chips were 38px and
     the default Button rendered ~42px — visibly off. */
  height: 42px;
  padding: 0 0.625rem 0 0.875rem;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid
    ${(p) =>
      p.$state === 'error' ? p.theme.colors.error : p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:focus-within {
    border-color: ${(p) =>
      p.$state === 'error' ? p.theme.colors.error : p.theme.colors.accent};
    box-shadow: 0 0 0 3px
      ${(p) =>
        p.$state === 'error'
          ? `color-mix(in oklab, ${p.theme.colors.error} 16%, transparent)`
          : `color-mix(in oklab, ${p.theme.colors.accent} 16%, transparent)`};
  }
`;

export const DollarPrefix = styled.span`
  color: ${(p) => p.theme.colors.muted};
  font-weight: 500;
  font-size: 0.95rem;
  margin-right: 0.2rem;
  user-select: none;
`;

export const AmountInput = styled.input`
  width: 70px;
  border: none;
  background: transparent;
  outline: none;
  color: ${(p) => p.theme.colors.foreground};
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  padding: 0;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const QuickPicks = styled.div<{ $grid?: boolean }>`
  ${(p) =>
    p.$grid
      ? css`
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
          width: 100%;
        `
      : css`
          display: inline-flex;
          gap: 0.3rem;
          flex-wrap: wrap;
        `}
`;

/** Quick-pick chip. Selected state used to fill solid accent — too loud
 *  next to the input field. Now an accent-tinted hairline like the
 *  recall card status pills, so the picked amount reads as "selected"
 *  without competing with the Buy CTA. */
export const QuickPick = styled.button<{ $selected: boolean }>`
  height: 42px;
  padding: 0 0.5rem;
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.muted};
  transition:
    background 120ms ease,
    border-color 120ms ease,
    color 120ms ease;
  font-variant-numeric: tabular-nums;

  &:hover:not(:disabled) {
    border-color: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
    color: ${(p) => p.theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${(p) =>
    p.$selected &&
    css`
      background: ${p.theme.colors.accentMuted};
      color: ${p.theme.colors.accent};
      border-color: ${p.theme.colors.accent};
    `}
`;

export const Footnote = styled.div`
  font-size: 0.8125rem;
  line-height: 1.1;

  &:empty {
    display: none;
  }
`;

export const HintError = styled.span`
  color: ${(p) => p.theme.colors.error};
`;

export const HintMuted = styled.span`
  color: ${(p) => p.theme.colors.muted};
`;

export const CustomAmountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CustomAmountToggle = styled.button`
  align-self: flex-start;
  background: transparent;
  border: none;
  padding: 0.125rem 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  transition: color 120ms ease;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

/* Right-aligned cancel — matches the input's vertical centre and sits
   at the row's right edge so the row reads as one composed unit
   instead of "input + lonely link". Clean text button, no dotted
   underline (that affordance is reserved for the discover-on-hover
   `CustomAmountToggle` link). */
export const CancelButton = styled.button`
  margin-left: auto;
  height: 42px;
  padding: 0 0.875rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  transition: color 120ms ease, background 120ms ease;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    background: ${(p) => p.theme.colors.background};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;
