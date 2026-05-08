import type { ColorsSet } from '@/theme/theme';

/**
 * Shared chrome for Highcharts HTML tooltips across the Profile / Learning
 * tab. Previously each chart hand-rolled the outer card styles —
 * border-radius, drop-shadow, background, padding all inlined and
 * subtly different. Single helper means all three charts pop the same
 * tooltip and a future tweak only touches this file.
 *
 * Visual language matches Strive's editorial chrome elsewhere:
 *   - hairline `surfaceBorder`, no heavy productivity drop-shadow
 *   - `var(--radius-lg)` (8px) corner radius
 *   - bold tabular-nums for values, muted labels
 *   - dot swatches color-coded to the series
 *
 * The helper returns a fully formed HTML string. Callers compose `header`
 * + `rows` + optional `footer` and pass them through.
 */

export interface TooltipRow {
  /** Series color (hex / rgba) — drawn as a small swatch on the left. */
  color: string;
  /** Swatch shape: `dot` for circle (default), `square` for rounded square. */
  shape?: 'dot' | 'square';
  /** Muted label, e.g. "Reviews". */
  label: string;
  /** Value side, e.g. "12 XP" or "Good (3.2)". Bold + tabular nums. */
  value: string;
}

export const tooltipShellStyle = (colors: ColorsSet): string =>
  // box-shadow uses two stacked rgba layers — softer (large blur) plus a
  // tighter inner — gives depth without the heavy "card lifted off the
  // page" feel of dashboard tooltips. Light mode is barely-there; dark
  // mode pushes it harder so the tooltip floats over the chart bg.
  `background:${colors.surface};` +
  `border:1px solid ${colors.surfaceBorder};` +
  `border-radius:var(--radius-lg);` +
  `padding:0.625rem 0.75rem;` +
  `min-width:11rem;` +
  `box-shadow:var(--shadow-pop);` +
  `color:${colors.foreground};` +
  `font-size:0.75rem;line-height:1.5;`;

const swatchHtml = (row: TooltipRow): string => {
  const radius = row.shape === 'square' ? '2px' : '50%';
  return (
    `<span style="display:inline-block;width:8px;height:8px;` +
    `border-radius:${radius};background:${row.color};flex-shrink:0"></span>`
  );
};

const rowHtml = (row: TooltipRow, colors: ColorsSet): string =>
  `<div style="display:flex;align-items:center;gap:8px;padding:1px 0">` +
  swatchHtml(row) +
  `<span style="color:${colors.muted};flex:1">${row.label}</span>` +
  `<span style="font-weight:600;font-variant-numeric:tabular-nums">${row.value}</span>` +
  `</div>`;

export interface BuildTooltipParams {
  colors: ColorsSet;
  /** Bold heading (usually the date label). */
  header: string;
  /** Series rows. Filter zero-rows out before passing if you don't want them. */
  rows: TooltipRow[];
  /** Optional summary line at the bottom — e.g. "Total · 47 XP". */
  footer?: { label: string; value: string };
  /** Optional muted line shown when `rows` is empty (e.g. "No reviews this day"). */
  emptyLine?: string;
}

export const buildTooltipHtml = ({
  colors,
  header,
  rows,
  footer,
  emptyLine,
}: BuildTooltipParams): string => {
  const headerHtml = `<div style="font-weight:600;font-size:0.8125rem;margin-bottom:6px">${header}</div>`;
  const body =
    rows.length === 0 && emptyLine
      ? `<div style="color:${colors.muted};font-size:0.6875rem">${emptyLine}</div>`
      : rows.map((r) => rowHtml(r, colors)).join('');
  const footerHtml = footer
    ? `<div style="border-top:1px solid ${colors.surfaceBorder};margin-top:6px;padding-top:6px;` +
      `display:flex;justify-content:space-between;font-weight:600;font-variant-numeric:tabular-nums">` +
      `<span>${footer.label}</span><span>${footer.value}</span></div>`
    : '';
  return `<div style="${tooltipShellStyle(colors)}">${headerHtml}${body}${footerHtml}</div>`;
};
