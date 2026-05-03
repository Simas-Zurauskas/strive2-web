'use client';

import { useEffect, useState } from 'react';
import * as S from './DepthContextChip.styles';

/** Pretty-print a depth value ("deep_dive" → "Deep Dive"). */
const formatDepthLabel = (depth: string | null | undefined): string => {
  if (!depth) return '—';
  if (depth === 'overview') return 'Overview';
  if (depth === 'comprehensive') return 'Comprehensive';
  if (depth === 'deep_dive') return 'Deep Dive';
  return depth;
};

const DEPTH_RANK: Record<string, number> = {
  overview: 0,
  comprehensive: 1,
  deep_dive: 2,
};

const STORAGE_KEY_PREFIX = 'strive:depthChip:dismissed:';

type Variant = 'match' | 'lightly-off' | 'strongly-off';
type Direction = 'over' | 'under' | 'match';

/**
 * Determine which risk field is even relevant given the rank delta.
 * `overcommitRisk` rates the "if they over-pick" scenario and only matters
 * when the user actually over-picked; same for undercommit. If the user
 * picked LOWER than recommended, the overcommitRisk field on
 * depthPreviews is irrelevant — even if it's set to 'high', it was
 * computed about a hypothetical they didn't take. Reading it would
 * surface the wrong copy ("you may not finish") on an under-pick chip.
 */
const directionFor = (
  selected: string | null | undefined,
  recommended: string | null | undefined,
): Direction => {
  if (!selected || !recommended) return 'match';
  const selRank = DEPTH_RANK[selected];
  const recRank = DEPTH_RANK[recommended];
  if (selRank === recRank) return 'match';
  return selRank > recRank ? 'over' : 'under';
};

const classifyVariant = ({
  direction,
  selected,
  recommended,
  overcommitRisk,
  undercommitRisk,
}: {
  direction: Direction;
  selected: string | null | undefined;
  recommended: string | null | undefined;
  overcommitRisk: 'low' | 'moderate' | 'high' | undefined;
  undercommitRisk: 'low' | 'moderate' | 'high' | undefined;
}): Variant => {
  if (direction === 'match' || !selected || !recommended) return 'match';

  const tierDelta = Math.abs(DEPTH_RANK[selected] - DEPTH_RANK[recommended]);

  // Only consider the risk that matches the actual direction. Overcommit
  // risk applies to over-picks; undercommit risk applies to under-picks.
  // Reading the wrong one would mis-classify and select the wrong copy.
  const directionalRisk =
    direction === 'over' ? overcommitRisk : undercommitRisk;
  const hasSeriousRisk = directionalRisk === 'moderate' || directionalRisk === 'high';

  // Strongly-off: 2-tier delta (overview ↔ deep_dive) OR a moderate/high
  // risk on the relevant side. The LLM may flag a 1-tier mismatch as
  // serious if the rationale is sharp (e.g., "interview in 3 weeks").
  if (tierDelta >= 2 || hasSeriousRisk) return 'strongly-off';
  return 'lightly-off';
};

interface DepthContextChipProps {
  courseId: string;
  selectedDepth: string | null | undefined;
  recommendedDepth: string | null | undefined;
  overcommitRisk?: 'low' | 'moderate' | 'high';
  undercommitRisk?: 'low' | 'moderate' | 'high';
  onPickFullerTier?: () => void;
}

/**
 * Persistent depth-context chip rendered above the structure-review.
 * Surfaces the recommendation-vs-selection comparison so the learner
 * has a soft reminder while reviewing the structure they actually
 * received.
 *
 * Three visual states:
 *   - match            → minimal info pill, NOT dismissible (no value lost)
 *   - lightly-off      → blue/info chip, dismissible (1-tier delta, no serious risk)
 *   - strongly-off     → amber chip + emphasis, dismissible (2-tier delta OR moderate/high risk)
 *
 * Dismissal persists in localStorage per-course so the chip stays
 * dismissed across navigation/refresh on the same course. Storage key:
 * `strive:depthChip:dismissed:<courseId>`. localStorage failures are
 * caught silently — chip just stays visible (graceful degradation).
 *
 * Returns null when there's nothing meaningful to render: legacy course
 * (no recommendation) or user has dismissed the chip.
 */
export const DepthContextChip = ({
  courseId,
  selectedDepth,
  recommendedDepth,
  overcommitRisk,
  undercommitRisk,
}: DepthContextChipProps) => {
  const [dismissed, setDismissed] = useState(false);

  // Restore dismissed state on mount. Done in an effect (not initial
  // useState) so SSR doesn't try to access localStorage.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${courseId}`);
      if (raw === '1') setDismissed(true);
    } catch {
      // localStorage unavailable (incognito, restricted) — treat as
      // not-dismissed and proceed. The chip stays visible; the user
      // can still click to dismiss for the session, it just won't
      // persist across reloads.
    }
  }, [courseId]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${courseId}`, '1');
    } catch {
      // see comment above — silent fail is fine.
    }
  };

  // No meaningful comparison to draw — legacy course or wizard hasn't
  // generated previews yet. Don't render anything.
  if (!recommendedDepth) return null;

  const direction = directionFor(selectedDepth, recommendedDepth);
  const variant = classifyVariant({
    direction,
    selected: selectedDepth,
    recommended: recommendedDepth,
    overcommitRisk,
    undercommitRisk,
  });

  // Match case is informational only; user dismissal of the noisier
  // off-tier chips shouldn't hide the match pill (it's value-neutral).
  // We explicitly don't honor `dismissed` for match.
  if (variant !== 'match' && dismissed) return null;

  const selectedLabel = formatDepthLabel(selectedDepth);
  const recommendedLabel = formatDepthLabel(recommendedDepth);
  // The mentor panel is visible alongside this chip on the same screen,
  // so we phrase actions as "ask the mentor" rather than "open the chat".
  // The suggested-prompts surface inside the panel already carries the
  // direction-specific call to action.
  const mentorHint = 'Ask the mentor on the right if you want to adjust.';

  let label: React.ReactNode;
  let subtext: React.ReactNode = null;
  if (variant === 'match') {
    label = (
      <>
        <strong>{selectedLabel}</strong> matches the recommendation.
      </>
    );
  } else if (variant === 'lightly-off') {
    label = (
      <>
        You picked <strong>{selectedLabel}</strong> · <strong>{recommendedLabel}</strong> was
        recommended.
      </>
    );
    subtext = mentorHint;
  } else {
    // strongly-off — direction determines the framing.
    if (direction === 'over') {
      label = (
        <>
          <strong>{selectedLabel}</strong> is meaningfully more than the recommended{' '}
          <strong>{recommendedLabel}</strong>.
        </>
      );
      subtext = (overcommitRisk === 'high' || overcommitRisk === 'moderate')
        ? `Your answers suggest this may be too much to finish. ${mentorHint}`
        : mentorHint;
    } else if (direction === 'under') {
      label = (
        <>
          <strong>{selectedLabel}</strong> is meaningfully less than the recommended{' '}
          <strong>{recommendedLabel}</strong>.
        </>
      );
      subtext = (undercommitRisk === 'high' || undercommitRisk === 'moderate')
        ? `Your answers suggest this may skip what you asked for. ${mentorHint}`
        : mentorHint;
    } else {
      label = (
        <>
          <strong>{selectedLabel}</strong> is different from the recommended{' '}
          <strong>{recommendedLabel}</strong>.
        </>
      );
      subtext = mentorHint;
    }
  }

  return (
    <S.Chip $variant={variant} role={variant === 'strongly-off' ? 'note' : undefined}>
      {variant !== 'match' && (
        <S.ChipIcon aria-hidden="true">{variant === 'strongly-off' ? '!' : 'i'}</S.ChipIcon>
      )}
      <S.ChipBody>
        <S.ChipLabel>{label}</S.ChipLabel>
        {subtext && <S.ChipSubtext>{subtext}</S.ChipSubtext>}
      </S.ChipBody>
      {variant !== 'match' && (
        <S.DismissButton type="button" onClick={handleDismiss} aria-label="Dismiss">
          ×
        </S.DismissButton>
      )}
    </S.Chip>
  );
};
