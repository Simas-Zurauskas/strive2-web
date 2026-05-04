'use client';

import { useEffect, useState } from 'react';
import * as S from '../ModuleQuizScreen.styles';

/**
 * Phases shown beneath the generation panel. Worded as observations
 * about *what generation involves* rather than claims about what the
 * model is doing right now (it isn't really phased server-side, and
 * pretending it is reads as fake to anyone who waits long enough).
 * The interval cycle is slow and intentionally stops at "Almost ready"
 * so a 30s+ run doesn't feel stuck on the same line.
 */
const PHASES = [
  'Reading this module’s lessons',
  'Drafting questions',
  'Checking each one for accuracy',
  'Almost ready',
];

const PHASE_INTERVAL_MS = 6500;

export const QuizGenerationPanel = () => {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhaseIndex((i) => Math.min(i + 1, PHASES.length - 1));
    }, PHASE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <S.GeneratingCard>
      <S.GeneratingRule />
      <S.GeneratingEyebrow>Drafting</S.GeneratingEyebrow>
      <S.GeneratingTitle>Writing your quiz.</S.GeneratingTitle>
      <S.GeneratingLead>
        Building questions tied to the lessons you&rsquo;ve worked through. Around 30 seconds —
        feel free to step away.
      </S.GeneratingLead>
      <S.GeneratingPhase aria-live="polite">
        <S.GeneratingDots aria-hidden>
          <S.GeneratingDot $delay={0} />
          <S.GeneratingDot $delay={180} />
          <S.GeneratingDot $delay={360} />
        </S.GeneratingDots>
        {PHASES[phaseIndex]}
      </S.GeneratingPhase>
    </S.GeneratingCard>
  );
};
