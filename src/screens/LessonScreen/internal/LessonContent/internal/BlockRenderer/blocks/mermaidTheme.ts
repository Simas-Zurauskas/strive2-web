import { colorsLib, themeColors } from '@/theme';

/**
 * Mermaid.js consumes a flat theme-variables object — it doesn't read CSS
 * variables, so this map has to be resolved to literal hex/rgba strings
 * at render time. We derive every value from `colorsLib` + `themeColors`
 * where there's a brand match, and define a small set of named constants
 * for the diagram-specific tones (mindmap branch tints, surface washes)
 * that don't already exist as theme tokens.
 */

// ── Diagram-specific tones (no theme-token equivalent) ────────────────

// Light-mode soft surface fills — used for primary/secondary/tertiary node
// backgrounds and the 8-stop mindmap palette. Each is a barely-tinted wash
// off the cream surface, picked to read as "category" without competing
// with the diagram's structural ink.
const LIGHT_SURFACE_GREEN = '#e2ede7';
const LIGHT_SURFACE_GOLD = '#f0e8d8';
const LIGHT_SURFACE_NEUTRAL = '#f0eeec';
const LIGHT_SURFACE_BLUE = '#dde7f0';
const LIGHT_SURFACE_PINK = '#f0e2e4';
const LIGHT_SURFACE_LIME = '#e4f0e2';
const LIGHT_SURFACE_LILAC = '#eae2f0';
const LIGHT_SURFACE_MINT = '#e2f0ec';
const LIGHT_LINE = '#c4bdb5';

// Dark-mode node fills — gray800-ish base with hue tilt. Each is a hairline
// shift away from the surface so the nodes stay readable on the dark
// canvas without burying the structural ink.
const DARK_FILL_GREEN = '#2a3833';
const DARK_FILL_GOLD = '#332d24';
const DARK_FILL_NEUTRAL = '#302d2a';
const DARK_FILL_BLUE = '#2a2f38';
const DARK_FILL_PINK = '#33292a';
const DARK_FILL_LIME = '#2d332a';
const DARK_FILL_LILAC = '#302a33';
const DARK_FILL_MINT = '#2a3330';
const DARK_CLUSTER_BG = '#232120';
const DARK_CLUSTER_BORDER = '#3a3735';
const DARK_PEER_GREEN = '#4a8a72';
const DARK_PEER_GOLD = '#8a7245';
const DARK_PEER_BLUE = '#5a7088';
const DARK_PEER_PINK = '#88555a';
const DARK_PEER_LIME = '#5a8855';
const DARK_PEER_LILAC = '#7a5a88';
const DARK_PEER_MINT = '#558878';

export const getMermaidThemeVars = (isDark: boolean) =>
  isDark
    ? {
        primaryColor: DARK_FILL_GREEN,
        primaryTextColor: themeColors.dark.foreground,
        primaryBorderColor: themeColors.dark.accent,
        secondaryColor: DARK_FILL_GOLD,
        secondaryTextColor: themeColors.dark.foreground,
        secondaryBorderColor: DARK_PEER_GOLD,
        tertiaryColor: DARK_FILL_NEUTRAL,
        tertiaryTextColor: themeColors.dark.foreground,
        tertiaryBorderColor: colorsLib.gray700,
        lineColor: colorsLib.gray700,
        textColor: themeColors.dark.foreground,
        mainBkg: DARK_FILL_GREEN,
        nodeBorder: themeColors.dark.accent,
        clusterBkg: DARK_CLUSTER_BG,
        clusterBorder: DARK_CLUSTER_BORDER,
        titleColor: themeColors.dark.foreground,
        edgeLabelBackground: themeColors.dark.background,
        noteBkgColor: DARK_FILL_NEUTRAL,
        noteTextColor: themeColors.dark.foreground,
        noteBorderColor: colorsLib.gray700,
        // Mindmap / pie branch colors
        cScale0: DARK_FILL_GREEN,
        cScale1: DARK_FILL_GOLD,
        cScale2: DARK_FILL_NEUTRAL,
        cScale3: DARK_FILL_BLUE,
        cScale4: DARK_FILL_PINK,
        cScale5: DARK_FILL_LIME,
        cScale6: DARK_FILL_LILAC,
        cScale7: DARK_FILL_MINT,
        cScaleLabel0: themeColors.dark.foreground,
        cScaleLabel1: themeColors.dark.foreground,
        cScaleLabel2: themeColors.dark.foreground,
        cScaleLabel3: themeColors.dark.foreground,
        cScaleLabel4: themeColors.dark.foreground,
        cScaleLabel5: themeColors.dark.foreground,
        cScaleLabel6: themeColors.dark.foreground,
        cScaleLabel7: themeColors.dark.foreground,
        cScalePeer0: DARK_PEER_GREEN,
        cScalePeer1: DARK_PEER_GOLD,
        cScalePeer2: colorsLib.gray700,
        cScalePeer3: DARK_PEER_BLUE,
        cScalePeer4: DARK_PEER_PINK,
        cScalePeer5: DARK_PEER_LIME,
        cScalePeer6: DARK_PEER_LILAC,
        cScalePeer7: DARK_PEER_MINT,
      }
    : {
        primaryColor: LIGHT_SURFACE_GREEN,
        primaryTextColor: colorsLib.gray900,
        primaryBorderColor: colorsLib.primary,
        secondaryColor: LIGHT_SURFACE_GOLD,
        secondaryTextColor: colorsLib.gray900,
        secondaryBorderColor: colorsLib.secondary,
        tertiaryColor: LIGHT_SURFACE_NEUTRAL,
        tertiaryTextColor: colorsLib.gray900,
        tertiaryBorderColor: colorsLib.gray200,
        lineColor: LIGHT_LINE,
        textColor: colorsLib.gray900,
        mainBkg: LIGHT_SURFACE_GREEN,
        nodeBorder: colorsLib.primary,
        clusterBkg: colorsLib.white,
        clusterBorder: colorsLib.gray200,
        titleColor: colorsLib.gray900,
        edgeLabelBackground: colorsLib.cream,
        noteBkgColor: colorsLib.white,
        noteTextColor: colorsLib.gray900,
        noteBorderColor: colorsLib.gray200,
        // Mindmap / pie branch colors
        cScale0: LIGHT_SURFACE_GREEN,
        cScale1: LIGHT_SURFACE_GOLD,
        cScale2: LIGHT_SURFACE_NEUTRAL,
        cScale3: LIGHT_SURFACE_BLUE,
        cScale4: LIGHT_SURFACE_PINK,
        cScale5: LIGHT_SURFACE_LIME,
        cScale6: LIGHT_SURFACE_LILAC,
        cScale7: LIGHT_SURFACE_MINT,
        cScaleLabel0: colorsLib.gray900,
        cScaleLabel1: colorsLib.gray900,
        cScaleLabel2: colorsLib.gray900,
        cScaleLabel3: colorsLib.gray900,
        cScaleLabel4: colorsLib.gray900,
        cScaleLabel5: colorsLib.gray900,
        cScaleLabel6: colorsLib.gray900,
        cScaleLabel7: colorsLib.gray900,
      };
