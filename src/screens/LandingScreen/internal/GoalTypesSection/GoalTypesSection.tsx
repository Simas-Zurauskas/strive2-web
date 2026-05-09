'use client';

import { useMotion } from '@/theme/motionPresets';
import { GoalTypeAnim } from './GoalTypeAnim';
import * as S from './GoalTypesSection.styles';
import { GOAL_TYPES, GOAL_TYPES_SECTION } from '../../constants';

export const GoalTypesSection = () => {
  const { fadeUp, prefersReduced } = useMotion();

  return (
    <S.Wrap>
      <S.Inner
        initial={fadeUp.initial}
        whileInView={fadeUp.animate}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ ...fadeUp.transition, duration: 0.45 }}
      >
        <S.Header>
          <S.Eyebrow>{GOAL_TYPES_SECTION.eyebrow}</S.Eyebrow>
          <S.Heading>{GOAL_TYPES_SECTION.heading}</S.Heading>
          <S.Subhead>{GOAL_TYPES_SECTION.subhead}</S.Subhead>
        </S.Header>

        <S.Grid>
          {GOAL_TYPES.map((g, i) => (
            <S.Card
              key={g.key}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{
                duration: 0.4,
                delay: prefersReduced ? 0 : Math.min(i * 0.06, 0.3),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <GoalTypeAnim type={g.key} />
              <S.Label>{g.label}</S.Label>
              <S.Verb>{g.verb}</S.Verb>
              <S.Example>{g.example}</S.Example>
            </S.Card>
          ))}
        </S.Grid>
      </S.Inner>
    </S.Wrap>
  );
};
