export type ColorScheme = 'light' | 'dark' | 'system';

export const colorsLib = {
  white: '#ffffff',
  cream: '#faf9f7',
  gray100: '#f5f3f0',
  gray200: '#dfd9d3',
  gray400: '#8a8279',
  gray700: '#4a4543',
  gray800: '#2d2926',
  gray900: '#0f172a',
  primary: '#2c5545',
  primaryHover: '#1e3d31',
  secondary: '#96793e',
  green: '#16a34a',
  amber: '#d97706',
  red: '#dc2626',
};

export type ColorsSet = {
  background: string;
  foreground: string;
  muted: string;
  border: string;
  surface: string;
  surfaceBorder: string;
  accent: string;
  accentHover: string;
  tertiary: string;
  tertiaryHover: string;
  /**
   * AA-compliant gold for SMALL text (eyebrows, tiny labels ≤ ~14px).
   * The brand gold `tertiary` sits at ~3.9:1 on cream/white — fine for
   * borders, accents, and display-size type, but it fails WCAG 4.5:1 at
   * label sizes. Use this variant whenever gold text is small.
   */
  tertiaryText: string;
  accentMuted: string;
  tertiaryMuted: string;
  success: string;
  warning: string;
  error: string;
};

export const themeColors: Record<'light' | 'dark', ColorsSet> = {
  light: {
    background: colorsLib.cream,
    foreground: colorsLib.gray900,
    // ~4.9:1 on cream/white — gray400 (#8a8279) lands at ~3.8:1 which fails AA.
    muted: '#76706a',
    border: colorsLib.gray200,
    surface: colorsLib.white,
    surfaceBorder: colorsLib.gray200,
    accent: colorsLib.primary,
    accentHover: colorsLib.primaryHover,
    tertiary: colorsLib.secondary,
    tertiaryHover: '#7d6434',
    // ~5.5:1 on cream, ~5.8:1 on white.
    tertiaryText: '#7d6434',
    accentMuted: '#2c554520',
    tertiaryMuted: '#96793e15',
    success: colorsLib.green,
    warning: colorsLib.amber,
    error: colorsLib.red,
  },
  dark: {
    background: '#1a1816',
    foreground: '#d5d0cb',
    // ~5.2:1 on gray800 — gray400 lands at ~3.6:1, also failing AA.
    muted: '#a39c93',
    border: colorsLib.gray700,
    surface: colorsLib.gray800,
    surfaceBorder: colorsLib.gray700,
    accent: '#4a8a72',
    accentHover: '#5da383',
    tertiary: '#c4a265',
    tertiaryHover: '#b39355',
    // Dark gold already clears 4.5:1 on the dark surfaces — same value.
    tertiaryText: '#c4a265',
    accentMuted: '#4a8a7220',
    tertiaryMuted: '#c4a26515',
    // success/warning lifted in dark to reach ~6:1 on gray800 when used as
    // text/icon (the dominant usage). error stays at colorsLib.red because
    // it's also used as a button background under white text in
    // Button.styles.ts dangerStyles — lifting it would push white-on-error
    // below AA. Text-on-dark uses of error are rare and usually paired
    // with an icon or color-mix tint that adds differentiation.
    success: '#22c55e',
    warning: '#f59e0b',
    error: colorsLib.red,
  },
};

// ── Design tokens (Strive design system) ────────────────
// Canonical values come from
//   _resources/strive-design-system/project/colors_and_type.css.
// Radii: 4 sm / 6 md (buttons) / 8 lg (inputs, cards) / 10 xl (hero) / pill.
// Shadows: card (rest), btn (primary), btn-hover, lift (hover on cards).
// Spacing: 4-based then 8-based; expose `space[n]` for inline usage but prefer
// CSS vars (--space-N) inside styled-components.

export const radii = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  pill: 'var(--radius-pill)',
} as const;

export const shadows = {
  card: 'var(--shadow-card)',
  cardSoft: 'var(--shadow-card-soft)',
  btn: 'var(--shadow-btn)',
  btnHover: 'var(--shadow-btn-hover)',
  btnPressed: 'var(--shadow-btn-pressed)',
  lift: 'var(--shadow-lift)',
  liftStrong: 'var(--shadow-lift-strong)',
  pop: 'var(--shadow-pop)',
  ghost: 'var(--shadow-ghost)',
  toast: 'var(--shadow-toast)',
  panel: 'var(--shadow-panel)',
  panelHover: 'var(--shadow-panel-hover)',
  panelLg: 'var(--shadow-panel-lg)',
  modal: 'var(--shadow-modal)',
  modalLg: 'var(--shadow-modal-lg)',
  og: 'var(--shadow-og)',
  drawerL: 'var(--shadow-drawer-l)',
  drawerLHover: 'var(--shadow-drawer-l-hover)',
  drawerR: 'var(--shadow-drawer-r)',
  drawerRHover: 'var(--shadow-drawer-r-hover)',
  textOnImageSoft: 'var(--text-shadow-on-image-soft)',
  textOnImageStrong: 'var(--text-shadow-on-image-strong)',
} as const;

export const scrims = {
  light: 'var(--scrim-light)',
  strong: 'var(--scrim-strong)',
} as const;

/**
 * Ink that renders on top of the accent button background.
 * Theme-stable (white in both light and dark) since the accent inverts but
 * the contrast pairing does not. Use this in place of any literal `#fff`
 * for text/icons sitting on `colors.accent`.
 */
export const onAccent = 'var(--on-accent)' as const;

/**
 * Translucent white tints used for "ink-on-image" overlays (e.g. inline
 * code chips inside an accent-coloured bubble, secondary text on a
 * gradient cover, dim watermarks). The opacity hierarchy mirrors the one
 * used by the course-card system in `theme/courseGradients.ts` and stays
 * theme-stable since it always renders on top of a coloured surface.
 */
/**
 * GitHub-style activity heatmap intensity ramp. The Highcharts/calendar
 * heatmap consumes this as a 5-element array in CSS-resolution order
 * (low → high). Returns the resolved hex/rgba values for both modes since
 * the consumer (react-activity-calendar) expects literal colour strings,
 * not CSS variables.
 *
 * Light: tinted forest accents on the cream surface.
 * Dark:  sage-green chain on the gray800 surface.
 */
export const activityHeatmapPalette = {
  light: [
    'rgba(0, 0, 0, 0.03)',
    `color-mix(in srgb, ${themeColors.light.accent} 44%, transparent)`,
    `color-mix(in srgb, ${themeColors.light.accent} 60%, transparent)`,
    `color-mix(in srgb, ${themeColors.light.accent} 76%, transparent)`,
    themeColors.light.accent,
  ] as [string, string, string, string, string],
  dark: ['#373331', '#4d6b5c', '#3e7057', '#4e9e74', '#6cd49a'] as [
    string,
    string,
    string,
    string,
    string,
  ],
} as const;

/**
 * Recall-card mastery ramp — one colour per Leitner box (0 = new, 4 =
 * mastered). Used by the recall-mix donut and tooltips. Theme-stable
 * since the meaning of each box doesn't change with theme.
 */
export const recallBoxPalette = [
  '#d6cfc3', // box 0 — warm bone, "new"
  '#c4a265', // box 1 — muted gold
  '#8a9562', // box 2 — olive-sage
  '#4a8a72', // box 3 — sage green
  colorsLib.primary, // box 4 — deep forest, "mastered"
] as const;

export const onColorWashes = {
  /** ~0.85 — primary text on a dark coloured surface. */
  text: 'rgba(255, 255, 255, 0.85)',
  /** ~0.30 — borders / spinner tracks / inline code chips on accent bubble. */
  border: 'rgba(255, 255, 255, 0.30)',
  /** ~0.18 — soft hairline / decorative tints. */
  faint: 'rgba(255, 255, 255, 0.18)',
  /** ~0.15 — inline code on accent bubble. */
  inlineCodeBg: 'rgba(255, 255, 255, 0.15)',
} as const;

export const space = {
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
  8: 'var(--space-8)',
  10: 'var(--space-10)',
  12: 'var(--space-12)',
  16: 'var(--space-16)',
  20: 'var(--space-20)',
  24: 'var(--space-24)',
} as const;

// ── Breakpoints ─────────────────────────────────────────

export const breakpoints = {
  mobile: 480,
  tablet: 640,
  tabletLarge: 768,
  desktop: 1024,
} as const;

export type Breakpoints = typeof breakpoints;

/** Pre-built @media strings for use in styled-components template literals. */
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile}px)`,
  tablet: `@media (max-width: ${breakpoints.tablet}px)`,
  tabletLarge: `@media (max-width: ${breakpoints.tabletLarge}px)`,
  desktop: `@media (max-width: ${breakpoints.desktop}px)`,
  /**
   * Pointing devices that can hover (mouse, trackpad). Wrap `:hover` rules
   * with this guard so touch devices don't "stick" the hover state after a
   * tap. Pair `&:hover` blocks like:
   *   ${media.hover} { &:hover { background: ... } }
   */
  hover: `@media (hover: hover) and (pointer: fine)`,
  /** Touch-primary devices (no fine pointer). */
  touch: `@media (hover: none) and (pointer: coarse)`,
} as const;

// ── CSS variable references ─────────────────────────────

// ── Scrollbar mixin ───────────────────────────────────

export const thinScrollbar = `
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) transparent;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
  }
`;

// ── Press-feedback mixins ─────────────────────────────
//
// Once `:hover` is correctly gated behind `media.hover`, a touch user gets NO
// visual acknowledgement between tapping a control and the app responding.
// These give that acknowledgement back. Suppressing hover without adding press
// feedback makes touch feel *worse*, so the two always ship together.
//
// Two variants, deliberately:
//
//   pressable        scale + dim. For buttons, icon buttons, chips, cards —
//                    anything with its own bounded box.
//                    DO NOT apply to an element that has `position: fixed`
//                    descendants: a non-`none` transform makes the element a
//                    containing block for them and they would be re-anchored
//                    to it. That rules it out for the CourseShell panels.
//
//   pressableSurface background wash only, no transform. For full-width rows
//                    inside scroll containers (sidebar lesson rows, menu
//                    items). A scale on a row can flash mid-scroll on Android
//                    where `:active` resolves before the gesture is
//                    disambiguated; a background change reads as intentional
//                    even if it does briefly appear.
//
// Both are no-ops under `prefers-reduced-motion` for the transform component;
// the colour/opacity feedback is kept, since removing *all* feedback would
// defeat the purpose for the users who most need clear affordances.
//
// NEITHER MIXIN DECLARES `transition`, and that is load-bearing. These are
// appended at the END of a component's template, so a `transition` here is a
// whole-property override that silently deletes whatever the component already
// declared. The first draft did exactly that and was caught in verification:
// CreditPill.PillLink's computed transitionProperty collapsed from its own
// colour/background list to `transform, opacity`, and ModuleHeader's
// `background 0.15s` became `background-color 0.09s`.
// The press state therefore snaps rather than eases — which is also what
// native touch controls do, so it reads as responsive rather than unfinished.

export const pressable = `
  &:active:not(:disabled) {
    transform: scale(0.97);
    opacity: 0.9;
  }

  @media (prefers-reduced-motion: reduce) {
    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

export const pressableSurface = `
  &:active:not(:disabled) {
    background-color: color-mix(in srgb, var(--foreground) 7%, transparent);
  }
`;

// ── Tap-target mixins ─────────────────────────────────
//
// Apple HIG asks for 44×44pt; WCAG 2.2 AA (SC 2.5.8) asks 24×24 CSS px. Much
// of the icon chrome here is 18–32px, which fails both.
//
// `touchHitArea` grows the HIT area without touching the VISUAL box, using a
// centred transparent ::after overlay. Desktop rendering is untouched: the
// whole thing sits inside the touch media query.
//
// Preconditions — check each site before applying:
//   1. `::after` must be free. Navbar's NavLink already uses it for the
//      underline, so that one gets `touchMinSize` instead.
//   2. The host must not be `overflow: hidden`, or the overlay is clipped and
//      silently does nothing.
//   3. The host must not be `position: absolute/fixed` already — the mixin
//      sets `position: relative` and would re-anchor it. CourseShell's
//      IconButton is `position: fixed`, so it uses `touchMinSize`.
// Verified per-site with elementFromPoint, not assumed.
//
// `touchMinSize` is the fallback: it grows the box itself, on touch only. Use
// where the element is a ghost/borderless control (growing it is invisible) or
// full-width (only the height changes).

export const touchHitArea = `
  @media (hover: none) and (pointer: coarse) {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: max(100%, 44px);
      height: max(100%, 44px);
      transform: translate(-50%, -50%);
      /* The overlay is transparent but must WIN hit-testing against
         non-positioned siblings it overhangs. Without this, LessonHero's
         BookmarkButtonInline overlay lost its top edge to the <h1> painted
         above it (measured: elementFromPoint 22px above centre returned
         LessonHero.Title). z-index resolves in the button's own parent
         stacking context, so it does not escape the component. */
      z-index: 1;
    }
  }
`;

export const touchMinSize = `
  @media (hover: none) and (pointer: coarse) {
    min-block-size: 44px;
    min-inline-size: 44px;
  }
`;

/** Height-only variant for full-width rows, where forcing a 44px min-inline-size
 *  is meaningless and `min-block-size` is the whole fix. Also the right choice
 *  for text links, where 44px of width would be wrong. */
export const touchMinHeight = `
  @media (hover: none) and (pointer: coarse) {
    min-block-size: 44px;
  }
`;

export const colors: ColorsSet = {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  muted: 'var(--muted)',
  border: 'var(--border)',
  surface: 'var(--surface)',
  surfaceBorder: 'var(--surface-border)',
  accent: 'var(--accent)',
  accentHover: 'var(--accent-hover)',
  tertiary: 'var(--tertiary)',
  tertiaryHover: 'var(--tertiary-hover)',
  tertiaryText: 'var(--tertiary-text)',
  accentMuted: 'var(--accent-muted)',
  tertiaryMuted: 'var(--tertiary-muted)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
};
