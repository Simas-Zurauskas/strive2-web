'use client';

import { HelpAnchor } from '@/components';
import * as S from './SessionStrip.styles';

interface SessionStripProps {
  reviewed: number;
  total: number;
  dueTotal: number;
  freshAvailable: number;
  /** Cards rated Again in the current batch, queued for the retry batch. */
  retryQueued: number;
  /** True when the user is currently running through a retry batch. */
  inRetryBatch: boolean;
}

/**
 * Replaces the editorial hero during an active recall session. Reads as
 * one tight line: page identity (eyebrow), progress count, and queue
 * shape. A real (not 4px) progress bar runs beneath so the user always
 * knows where they are. The card below is the hero — this strip is
 * orientation furniture, not content.
 */
export const SessionStrip = ({
  reviewed,
  total,
  dueTotal,
  freshAvailable,
  retryQueued,
  inRetryBatch,
}: SessionStripProps) => {
  const pct = total === 0 ? 0 : Math.round((reviewed / total) * 100);
  const dueRemaining = Math.max(0, dueTotal - reviewed);

  return (
    <S.Wrap>
      <S.Row>
        <S.LeftCluster>
          <S.Eyebrow>
            Recall <HelpAnchor concept="spaced-recall" size="sm" />
          </S.Eyebrow>
          <S.Sep aria-hidden>·</S.Sep>
          <S.Progress>
            <S.ProgressStrong>{reviewed}</S.ProgressStrong>
            <S.ProgressOf> of </S.ProgressOf>
            <S.ProgressStrong>{total}</S.ProgressStrong>
          </S.Progress>
          {inRetryBatch ? (
            <S.RetryPill title="You're in a retry round — these are cards you marked Again earlier">
              ↻ retry round
            </S.RetryPill>
          ) : (
            retryQueued > 0 && (
              <S.RetryPill
                title={`${retryQueued} card${retryQueued === 1 ? '' : 's'} queued for retry after this batch`}
              >
                ↻ {retryQueued} to retry
              </S.RetryPill>
            )
          )}
        </S.LeftCluster>

        <S.Counts>
          {dueRemaining > 0 ? `${dueRemaining} due` : 'No more due'}
          {freshAvailable > 0 ? ` · ${freshAvailable} fresh` : ''}
        </S.Counts>
      </S.Row>

      <S.Bar aria-hidden>
        <S.Fill $pct={pct} />
      </S.Bar>
    </S.Wrap>
  );
};
