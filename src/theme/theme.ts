export type ColorScheme = 'light' | 'dark' | 'system';

export const colorsLib = {
  white: '#ffffff',
  gray50: '#f8fafc',
  gray200: '#e2e8f0',
  gray400: '#94a3b8',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',
  indigo: '#4f46e5',
  indigoHover: '#4338ca',
  green: '#16a34a',
  amber: '#d97706',
  red: '#ef4444',
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
  success: string;
  warning: string;
  error: string;
};

export const themeColors: Record<'light' | 'dark', ColorsSet> = {
  light: {
    background: colorsLib.white,
    foreground: colorsLib.gray900,
    muted: colorsLib.gray400,
    border: colorsLib.gray200,
    surface: colorsLib.gray50,
    surfaceBorder: colorsLib.gray200,
    accent: colorsLib.indigo,
    accentHover: colorsLib.indigoHover,
    success: colorsLib.green,
    warning: colorsLib.amber,
    error: colorsLib.red,
  },
  dark: {
    background: colorsLib.gray900,
    foreground: colorsLib.gray50,
    muted: colorsLib.gray400,
    border: colorsLib.gray800,
    surface: colorsLib.gray800,
    surfaceBorder: colorsLib.gray700,
    accent: colorsLib.indigo,
    accentHover: colorsLib.indigoHover,
    success: colorsLib.green,
    warning: colorsLib.amber,
    error: colorsLib.red,
  },
};

export const colors: ColorsSet = {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  muted: 'var(--muted)',
  border: 'var(--border)',
  surface: 'var(--surface)',
  surfaceBorder: 'var(--surface-border)',
  accent: 'var(--accent)',
  accentHover: 'var(--accent-hover)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
};
