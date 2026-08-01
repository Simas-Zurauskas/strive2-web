'use client';

import { useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
import * as S from './RoadmapSection.styles';
import { ROADMAP_SECTION, ROADMAP_STEPS } from '../../constants';

/**
 * The four steps as waypoints on a dotted route — the same trail motif as
 * the hero's course-route artifact — instead of four identical bordered
 * cards with stock icons. Desktop: a horizontal trail passing through
 * numbered map seals. Mobile: the trail turns vertical down the left edge,
 * which mirrors the product's own course sidebar.
 */
export const RoadmapSection = () => {
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
          <S.Eyebrow>{ROADMAP_SECTION.eyebrow}</S.Eyebrow>
          <S.Heading>{ROADMAP_SECTION.heading}</S.Heading>
          <S.Subhead>{ROADMAP_SECTION.subhead}</S.Subhead>
        </S.Header>

        <S.Track>
          {ROADMAP_STEPS.map((step, i) => (
            <S.Step
              key={step.n}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{
                duration: 0.4,
                delay: prefersReduced ? 0 : Math.min(i * 0.08, 0.32),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <S.Seal aria-hidden="true">{step.n}</S.Seal>
              <S.StepTitle>{step.title}</S.StepTitle>
              <S.StepBody>{step.body}</S.StepBody>
            </S.Step>
          ))}
        </S.Track>
      </S.Inner>
    </S.Wrap>
  );
};
