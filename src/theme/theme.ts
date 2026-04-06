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
    success: colorsLib.green,
    warning: colorsLib.amber,
    error: colorsLib.red,
  },
  dark: {
    background: '#1a1816',
    foreground: colorsLib.gray100,
    muted: colorsLib.gray400,
    border: colorsLib.gray800,
    surface: colorsLib.gray800,
    surfaceBorder: colorsLib.gray700,
    accent: '#4a8a72',
    accentHover: '#5da383',
    tertiary: '#c4a265',
    tertiaryHover: '#b39355',
    success: colorsLib.green,
    warning: colorsLib.amber,
    error: colorsLib.red,
  },
};

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
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
};
