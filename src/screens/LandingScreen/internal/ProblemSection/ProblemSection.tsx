'use client';

import { useMotion } from '@/theme/motionPresets';
import * as S from './ProblemSection.styles';
import { PROBLEM } from '../../constants';

export const ProblemSection = () => {
  const { fadeUp } = useMotion();
  return (
    <S.Wrap>
      <S.Inner
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...fadeUp.transition, duration: 0.5 }}
      >
        <S.Heading>
          Most of what you learn is <em>gone</em> in three weeks.
        </S.Heading>
        <S.Body>{PROBLEM.body}</S.Body>
      </S.Inner>
    </S.Wrap>
  );
};
