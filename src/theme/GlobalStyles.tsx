'use client';

import { createGlobalStyle } from 'styled-components';
import { themeColors } from './theme';

export const GlobalStyles = createGlobalStyle`
  :root {
    --background: ${themeColors.light.background};
    --foreground: ${themeColors.light.foreground};
    --muted: ${themeColors.light.muted};
    --border: ${themeColors.light.border};
    --surface: ${themeColors.light.surface};
    --surface-border: ${themeColors.light.surfaceBorder};
    --accent: ${themeColors.light.accent};
    --accent-hover: ${themeColors.light.accentHover};
    --success: ${themeColors.light.success};
    --warning: ${themeColors.light.warning};
    --error: ${themeColors.light.error};
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
    --success: ${themeColors.dark.success};
    --warning: ${themeColors.dark.warning};
    --error: ${themeColors.dark.error};
  }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    background-color: var(--background);
    color-scheme: light;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: clip;
  }

  body {
    color: var(--foreground);
    background: var(--background);
    font-family: var(--font-geist-sans), system-ui, sans-serif;
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
