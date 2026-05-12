'use client';

import { HelpAnchor } from '@/components';
import { useRegenerateRecall } from '@/hooks';
import * as S from './RecallStatusPanel.styles';

interface RecallStatusPanelProps {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  recallCardCount: number;
  isGenerationRunning: boolean;
}

/**
 * Surfaces the recall-cards state at the end of a finished lesson:
 *   - `recallCardCount > 0`  → quiet status badge ("N cards in your recall queue")
 *   - `recallCardCount === 0` → emphasized empty-state with a CTA that
 *      runs the recall-extraction job (label `lesson:recall`, ~1-3 cr)
 *
 * The CTA disappears while another generation for this course is in
 * flight — the server enforces the one-active-job rule anyway, but the
 * client gates the click for a cleaner UX.
 */
export const RecallStatusPanel = ({
  courseId,
  moduleIndex,
  lessonIndex,
  recallCardCount,
  isGenerationRunning,
}: RecallStatusPanelProps) => {
  const regenerate = useRegenerateRecall();
  const busy = regenerate.isRegenerating || isGenerationRunning;
  const hasCards = recallCardCount > 0;

  if (hasCards) {
    return (
      <S.StatusBanner>
        <S.StatusBannerEyebrow>Spaced review</S.StatusBannerEyebrow>
        <S.StatusBannerText>
          Recall cards from this lesson are in your queue.
        </S.StatusBannerText>
        <S.StatusBannerHelp>
          <HelpAnchor concept="spaced-recall" size="sm" />
        </S.StatusBannerHelp>
      </S.StatusBanner>
    );
  }

  return (
    <S.EmptyCard>
      <S.EmptyEyebrow>
        Spaced retrieval <HelpAnchor concept="spaced-recall" size="sm" />
      </S.EmptyEyebrow>
      <S.EmptyTitle>No recall cards from this lesson yet.</S.EmptyTitle>
      <S.EmptyBody>
        A handful of tiny prompts pulled from what you just read, scheduled to come back over the
        following days. Active retrieval is what actually makes reading stick.
      </S.EmptyBody>
      <S.EmptyAction
        type="button"
        onClick={() =>
          regenerate.regenerate({ courseId, moduleIndex, lessonIndex })
        }
        disabled={busy}
      >
        {regenerate.isRegenerating
          ? 'Generating cards…'
          : isGenerationRunning
            ? 'Another job is running…'
            : 'Generate recall cards'}
      </S.EmptyAction>
    </S.EmptyCard>
  );
};
