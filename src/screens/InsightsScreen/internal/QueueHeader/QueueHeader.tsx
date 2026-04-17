'use client';

import * as S from './QueueHeader.styles';

interface QueueHeaderProps {
  reviewed: number;
  total: number;
  dueTotal: number;
  freshAvailable: number;
}

export const QueueHeader = ({ reviewed, total, dueTotal, freshAvailable }: QueueHeaderProps) => {
  const pct = total === 0 ? 0 : Math.round((reviewed / total) * 100);
  const dueRemaining = Math.max(0, dueTotal - reviewed);

  return (
    <S.Container>
      <S.Row>
        <S.Progress>
          {reviewed} of {total} today
        </S.Progress>
        <S.Counts>
          {dueRemaining > 0 ? `${dueRemaining} due` : 'No more due'}
          {freshAvailable > 0 ? ` · ${freshAvailable} fresh` : ''}
        </S.Counts>
      </S.Row>
      <S.Bar>
        <S.Fill $pct={pct} />
      </S.Bar>
    </S.Container>
  );
};
