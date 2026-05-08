'use client';

import { useEffect, useState } from 'react';
import { RecallGhostPreview } from '@/screens/RecallScreen/internal/RecallGhostPreview/RecallGhostPreview';
import { useMotion } from '@/theme/motionPresets';
import * as S from './SpacedRecallAnimation.styles';

// Two-part: existing RecallGhostPreview at sm (left) anchors the card
// format. On the right, a single card hops across an arc'd schedule with
// spring physics — at each landing the destination stop pulses, the card
// briefly tilts and bounces, and the active interval below brightens.
// Real intervals are mirrored from api/src/lib/recallConstants (1d → 3d
// → 7d → 14d → 30d).

const STOPS = ['1d', '3d', '7d', '14d', '30d'] as const;
const TICK_MS = 1100;

export const SpacedRecallAnimation = () => {
  const { prefersReduced } = useMotion();
  const [stop, setStop] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setStop((s) => (s + 1) % STOPS.length), TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const positionFor = (i: number) => 6 + (i / (STOPS.length - 1)) * 88;

  return (
    <S.Wrap aria-hidden>
      <S.LeftPanel>
        <RecallGhostPreview size="sm" />
      </S.LeftPanel>

      <S.RightPanel>
        <S.RightLabel>review interval</S.RightLabel>
        <S.Track>
          <S.Arc />
          {STOPS.map((_, i) => (
            <S.Stop
              key={i}
              $position={positionFor(i)}
              $reached={i <= stop}
              $isCurrent={i === stop}
            />
          ))}
          {/* Re-mounting the card on each `stop` change re-triggers the
              landing keyframe — gives a fresh tilt+bounce per hop. */}
          <S.HoppingCard key={stop} $position={positionFor(stop)} $key={stop} />
        </S.Track>
        <S.IntervalRow>
          {STOPS.map((interval, i) => (
            <S.IntervalCell key={interval} $current={i === stop}>
              {interval}
            </S.IntervalCell>
          ))}
        </S.IntervalRow>
        <S.Footnote>each successful recall widens the gap</S.Footnote>
      </S.RightPanel>
    </S.Wrap>
  );
};
