'use client';

import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './QuizTypesAnimation.styles';

// Two-card 3D carousel. Inline (self-check, no score) and Module (graded,
// scored). The active card faces forward; the inactive one rotates 70°
// out of view. Each card animates its content in fresh on flip — title,
// options, and result badge appear on a small stagger so the user reads
// the difference in role rather than just colour.

const TICK_MS = 2600;
const TYPES = [
  {
    id: 'inline',
    label: 'Inline quiz',
    sub: 'Inside a lesson · self-check',
    badge: null as string | null,
    detail: 'no record',
  },
  {
    id: 'module',
    label: 'Module quiz',
    sub: 'End of module · graded',
    badge: '92%',
    detail: 'best score kept',
  },
] as const;

export const QuizTypesAnimation = () => {
  const { prefersReduced } = useMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % TYPES.length), TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  return (
    <S.Wrap aria-hidden>
      <S.Stage>
        {TYPES.map((t, i) => {
          const isActive = i === activeIdx;
          return (
            <S.Card key={t.id} $active={isActive} $variant={t.id} $index={i}>
              <S.Eyebrow $variant={t.id}>{t.sub}</S.Eyebrow>
              <S.Label>{t.label}</S.Label>

              <S.Question>
                <S.QuestionLine $w={86} $delay={isActive ? 60 : 0} />
                <S.QuestionLine $w={62} $delay={isActive ? 140 : 0} />
              </S.Question>

              <S.Options>
                <S.Option $on={isActive} $delay={isActive ? 220 : 0}>A</S.Option>
                <S.Option $delay={isActive ? 280 : 0}>B</S.Option>
                <S.Option $delay={isActive ? 340 : 0}>C</S.Option>
              </S.Options>

              <S.Footer>
                {t.badge && (
                  <S.ScoreBadge $on={isActive}>
                    {t.badge}
                  </S.ScoreBadge>
                )}
                <S.Detail>{t.detail}</S.Detail>
              </S.Footer>
            </S.Card>
          );
        })}
      </S.Stage>
    </S.Wrap>
  );
};
