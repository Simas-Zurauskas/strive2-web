'use client';

import { AlertDialog } from '@/components/AlertDialog/AlertDialog';
import * as S from './DepthOverrideDialog.styles';

/**
 * Response body shape for the backend's 409 DEPTH_OVERRIDE_REQUIRES_ACK.
 *
 * Declared locally (rather than imported from codegen) because the backend
 * Swagger update for this response lands in api/ separately; on the client
 * side we ship before `yarn codegen` has seen the new shape. After the
 * backend deploys and codegen runs, this local type can be replaced with
 * `components['schemas']['DepthOverrideRequiresAck']` — or whatever the
 * generator chooses to name it — from `@/api/_generated`.
 *
 * The fields match the controller at
 * /api/src/controlers/course/updateCourse.ts (see the 409 res.json payload).
 */
export interface DepthOverridePayload {
  code: 'DEPTH_OVERRIDE_REQUIRES_ACK';
  message: string;
  recommended: string | null;
  selectedDepth: string;
  /** [min, max] total lesson count for the selected depth. */
  lessonCountRange?: [number, number];
  /** [min, max] total learner-facing hours (~25 min/lesson). */
  estimatedHoursRange?: [number, number];
  softnessCues?: string[];
  finishPressureCues?: string[];
  /**
   * Optional. LLM-emitted overcommit-risk level (the gate's primary cost
   * signal on courses generated after this field was added). The dialog
   * doesn't surface the level directly — it's used in conjunction with
   * `overcommitRationale` for the explanatory copy. Absent on legacy
   * courses where the gate fired on phrase-regex cost signals alone.
   */
  overcommitRisk?: 'low' | 'moderate' | 'high';
  /**
   * Optional. One-sentence rationale from the LLM. When present, the
   * dialog shows this verbatim INSTEAD of the phrase-cue bullets — the
   * model's holistic reasoning is more informative than the matched
   * allowlist phrases. Falls back to bullets when absent.
   */
  overcommitRationale?: string;
}

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
const formatRange = (range: [number, number] | undefined, unit: string): string | null => {
  if (!range) return null;
  const [lo, hi] = range;
  if (lo === hi) return `${lo} ${unit}`;
  return `${lo}–${hi} ${unit}`;
};

export const DepthOverrideDialog = ({
  open,
  payload,
  loading = false,
  onConfirm,
  onCancel,
}: DepthOverrideDialogProps) => {
  const lessonsText = formatRange(payload?.lessonCountRange, 'lessons');
  const hoursText = formatRange(payload?.estimatedHoursRange, 'hours');
  const cues = [...(payload?.softnessCues ?? []), ...(payload?.finishPressureCues ?? [])];

  // Fallback for the intermediate state where the client is deployed against
  // an older backend that didn't yet emit the new magnitude fields. Dialog
  // still renders — just with a generic copy instead of concrete numbers.
  const hasMagnitude = !!(lessonsText && hoursText);

  const description = (
    <>
      {hasMagnitude ? (
        <S.Magnitude>
          This depth produces roughly <strong>{lessonsText}</strong>{' '}
          (~<strong>{hoursText}</strong>).
        </S.Magnitude>
      ) : (
        <S.Magnitude>
          This selection may produce a larger course than your answers suggest.
        </S.Magnitude>
      )}
      {payload?.overcommitRationale ? (
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

  return (
    <AlertDialog
      open={open && !!payload}
      title="Confirm course scope"
      description={description}
      confirmLabel="Continue with this depth"
      cancelLabel="Pick a smaller tier"
      variant="default"
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
