'use client';

import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './HomeGhostPreview.styles';

// Ghost course-being-built. Shows a course title + 4 module rows with
// width-bars that "fill in" sequentially, then resets — visually conveys
// "your course assembles in front of you in about a minute". Different
// vibe from RecallGhostPreview (cards stack/flip) and QuizzesGhostPreview
// (single answered question) so the three previews don't all read as
// the same animation.
//
// All content is illustrative — keep this resilient to the marketing
// landing's `goalRotations`, but don't share the same exact strings so
// the user doesn't feel like they've seen this 10 seconds ago.

const MODULES = [
  'Foundations & first wins',
  'The mechanics, end-to-end',
  'Edge cases & pitfalls',
  'Putting it into practice',
] as const;

const STEP_MS = 600;
const RESET_MS = 1200;

interface HomeGhostPreviewProps {
  /**
   * Visual scale. `lg` (default) is the empty-state-on-screen size used in
   * `HomeScreen`. `sm` is the embedded-in-modal size used by the
   * `modules-and-lessons` concept modal.
   */
  size?: 'sm' | 'md' | 'lg';
}

export const HomeGhostPreview = ({ size = 'lg' }: HomeGhostPreviewProps = {}) => {
  const { prefersReduced } = useMotion();
  const [filledCount, setFilledCount] = useState(prefersReduced ? MODULES.length : 0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setFilledCount((n) => {
        if (n >= MODULES.length) return 0; // reset → loop
        return n + 1;
      });
    }, filledCount >= MODULES.length ? RESET_MS : STEP_MS);
    return () => clearInterval(id);
  }, [filledCount, prefersReduced]);

  // The bar widths are stable per module so the eye reads "course
  // structure" rather than a noisy random progress demo.
  const widths = [62, 78, 48, 72];

  return (
    <S.Wrap aria-hidden $size={size}>
      <S.Card>
        <S.TopRow>
          <S.Eyebrow>Course preview</S.Eyebrow>
          <S.Status>Generating</S.Status>
        </S.TopRow>

        <S.Title>Your goal becomes a course in about a minute.</S.Title>

        <S.Modules>
          {MODULES.map((label, i) => {
            const filled = i < filledCount || prefersReduced;
            return (
              <S.Module
                key={i}
                initial={false}
                animate={{ opacity: filled ? 1 : 0.4 }}
                transition={{ duration: 0.3 }}
              >
                <S.ModuleNum>{i + 1}</S.ModuleNum>
                <S.ModuleLabel>{label}</S.ModuleLabel>
                <S.ModuleBarTrack>
                  <S.ModuleBarFill $w={filled ? widths[i] : 0} />
                </S.ModuleBarTrack>
              </S.Module>
            );
          })}
        </S.Modules>
      </S.Card>
    </S.Wrap>
  );
};
