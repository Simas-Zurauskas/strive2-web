'use client';

import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './HowStriveWorksAnimation.styles';

// Continuous-flow pipeline. A single typed goal threads through four
// transformations on the SAME canvas: typing → branching modules → a
// streaming lesson → recall cards that orbit out on a timeline. Each
// stage *adds* to what's already on screen rather than replacing it,
// so the user sees the journey accumulate. After all four stages, the
// canvas wipes and the cycle restarts.

const PHASES = ['typing', 'branch', 'stream', 'orbit'] as const;
type Phase = (typeof PHASES)[number];

const PHASE_MS: Record<Phase, number> = {
  typing: 1400,
  branch: 1300,
  stream: 1500,
  orbit: 1700,
};

const TYPED_GOAL = 'Monetize my content';

export const HowStriveWorksAnimation = () => {
  const { prefersReduced } = useMotion();
  const [phaseIdx, setPhaseIdx] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setTimeout(
      () => setPhaseIdx((i) => (i + 1) % PHASES.length),
      PHASE_MS[PHASES[phaseIdx]],
    );
    return () => clearTimeout(id);
  }, [phaseIdx, prefersReduced]);

  const phase = PHASES[phaseIdx];
  // Stages cumulate — once "branch" is reached, modules stay; once "stream"
  // is reached, the lesson stays; etc. Reset wipes everything when the
  // cycle restarts at "typing".
  const showModules = phase === 'branch' || phase === 'stream' || phase === 'orbit';
  const showLesson = phase === 'stream' || phase === 'orbit';
  const showOrbit = phase === 'orbit';

  return (
    <S.Wrap aria-hidden>
      <S.Canvas>
        {/* Stage 1 — typed goal, always present */}
        <S.GoalPill key={`goal-${phaseIdx === 0 ? phaseIdx : 'stable'}`}>
          <S.GoalText>
            {phase === 'typing' ? <S.TypedSpan>{TYPED_GOAL}</S.TypedSpan> : TYPED_GOAL}
            {phase === 'typing' && <S.Caret />}
          </S.GoalText>
        </S.GoalPill>

        {/* Stage 2 — modules fan out beneath the goal */}
        <S.ModuleFan $on={showModules}>
          {['Audience', 'Offers', 'Funnel'].map((m, i) => (
            <S.ModulePill key={m} $delay={i * 120} $highlighted={showLesson && i === 0}>
              {m}
            </S.ModulePill>
          ))}
        </S.ModuleFan>

        {/* Stage 3 — one module zooms into a streaming lesson page */}
        <S.LessonPage $on={showLesson}>
          <S.LessonRow $w={84} $delay={0} />
          <S.LessonRow $w={62} $delay={140} />
          <S.LessonRow $w={74} $delay={280} />
          <S.LessonRow $w={48} $delay={420} />
        </S.LessonPage>

        {/* Stage 4 — recall cards orbit out on a soft arc */}
        <S.OrbitField $on={showOrbit}>
          <S.OrbitArc />
          {[0, 1, 2].map((i) => (
            <S.OrbitCard key={i} $i={i} />
          ))}
        </S.OrbitField>
      </S.Canvas>
    </S.Wrap>
  );
};
