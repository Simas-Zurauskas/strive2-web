'use client';

import {
  GraduationCap,
  PenLine,
  Sparkles,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './RoadmapSection.styles';
import { ROADMAP_SECTION, ROADMAP_STEPS, type RoadmapStepIcon } from '../../constants';

const ICONS: Record<RoadmapStepIcon, LucideIcon> = {
  PenLine,
  Sparkles,
  SlidersHorizontal,
  GraduationCap,
};

export const RoadmapSection = () => {
  const { fadeUp, prefersReduced } = useMotion();

  return (
    <S.Wrap>
      <S.Inner
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...fadeUp.transition, duration: 0.45 }}
      >
        <S.Header>
          <S.Eyebrow>{ROADMAP_SECTION.eyebrow}</S.Eyebrow>
          <S.Heading>{ROADMAP_SECTION.heading}</S.Heading>
          <S.Subhead>{ROADMAP_SECTION.subhead}</S.Subhead>
        </S.Header>

        <S.Grid>
          {ROADMAP_STEPS.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <S.Step
                key={step.n}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: prefersReduced ? 0 : Math.min(i * 0.08, 0.32),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <S.StepHeader>
                  <S.StepNumber>{step.n}</S.StepNumber>
                  <S.StepIcon aria-hidden="true">
                    <Icon size={20} strokeWidth={1.75} />
                  </S.StepIcon>
                </S.StepHeader>
                <S.StepTitle>{step.title}</S.StepTitle>
                <S.StepBody>{step.body}</S.StepBody>
              </S.Step>
            );
          })}
        </S.Grid>
      </S.Inner>
    </S.Wrap>
  );
};
