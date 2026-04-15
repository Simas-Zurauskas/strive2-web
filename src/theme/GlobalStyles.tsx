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
  }

  html {
    scroll-behavior: smooth;
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
