'use client';

import { createGlobalStyle } from 'styled-components';
import { colorsLib, themeColors } from './theme';

export const GlobalStyles = createGlobalStyle`
  :root {
    --navbar-offset: 56px;
    --background: ${themeColors.light.background};
    --foreground: ${themeColors.light.foreground};
    --muted: ${themeColors.light.muted};
    --border: ${themeColors.light.border};
    --surface: ${themeColors.light.surface};
    --surface-border: ${themeColors.light.surfaceBorder};
    --accent: ${themeColors.light.accent};
    --accent-hover: ${themeColors.light.accentHover};
    --tertiary: ${themeColors.light.tertiary};
    --tertiary-hover: ${themeColors.light.tertiaryHover};
    --accent-muted: ${themeColors.light.accentMuted};
    --tertiary-muted: ${themeColors.light.tertiaryMuted};
    --success: ${themeColors.light.success};
    --warning: ${themeColors.light.warning};
    --error: ${themeColors.light.error};
    --scrollbar-thumb: ${colorsLib.gray200};
    --scrollbar-thumb-hover: ${colorsLib.gray400};

    /* Design system tokens — canonical values from
       _resources/strive-design-system/project/colors_and_type.css. */

    /* Radii — buttons 6, inputs/cards 8, hero 10, pills 9999 */
    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;
    --radius-xl: 10px;
    --radius-pill: 9999px;

    /* Spacing scale — 4-based, then 8-based */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-12: 3rem;
    --space-16: 4rem;
    --space-20: 5rem;
    --space-24: 6rem;

    /* Shadows — used sparingly */
    --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04);
    --shadow-btn: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
    --shadow-btn-hover: 0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.10);
    --shadow-lift: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  [data-theme="dark"],
  .dark {
    --background: ${themeColors.dark.background};
    --foreground: ${themeColors.dark.foreground};
    --muted: ${themeColors.dark.muted};
    --border: ${themeColors.dark.border};
    --surface: ${themeColors.dark.surface};
    --surface-border: ${themeColors.dark.surfaceBorder};
    --accent: ${themeColors.dark.accent};
    --accent-hover: ${themeColors.dark.accentHover};
    --tertiary: ${themeColors.dark.tertiary};
    --tertiary-hover: ${themeColors.dark.tertiaryHover};
    --accent-muted: ${themeColors.dark.accentMuted};
    --tertiary-muted: ${themeColors.dark.tertiaryMuted};
    --success: ${themeColors.dark.success};
    --warning: ${themeColors.dark.warning};
    --error: ${themeColors.dark.error};
    --scrollbar-thumb: ${colorsLib.gray700};
    --scrollbar-thumb-hover: ${colorsLib.gray400};
    --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.18);
    --shadow-btn: 0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-btn-hover: 0 2px 6px rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.35);
    --shadow-lift: 0 4px 14px rgba(0, 0, 0, 0.32);
  }

  html {
    scroll-behavior: auto;
    scroll-padding-top: var(--navbar-offset);
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    background-color: var(--background);
    color-scheme: light;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: clip;
    overscroll-behavior: none;
  }

  body {
    color: var(--foreground);
    background: var(--background);
    font-family: var(--font-body-sans), system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    -webkit-overflow-scrolling: touch;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

`;
