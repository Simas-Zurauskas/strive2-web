'use client';

import { useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
import * as S from './GoalTypesSection.styles';
import { GOAL_TYPES, GOAL_TYPES_SECTION } from '../../constants';

/**
 * The five goal types set as a book's table of contents — big serif
 * numerals, small-cap type labels, the real example goal as italic
 * marginalia — instead of the previous five identical icon cards.
 * Part of the Cartographer's Press pass: one of the two "de-card the
 * grids" moves (the other is the roadmap route).
 */
export const GoalTypesSection = () => {
  const { fadeUp, prefersReduced } = useMotion();

  return (
    <S.Wrap>
      <S.Inner
        initial={fadeUp.initial}
        whileInView={fadeUp.animate}
        viewport={VIEWPORT_ONCE}
        transition={{ ...fadeUp.transition, duration: 0.45 }}
      >
        <S.Header>
          <S.Eyebrow>{GOAL_TYPES_SECTION.eyebrow}</S.Eyebrow>
          <S.Heading>{GOAL_TYPES_SECTION.heading}</S.Heading>
          <S.Subhead>{GOAL_TYPES_SECTION.subhead}</S.Subhead>
        </S.Header>

        <S.Toc>
          {GOAL_TYPES.map((g, i) => (
            <S.Row
              key={g.key}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{
                duration: 0.4,
                delay: prefersReduced ? 0 : Math.min(i * 0.06, 0.3),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <S.Numeral aria-hidden="true">0{i + 1}</S.Numeral>
              <S.RowMain>
                <S.Label>{g.label}</S.Label>
                <S.RowTitle>{g.verb}</S.RowTitle>
              </S.RowMain>
              <S.Example>“{g.example}”</S.Example>
            </S.Row>
          ))}
        </S.Toc>
      </S.Inner>
    </S.Wrap>
  );
};
