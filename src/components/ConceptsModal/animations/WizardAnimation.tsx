'use client';

import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './WizardAnimation.styles';

// Slide-through pipeline. Each step rides into a single fixed "stage" slot
// from the right, dwells for a beat, then exits to the left while the next
// step rides in. A horizontal progress rail draws underneath, with the
// step-N dot lighting in step. Visually quite different from a "frames
// lighting up in a row" cycle — at any moment only ONE step is centred on
// the stage and you actively watch it move through.

const STEPS = [
  { n: 1, label: 'Goal', kind: 'goal' as const },
  { n: 2, label: 'Questions', kind: 'questions' as const },
  { n: 3, label: 'Depth', kind: 'depth' as const },
  { n: 4, label: 'Outline', kind: 'outline' as const },
];

const TICK_MS = 1700;

export const WizardAnimation = () => {
  const { prefersReduced } = useMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % STEPS.length), TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const active = STEPS[activeIdx];

  return (
    <S.Wrap aria-hidden>
      <S.Stage>
        {/* Single slot — content swaps in from the right with a slide.
            We re-mount via key so the enter animation always plays. */}
        <S.Slot key={active.n}>
          {active.kind === 'goal' && (
            <S.GoalCard>
              <S.GoalCursor>|</S.GoalCursor>
              <S.GoalLine $w={75} $delay={0} />
              <S.GoalHint>Tell us your goal</S.GoalHint>
            </S.GoalCard>
          )}
          {active.kind === 'questions' && (
            <S.QuestionCard>
              <S.QuestionTitle />
              <S.QuestionOpt $on $delay={120}>Beginner</S.QuestionOpt>
              <S.QuestionOpt $delay={220}>Intermediate</S.QuestionOpt>
              <S.QuestionOpt $delay={320}>Advanced</S.QuestionOpt>
            </S.QuestionCard>
          )}
          {active.kind === 'depth' && (
            <S.DepthRow>
              <S.DepthCard $h={56} $delay={0} />
              <S.DepthCard $h={84} $delay={140} $highlight />
              <S.DepthCard $h={112} $delay={280} />
            </S.DepthRow>
          )}
          {active.kind === 'outline' && (
            <S.Outline>
              <S.OutlineRow $w={70} $delay={0}>Module 1</S.OutlineRow>
              <S.OutlineRow $w={50} $delay={120} $indent>Lesson</S.OutlineRow>
              <S.OutlineRow $w={56} $delay={220} $indent>Lesson</S.OutlineRow>
              <S.OutlineRow $w={66} $delay={320}>Module 2</S.OutlineRow>
              <S.OutlineRow $w={48} $delay={420} $indent>Lesson</S.OutlineRow>
            </S.Outline>
          )}
        </S.Slot>
      </S.Stage>

      <S.Rail>
        <S.RailLine />
        {STEPS.map((s, i) => (
          <S.RailDot
            key={s.n}
            $position={(i / (STEPS.length - 1)) * 100}
            $reached={i <= activeIdx}
            $active={i === activeIdx}
          >
            <S.RailLabel $active={i === activeIdx}>
              {s.n}. {s.label}
            </S.RailLabel>
          </S.RailDot>
        ))}
      </S.Rail>
    </S.Wrap>
  );
};
