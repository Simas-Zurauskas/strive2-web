'use client';

import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './QuizzesGhostPreview.styles';

// Single quiz-card ghost: shows a question + options, then briefly
// highlights the "correct" answer on a slow loop. The brief reveal teaches
// the user what a quiz item looks like and what "Master · 90%" actually
// gates against, before they have any quizzes of their own.
//
// Content is illustrative (not real quiz data).

const QUESTION = {
  prompt: 'Which scheduling rule yields the longest retention?',
  options: [
    { text: 'Daily review until perfect', correct: false },
    { text: 'Review at the edge of forgetting', correct: true },
    { text: 'Review only when motivated', correct: false },
  ],
} as const;

const REVEAL_DELAY_MS = 1800;
const RESET_DELAY_MS = 4200;

export const QuizzesGhostPreview = () => {
  const { prefersReduced } = useMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setRevealed(true);
      return;
    }
    const reveal = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    const reset = setTimeout(() => setRevealed(false), RESET_DELAY_MS);
    return () => {
      clearTimeout(reveal);
      clearTimeout(reset);
    };
  }, [revealed, prefersReduced]);

  return (
    <S.Wrap aria-hidden>
      <S.Card>
        <S.TopRow>
          <S.Eyebrow>Module 1 · Quiz</S.Eyebrow>
          <S.ProgressDots>
            <S.ProgressDot $tone="active" />
            <S.ProgressDot $tone="idle" />
            <S.ProgressDot $tone="idle" />
          </S.ProgressDots>
        </S.TopRow>

        <S.Question>{QUESTION.prompt}</S.Question>

        <S.Options>
          {QUESTION.options.map((opt, i) => {
            const state = revealed && opt.correct ? 'correct' : 'idle';
            return (
              <S.Option key={i} $state={state}>
                <S.Bullet $state={state} />
                {opt.text}
              </S.Option>
            );
          })}
        </S.Options>
      </S.Card>
    </S.Wrap>
  );
};
