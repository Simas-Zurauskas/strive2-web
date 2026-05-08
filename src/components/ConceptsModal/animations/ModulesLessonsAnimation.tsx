'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { easeOutSpring, useMotion } from '@/theme/motionPresets';
import * as S from './ModulesLessonsAnimation.styles';

// Two paired views of the SAME generated course:
//   Left  — a stable list of all modules; bars fill cumulatively as the
//           "AI" advances the spotlight.
//   Right — a single drill-down panel that swaps to the currently-
//           spotlighted module's lessons + quiz, in lockstep with the
//           left cursor.
// The right panel never accumulates rows, so the slot height stays
// predictable regardless of how many lessons a module has.

const MODULES = [
  { name: 'Foundations', lessons: ['Intro', 'The basics'] },
  { name: 'Mechanics',   lessons: ['Cause & effect', 'Examples'] },
  { name: 'Edge cases',  lessons: ['What can go wrong'] },
  { name: 'Practice',    lessons: ['Putting it together'] },
];

const TICK_MS = 1500;

export const ModulesLessonsAnimation = () => {
  const { prefersReduced } = useMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % MODULES.length),
      TICK_MS,
    );
    return () => clearInterval(id);
  }, [prefersReduced]);

  const focused = MODULES[active];

  return (
    <S.Wrap aria-hidden>
      <S.LeftCard>
        <S.LeftEyebrow>Course preview</S.LeftEyebrow>
        <S.LeftTitle>Your goal becomes a course.</S.LeftTitle>
        <S.LeftRows>
          {MODULES.map((m, i) => (
            <S.LeftRow key={i} $on={i <= active} $isCurrent={i === active}>
              <S.LeftRowNum $on={i <= active}>{i + 1}</S.LeftRowNum>
              <S.LeftRowLabel>{m.name}</S.LeftRowLabel>
              <S.LeftRowBar>
                <S.LeftRowFill $on={i <= active} />
              </S.LeftRowBar>
            </S.LeftRow>
          ))}
        </S.LeftRows>
      </S.LeftCard>

      <S.RightCard>
        <S.RightHeader>
          <S.RightEyebrow>Outline</S.RightEyebrow>
          <S.StepCounter>
            <S.StepCounterCurrent>{active + 1}</S.StepCounterCurrent>
            <span>/ {MODULES.length}</span>
          </S.StepCounter>
        </S.RightHeader>

        <S.RightStage>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.28, ease: easeOutSpring }}
            >
              <S.OutlineGroup>
                <S.ModuleHeader>{focused.name}</S.ModuleHeader>
                {focused.lessons.map((lesson, j) => (
                  <S.LessonItem key={j} $delay={80 + j * 70}>
                    · {lesson}
                  </S.LessonItem>
                ))}
                <S.QuizItem $delay={80 + focused.lessons.length * 70}>
                  <CornerDownRight size={11} strokeWidth={2} />
                  module quiz
                </S.QuizItem>
              </S.OutlineGroup>
            </motion.div>
          </AnimatePresence>
        </S.RightStage>
      </S.RightCard>
    </S.Wrap>
  );
};
