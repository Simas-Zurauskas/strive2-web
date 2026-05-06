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
    muted: colorsLib.gray400,
    border: colorsLib.gray200,
    surface: colorsLib.white,
    surfaceBorder: colorsLib.gray200,
    accent: colorsLib.primary,
    accentHover: colorsLib.primaryHover,
    tertiary: colorsLib.secondary,
    tertiaryHover: '#7d6434',
    accentMuted: '#2c554520',
    tertiaryMuted: '#96793e15',
    success: colorsLib.green,
    warning: colorsLib.amber,
    error: colorsLib.red,
  },
  dark: {
    background: '#1a1816',
    foreground: '#d5d0cb',
    muted: colorsLib.gray400,
    border: colorsLib.gray800,
    surface: colorsLib.gray800,
    surfaceBorder: colorsLib.gray700,
    accent: '#4a8a72',
    accentHover: '#5da383',
    tertiary: '#c4a265',
    tertiaryHover: '#b39355',
    accentMuted: '#4a8a7220',
    tertiaryMuted: '#c4a26515',
    success: colorsLib.green,
    warning: colorsLib.amber,
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
  btn: 'var(--shadow-btn)',
  btnHover: 'var(--shadow-btn-hover)',
  lift: 'var(--shadow-lift)',
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
  accentMuted: 'var(--accent-muted)',
  tertiaryMuted: 'var(--tertiary-muted)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
};
