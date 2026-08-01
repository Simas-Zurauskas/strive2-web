import { colorsLib, themeColors } from '@/theme/theme';

/**
 * Theme-stable plate ink.
 *
 * The Problem section is the page's one dark moment — it stays dark in both
 * themes, like a printed plate, so light-theme tokens must not leak into it.
 * The values are *read from the theme module* rather than typed as literals:
 * `PLATE_INK` is the accent's hover shade, `PLATE_CREAM` is the light theme's
 * background, `PLATE_GOLD` is the dark theme's tertiary. If the brand moves,
 * these move with it.
 *
 * `PLATE_INK_DEEP` is the same forest one step down, used for hairlines and
 * cell fills *on* the plate where a cream tint would read as a highlight.
 */
export const PLATE_INK = colorsLib.primaryHover;
export const PLATE_INK_DEEP = colorsLib.primary;
export const PLATE_CREAM = colorsLib.cream;
export const PLATE_GOLD = themeColors.dark.tertiary;
