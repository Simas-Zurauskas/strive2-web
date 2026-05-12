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

    /* Shadows — used sparingly. The four "core" tokens (card/btn/btn-hover/
       lift) cover most surfaces; "extended" tokens below are for repeating
       motifs that didn't fit the core set without visible drift. */
    --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04);
    --shadow-card-soft: 0 2px 8px rgba(0, 0, 0, 0.05);
    --shadow-btn: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
    --shadow-btn-hover: 0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.10);
    --shadow-btn-pressed: 0 1px 2px rgba(0, 0, 0, 0.10);
    --shadow-lift: 0 4px 12px rgba(0, 0, 0, 0.08);
    --shadow-lift-strong: 0 4px 16px rgba(0, 0, 0, 0.12);
    --shadow-pop: 0 6px 24px rgba(0, 0, 0, 0.06);
    --shadow-ghost: 0 1px 0 rgba(0, 0, 0, 0.02), 0 4px 14px rgba(0, 0, 0, 0.04);
    --shadow-toast: 0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05);
    --shadow-panel: 0 6px 20px rgba(0, 0, 0, 0.18), 0 1px 3px rgba(0, 0, 0, 0.10);
    --shadow-panel-hover: 0 8px 24px rgba(0, 0, 0, 0.22), 0 1px 3px rgba(0, 0, 0, 0.10);
    --shadow-panel-lg: 0 24px 48px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08);
    --shadow-modal: 0 12px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.06);
    --shadow-modal-lg: 0 20px 50px rgba(0, 0, 0, 0.16), 0 2px 8px rgba(0, 0, 0, 0.06);
    --shadow-og: 0 36px 72px rgba(0, 0, 0, 0.45), 0 14px 28px rgba(0, 0, 0, 0.30);
    --shadow-drawer-l: -2px 0 8px rgba(0, 0, 0, 0.04);
    --shadow-drawer-l-hover: -6px 0 18px rgba(0, 0, 0, 0.08);
    --shadow-drawer-r: 2px 0 8px rgba(0, 0, 0, 0.04);
    --shadow-drawer-r-hover: 6px 0 18px rgba(0, 0, 0, 0.08);
    --text-shadow-on-image-soft: 0 1px 2px rgba(0, 0, 0, 0.18);
    --text-shadow-on-image-strong: 0 2px 18px rgba(0, 0, 0, 0.50);

    /* Scrims — modal/drawer backdrops. */
    --scrim-light: rgba(0, 0, 0, 0.30);
    --scrim-strong: rgba(0, 0, 0, 0.50);

    /* On-accent ink — text/icons rendered on top of the accent button
       background. Kept theme-stable (white in both modes) since the accent
       hue inverts but the contrast pairing does not. */
    --on-accent: #ffffff;

    /* Code-syntax palette — light. Pairs with the dark variant under
       [data-theme="dark"]; mock code blocks (LandingScreen) currently
       render the dark palette regardless of theme to match their dark
       chrome. */
    --code-bg: #1a1816;
    --code-text: #e6e7ec;
    --code-keyword: #c4a265;
    --code-string: #9ec99e;
    --code-function: #9ad6c8;
    --code-comment: #7a7a85;
    --code-operator: #e07a8a;
    --code-number: #d4a96b;

    /* GitHub-style activity heatmap intensity ramp (5 stops, 0 = empty,
       4 = max). Light uses tinted accents; dark uses a sage-green ramp
       that pops on the dark surface. Consumed via the typed
       activityHeatmapPalette helper in theme/index.ts. */
    --heatmap-0: rgba(0, 0, 0, 0.03);
    --heatmap-1: color-mix(in srgb, ${themeColors.light.accent} 44%, transparent);
    --heatmap-2: color-mix(in srgb, ${themeColors.light.accent} 60%, transparent);
    --heatmap-3: color-mix(in srgb, ${themeColors.light.accent} 76%, transparent);
    --heatmap-4: ${themeColors.light.accent};

    /* Recall-card mastery ramp — 5 colours one per Leitner box. Each
       colour represents a stage of mastery; surfaces in RecallActivityCard
       and the recall-progress chart tooltips. */
    --recall-box-0: #d6cfc3;
    --recall-box-1: #c4a265;
    --recall-box-2: #8a9562;
    --recall-box-3: #4a8a72;
    --recall-box-4: ${colorsLib.primary};

    /* Text selection — brand-tinted highlight with the foreground kept
       intact for legibility. 22% accent gives a soft wash on cream that
       reads as "selected" without overpowering serif italic display
       type. */
    --selection-bg: color-mix(in srgb, ${themeColors.light.accent} 22%, transparent);
    --selection-fg: ${themeColors.light.foreground};

    /* Safe-area insets — fall back to 0 on browsers that don't expose
       env(safe-area-inset-*) so consumers can use these vars
       unconditionally. iOS Safari fills these in once <meta name="viewport"
       content="viewport-fit=cover"> is applied (set in app/layout.tsx
       via the viewport export). Use as e.g.
         padding-bottom: max(1rem, var(--safe-area-bottom));
       on fixed action bars and bottom toolbars. */
    --safe-area-top: env(safe-area-inset-top, 0px);
    --safe-area-right: env(safe-area-inset-right, 0px);
    --safe-area-bottom: env(safe-area-inset-bottom, 0px);
    --safe-area-left: env(safe-area-inset-left, 0px);
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
    --shadow-card-soft: 0 2px 8px rgba(0, 0, 0, 0.22);
    --shadow-btn: 0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-btn-hover: 0 2px 6px rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.35);
    --shadow-btn-pressed: 0 1px 2px rgba(0, 0, 0, 0.32);
    --shadow-lift: 0 4px 14px rgba(0, 0, 0, 0.32);
    --shadow-lift-strong: 0 4px 16px rgba(0, 0, 0, 0.4);
    --shadow-pop: 0 6px 24px rgba(0, 0, 0, 0.28);
    --shadow-ghost: 0 1px 0 rgba(0, 0, 0, 0.18), 0 4px 14px rgba(0, 0, 0, 0.22);
    --shadow-toast: 0 8px 24px rgba(0, 0, 0, 0.32), 0 2px 6px rgba(0, 0, 0, 0.22);
    --shadow-panel: 0 6px 20px rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.32);
    --shadow-panel-hover: 0 8px 24px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.32);
    --shadow-panel-lg: 0 24px 48px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.32);
    --shadow-modal: 0 12px 40px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.24);
    --shadow-modal-lg: 0 20px 50px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.24);
    --shadow-og: 0 36px 72px rgba(0, 0, 0, 0.6), 0 14px 28px rgba(0, 0, 0, 0.4);
    --shadow-drawer-l: -2px 0 8px rgba(0, 0, 0, 0.18);
    --shadow-drawer-l-hover: -6px 0 18px rgba(0, 0, 0, 0.32);
    --shadow-drawer-r: 2px 0 8px rgba(0, 0, 0, 0.18);
    --shadow-drawer-r-hover: 6px 0 18px rgba(0, 0, 0, 0.32);

    --scrim-light: rgba(0, 0, 0, 0.5);
    --scrim-strong: rgba(0, 0, 0, 0.7);

    /* Heatmap dark ramp — sage-green chain on the gray800 surface. */
    --heatmap-0: #373331;
    --heatmap-1: #4d6b5c;
    --heatmap-2: #3e7057;
    --heatmap-3: #4e9e74;
    --heatmap-4: #6cd49a;

    /* Selection on dark uses the lifted dark-mode accent at 32% — needs
       slightly more saturation than light mode to read as a deliberate
       selection band over the gray800 surface. */
    --selection-bg: color-mix(in srgb, ${themeColors.dark.accent} 32%, transparent);
    --selection-fg: ${themeColors.dark.foreground};
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

  /* Themed text selection. Default browser blue clashes with the brand
     palette and changes hue across operating systems; this anchors it to
     a soft accent wash with the theme foreground preserved for AA
     contrast. ::-moz-selection is required separately — Firefox doesn't
     match the unprefixed selector. */
  ::selection {
    background: var(--selection-bg);
    color: var(--selection-fg);
  }
  ::-moz-selection {
    background: var(--selection-bg);
    color: var(--selection-fg);
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

  /* iOS Safari auto-zooms when focusing any form control whose computed
     font-size is < 16px. The site uses 0.9375rem (15px) inputs which trip
     that threshold on every iPhone. Forcing a 16px minimum on touch-only
     devices stops the tap from kicking off a "scroll-the-page-into-place"
     zoom that breaks the layout. !important wins against per-component
     input font-sizes (many .styles.ts files set their own); the max keeps
     inputs that were already ≥16px at their original size. */
  @media (hover: none) and (pointer: coarse) {
    input:not([type='checkbox']):not([type='radio']):not([type='range']),
    textarea,
    select {
      font-size: max(16px, 1em) !important;
    }
  }

  /* Global focus-visible safety net. Many design-system primitives reset
     'outline: none' to replace it with a custom focus ring; if any of
     them forget, this rule restores a visible 2px accent ring on any
     focusable element. Component-level :focus-visible rules win by
     specificity, so this only fires as a fallback. WCAG 2.4.7. */
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  /* Skip-to-content link. Visually hidden until focused (first Tab press
     on any page surfaces it in the top-left), then renders as an accent
     pill that jumps focus to <main id="main-content"> when activated.
     WCAG 2.4.1 (Bypass Blocks). */
  .skip-to-content {
    position: absolute;
    left: 0.75rem;
    top: 0.75rem;
    z-index: 1000;
    transform: translateY(-150%);
    padding: 0.5rem 0.875rem;
    background: var(--accent);
    color: var(--on-accent);
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lift);
    transition: transform 0.15s ease;
  }
  .skip-to-content:focus,
  .skip-to-content:focus-visible {
    transform: translateY(0);
    outline: 2px solid var(--foreground);
    outline-offset: 2px;
  }

  /* Hide Appzi's auto-injected "Sticky Launcher" (the floating "Feedback"
     tab). The Navbar Feedback button is the sole sanctioned trigger; the
     popup window.appzi.openWidget() opens is rendered in separate DOM
     (overlay / modal) which is not matched by these selectors, so the
     popup keeps working.

     Selectors target Appzi's public DOM hooks rather than its hashed
     class names (which rotate per build):
       • data-appzi-dom="launcher" — explicit attribute Appzi puts on the
         launcher root (and "_f" on the inner iframe). Stable across
         releases and the canonical anchor.
       • id^="appzi-slo-" — per-install slug id on the launcher root,
         kept as a fallback in case the data attribute is renamed. */
  [data-appzi-dom="launcher"],
  [id^="appzi-slo-"] {
    display: none !important;
  }
`;
