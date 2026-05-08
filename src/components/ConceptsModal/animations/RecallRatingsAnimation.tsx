'use client';

import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './RecallRatingsAnimation.styles';

// A single recall card hops along 5 Leitner boxes, driven by a fixed
// rating sequence (Easy → Good → Hard → Again → repeat). On every
// landing the destination box pulse-rings, the card tilts/bounces, and
// when it reaches the final mastery box a "mastered" badge slides in
// and the box glows with a warm shimmer. Below, the rating bar shows
// which rating drove that hop, in its real semantic colour.

const RATINGS = [
  { id: 'again' as const, label: 'Again', delta: -99, key: '1' },
  { id: 'hard' as const,  label: 'Hard',  delta: 0,   key: '2' },
  { id: 'good' as const,  label: 'Good',  delta: 1,   key: '3' },
  { id: 'easy' as const,  label: 'Easy',  delta: 2,   key: '4' },
];

// Sequence chosen to walk the card up to mastery and then reset, so the
// audience sees both the journey and the lapse-and-restart loop.
const SEQUENCE: Array<typeof RATINGS[number]['id']> = [
  'easy', 'good', 'easy', 'hard', 'good', 'again',
];

const TICK_MS = 1500;

export const RecallRatingsAnimation = () => {
  const { prefersReduced } = useMotion();
  const [{ box, seqIdx }, setState] = useState({ box: 0, seqIdx: 0 });

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setState((prev) => {
        const nextSeq = (prev.seqIdx + 1) % SEQUENCE.length;
        const ratingId = SEQUENCE[nextSeq];
        const rating = RATINGS.find((r) => r.id === ratingId)!;
        const nextBox = rating.delta === -99
          ? 0
          : Math.min(4, Math.max(0, prev.box + rating.delta));
        return { box: nextBox, seqIdx: nextSeq };
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const activeRating = RATINGS.find((r) => r.id === SEQUENCE[seqIdx])!;

  return (
    <S.Wrap aria-hidden>
      <S.Track>
        {Array.from({ length: 5 }).map((_, i) => (
          <S.Box
            key={i}
            $reached={i <= box}
            $isCurrent={i === box}
            $isMastery={i === 4}
          >
            <S.BoxLabel>{i === 4 ? 'mastered' : `box ${i + 1}`}</S.BoxLabel>
          </S.Box>
        ))}
        {/* Re-mount on `box` change to retrigger the landing keyframe each hop */}
        <S.HoppingCard key={`${box}-${seqIdx}`} $position={(box / 4) * 100}>
          <S.MasteryBadge $on={box === 4}>mastered</S.MasteryBadge>
        </S.HoppingCard>
      </S.Track>

      <S.Ratings>
        {RATINGS.map((r) => (
          <S.RatingBtn
            key={r.id}
            $active={r.id === activeRating.id}
            $rating={r.id}
          >
            <S.Kbd>{r.key}</S.Kbd>
            {r.label}
          </S.RatingBtn>
        ))}
      </S.Ratings>
    </S.Wrap>
  );
};
