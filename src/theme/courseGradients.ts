import type { CourseDomain } from '@/api/types';

/**
 * Per-domain gradient palette used by `HomeCourseCard` and
 * `ContinueLearningCard`. Each domain has three muted variants in the same
 * hue family (slight depth/temperature shift) so two cards in the same domain
 * never look identical — the variant index is selected by a stable hash of
 * the courseId via {@link pickCourseGradient}.
 *
 * These are brand-colour data, not theme tokens — they intentionally render
 * the same in light and dark mode (the cards have white-on-color content
 * either way). The hex literals live in this file so component styles stay
 * free of raw colour values.
 */
export const courseDomainGradients: Record<CourseDomain, [string, string, string]> = {
  programming: [
    'linear-gradient(135deg, #2a4d52 0%, #173036 100%)',
    'linear-gradient(140deg, #234952 0%, #122d36 100%)',
    'linear-gradient(130deg, #305a5e 0%, #1a373a 100%)',
  ],
  stem: [
    'linear-gradient(135deg, #2f5d62 0%, #1a3c43 100%)',
    'linear-gradient(140deg, #2a5660 0%, #14373d 100%)',
    'linear-gradient(130deg, #3a6a6c 0%, #1d4146 100%)',
  ],
  humanities: [
    'linear-gradient(135deg, #2d3142 0%, #1a1d2c 100%)',
    'linear-gradient(140deg, #34384a 0%, #1f2434 100%)',
    'linear-gradient(130deg, #3a3d52 0%, #232739 100%)',
  ],
  language: [
    'linear-gradient(135deg, #5a3f5e 0%, #3a253d 100%)',
    'linear-gradient(140deg, #533558 0%, #34203a 100%)',
    'linear-gradient(130deg, #674768 0%, #422a47 100%)',
  ],
  creative: [
    'linear-gradient(135deg, #96793e 0%, #6a5526 100%)',
    'linear-gradient(140deg, #8c6f37 0%, #5e4a1e 100%)',
    'linear-gradient(130deg, #a18445 0%, #74602e 100%)',
  ],
  business: [
    'linear-gradient(135deg, #2c5545 0%, #1a3a2e 100%)',
    'linear-gradient(140deg, #28503f 0%, #173626 100%)',
    'linear-gradient(130deg, #355e4e 0%, #1f4234 100%)',
  ],
  practical: [
    'linear-gradient(135deg, #8a4f3a 0%, #5a3122 100%)',
    'linear-gradient(140deg, #7e4632 0%, #532c1d 100%)',
    'linear-gradient(130deg, #955644 0%, #623729 100%)',
  ],
  'practical-ai': [
    'linear-gradient(135deg, #1f3a5a 0%, #0f2440 100%)',
    'linear-gradient(140deg, #1b3454 0%, #0c2038 100%)',
    'linear-gradient(130deg, #294263 0%, #142a48 100%)',
  ],
  'life-skills': [
    'linear-gradient(135deg, #6b4a30 0%, #432c1d 100%)',
    'linear-gradient(140deg, #604229 0%, #3c2718 100%)',
    'linear-gradient(130deg, #785538 0%, #4d3422 100%)',
  ],
  other: [
    'linear-gradient(135deg, #2c5545 0%, #1e3d31 100%)',
    'linear-gradient(140deg, #305b48 0%, #213f33 100%)',
    'linear-gradient(130deg, #345e4c 0%, #244236 100%)',
  ],
};

/**
 * Default fallback gradient used when no domain is known yet (e.g. a draft
 * card with the wizard still open). Mirrors the `business` family.
 */
export const defaultCourseGradient =
  'linear-gradient(135deg, #2c5545 0%, #1e3d31 100%)';

/**
 * Pick one of the three gradient variants for a given domain, deterministic
 * per courseId. djb2-ish hash so two cards in the same domain never look
 * identical but the same card always renders the same gradient.
 */
export const pickCourseGradient = (
  domain: CourseDomain | null | undefined,
  courseId: string,
): string => {
  const variants = courseDomainGradients[domain ?? 'other'];
  let h = 0;
  for (let i = 0; i < courseId.length; i++) {
    h = ((h << 5) - h + courseId.charCodeAt(i)) | 0;
  }
  return variants[Math.abs(h) % variants.length];
};

/**
 * Translucent white/black overlays used for the on-gradient content
 * hierarchy on course cards. Centralised so cards stay visually consistent.
 */
export const courseCardInk = {
  /** Title text — primary content. */
  textPrimary: 'rgba(255, 255, 255, 0.96)',
  /** Body / domain mark. */
  textSecondary: 'rgba(255, 255, 255, 0.82)',
  /** Meta / supporting copy. */
  textMuted: 'rgba(255, 255, 255, 0.55)',
  /** Watermark initial (dimmed). */
  textWatermark: 'rgba(255, 255, 255, 0.18)',
  /** Hover-state watermark. */
  textWatermarkHover: 'rgba(255, 255, 255, 0.28)',
  /** Subtle outline + lit-edge border. */
  borderRest: 'rgba(255, 255, 255, 0.08)',
  borderHover: 'rgba(255, 255, 255, 0.14)',
  /** Focus-visible ring (white on dark gradient). */
  focusRing: 'rgba(255, 255, 255, 0.85)',
  /** Progress track + fill. */
  progressTrack: 'rgba(255, 255, 255, 0.14)',
  progressFill: 'rgba(255, 255, 255, 0.85)',
  /** Top-left highlight + bottom-right shade radial gradients. */
  litHighlight: 'rgba(255, 255, 255, 0.18)',
  /** Mid-strength highlight (active variant uses a softer 0.15). */
  litHighlightSoft: 'rgba(255, 255, 255, 0.15)',
  litShade: 'rgba(0, 0, 0, 0.28)',
  /** Active (Continue Learning) variant — heavier corner shading for the
      "currently learning" emphasis state. */
  activeShadeStart: 'rgba(0, 0, 0, 0.55)',
  activeShadeEnd: 'rgba(0, 0, 0, 0.58)',
  /** Active variant text — overrides for darker emphasis. */
  activeText: 'rgba(255, 255, 255, 0.95)',
  activeMuted: 'rgba(255, 255, 255, 0.42)',
} as const;
