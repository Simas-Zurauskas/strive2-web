'use client';

import { AlertDialog } from '@/components/AlertDialog/AlertDialog';
import * as S from './DepthOverrideDialog.styles';
import type {
  DepthOverridePayload,
  DepthOverrideOvercommitPayload,
  DepthOverrideUndercommitPayload,
} from '@/api/types';

export type {
  DepthOverridePayload,
  DepthOverrideOvercommitPayload as DepthOverridePayloadOvercommit,
  DepthOverrideUndercommitPayload as DepthOverridePayloadUndercommit,
};

interface DepthOverrideDialogProps {
  open: boolean;
  payload: DepthOverridePayload | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Format a [min, max] pair for inline display, collapsing identical bounds
 * ("12–12 lessons" → "12 lessons") so short courses read naturally.
 */
const formatRange = (range: number[] | undefined, unit: string): string | null => {
  if (!range || range.length < 2) return null;
  const [lo, hi] = range;
  if (lo === hi) return `${lo} ${unit}`;
  return `${lo}–${hi} ${unit}`;
};

/**
 * Pretty-print a depth value ("deep_dive" → "Deep Dive") for inline copy.
 * Defensive: returns the raw value unchanged for anything we don't know
 * about (e.g. a future depth tier the client wasn't built against).
 */
const formatDepthLabel = (depth: string | null | undefined): string => {
  if (!depth) return 'a deeper tier';
  if (depth === 'overview') return 'Overview';
  if (depth === 'comprehensive') return 'Comprehensive';
  if (depth === 'deep_dive') return 'Deep Dive';
  return depth;
};

const renderOvercommitDescription = (payload: DepthOverrideOvercommitPayload) => {
  const lessonsText = formatRange(payload.lessonCountRange, 'lessons');
  const hoursText = formatRange(payload.estimatedHoursRange, 'hours');
  const cues = [...(payload.softnessCues ?? []), ...(payload.finishPressureCues ?? [])];
  const hasMagnitude = !!(lessonsText && hoursText);

  return (
    <>
      {hasMagnitude ? (
        <S.Magnitude>
          This depth produces roughly <strong>{lessonsText}</strong> (~<strong>{hoursText}</strong>).
        </S.Magnitude>
      ) : (
        <S.Magnitude>This selection may produce a larger course than your answers suggest.</S.Magnitude>
      )}
      {payload.overcommitRationale ? (
        // Prefer the LLM rationale when present — one explanatory sentence
        // grounded in the learner's actual answers reads better than a
        // bulleted list of allowlist-matched phrases.
        <S.CuesIntro>Why we&rsquo;re asking: {payload.overcommitRationale}</S.CuesIntro>
      ) : (
        cues.length > 0 && (
          <>
            <S.CuesIntro>Your answers suggest:</S.CuesIntro>
            <S.CuesList>
              {cues.map((cue, i) => (
                <li key={i}>{cue}</li>
              ))}
            </S.CuesList>
          </>
        )
      )}
      <S.Question>Continue with this depth?</S.Question>
    </>
  );
};

const renderUndercommitDescription = (payload: DepthOverrideUndercommitPayload) => {
  const selectedLessonsText = formatRange(payload.lessonCountRange, 'lessons');
  const selectedHoursText = formatRange(payload.estimatedHoursRange, 'hours');
  const recommendedLessonsText = formatRange(payload.recommendedLessonCountRange, 'lessons');
  const recommendedHoursText = formatRange(payload.recommendedEstimatedHoursRange, 'hours');
  const selectedLabel = formatDepthLabel(payload.selectedDepth);
  const recommendedLabel = formatDepthLabel(payload.recommended);

  // Show a side-by-side magnitude comparison when we have both ranges,
  // a single-side anchor when we have just the selected ranges, or a
  // generic fallback when the backend omitted both (legacy / partial
  // courses). The fallback message from the controller is always present
  // so we never render a blank dialog.
  const hasBothRanges = !!(selectedLessonsText && recommendedLessonsText);
  const hasSelectedRange = !!(selectedLessonsText && selectedHoursText);

  return (
    <>
      {hasBothRanges ? (
        <S.Magnitude>
          You picked <strong>{selectedLabel}</strong> (about <strong>{selectedLessonsText}</strong>
          {selectedHoursText && (
            <>
              , ~<strong>{selectedHoursText}</strong>
            </>
          )}
          ). Your answers point at <strong>{recommendedLabel}</strong> (<strong>{recommendedLessonsText}</strong>
          {recommendedHoursText && (
            <>
              , ~<strong>{recommendedHoursText}</strong>
            </>
          )}
          ).
        </S.Magnitude>
      ) : hasSelectedRange ? (
        <S.Magnitude>
          You picked <strong>{selectedLabel}</strong> (about <strong>{selectedLessonsText}</strong>, ~
          <strong>{selectedHoursText}</strong>). Your answers point at <strong>{recommendedLabel}</strong>.
        </S.Magnitude>
      ) : (
        <S.Magnitude>{payload.message}</S.Magnitude>
      )}
      {payload.undercommitRationale && <S.CuesIntro>Why we suggest more: {payload.undercommitRationale}</S.CuesIntro>}
      <S.Question>Continue with this depth?</S.Question>
    </>
  );
};

/**
 * Bidirectional depth-override confirmation dialog. Renders different copy
 * based on the payload's `code` discriminator:
 *
 *   - `DEPTH_OVERRIDE_REQUIRES_ACK` (overcommit): "this is bigger than
 *     your answers suggest you'll finish — confirm or pick smaller"
 *   - `DEPTH_UNDERCOMMIT_REQUIRES_ACK` (undercommit): "this is lighter
 *     than recommended — confirm or pick fuller"
 *
 * The same `depthOverrideAcknowledged: true` flag works as the retry
 * confirmation for both, so the parent only needs one onConfirm callback.
 */
export const DepthOverrideDialog = ({
  open,
  payload,
  loading = false,
  onConfirm,
  onCancel,
}: DepthOverrideDialogProps) => {
  const isUndercommit = payload?.code === 'DEPTH_UNDERCOMMIT_REQUIRES_ACK';

  const description = payload
    ? isUndercommit
      ? renderUndercommitDescription(payload)
      : renderOvercommitDescription(payload as DepthOverrideOvercommitPayload)
    : null;

  return (
    <AlertDialog
      open={open && !!payload}
      title={isUndercommit ? 'Lighter than recommended' : 'Confirm course scope'}
      description={description}
      confirmLabel="Continue with this depth"
      cancelLabel={isUndercommit ? 'Pick a fuller tier' : 'Pick a smaller tier'}
      variant="default"
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
