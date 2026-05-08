'use client';

import { HelpAnchor } from '@/components';
import { useMotion } from '@/theme/motionPresets';
import * as S from './HowItWorksSection.styles';
import { HOW_IT_WORKS } from '../../constants';

const VISUAL_BY_STEP: Record<number, React.ReactNode> = {
  1: (
    <>
      <S.VisualEyebrow>Step 2 — Personalise</S.VisualEyebrow>
      <S.ChipRow>
        <S.Chip $active>Beginner</S.Chip>
        <S.Chip>Intermediate</S.Chip>
        <S.Chip>Advanced</S.Chip>
      </S.ChipRow>
      <S.ChipRow>
        <S.Chip>30 min/day</S.Chip>
        <S.Chip $active>1 hr/day</S.Chip>
        <S.Chip>Weekends</S.Chip>
      </S.ChipRow>
      <S.InputMock>What&rsquo;s your background in this topic?</S.InputMock>
    </>
  ),
  2: (
    <S.LessonPreview>
      <S.VisualEyebrow>Module 1 — Foundations</S.VisualEyebrow>
      <S.LessonPreviewTitle>Why caching the query matters</S.LessonPreviewTitle>
      <S.LessonPreviewProse>
        Re-fetching on every render bills you twice and ships stale data to the
        screen. A query cache fixes both — and adds retry, dedupe, and
        background revalidation for free.
      </S.LessonPreviewProse>
      <S.LessonPreviewHeading>The minimum useQuery setup</S.LessonPreviewHeading>
      <S.LessonPreviewProse>
        Three keys do all the work: <em>queryKey</em> (identity),{' '}
        <em>queryFn</em> (fetch), and an optional <em>staleTime</em>
        <S.PreviewCaret />
      </S.LessonPreviewProse>
    </S.LessonPreview>
  ),
  3: (
    <S.RecallVisual>
      <S.VisualEyebrow>Today&rsquo;s recall queue</S.VisualEyebrow>
      <S.RecallCard>
        <S.MasteryBadge>Mastered</S.MasteryBadge>
        <S.StreamLine $w="92%" />
        <S.StreamLine $w="74%" />
      </S.RecallCard>
      <S.RecallCard>
        <S.StreamLine $w="86%" $accent />
        <S.StreamLine $w="68%" />
        <S.StreamLine $w="40%" />
      </S.RecallCard>
    </S.RecallVisual>
  ),
};

export const HowItWorksSection = () => {
  const { fadeUp } = useMotion();
  return (
    <S.Wrap id="how-it-works">
      <S.Inner>
        <S.SectionHeader>
          <S.Eyebrow>How it works</S.Eyebrow>
          <S.Heading>Three steps. From a sentence to your first lesson.</S.Heading>
        </S.SectionHeader>

        {HOW_IT_WORKS.map((step, i) => (
          <S.Step
            key={step.n}
            $reverse={i % 2 === 1}
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ ...fadeUp.transition, duration: 0.5 }}
          >
            <S.StepCopy>
              <S.StepNumber>Step {step.n}</S.StepNumber>
              <S.StepTitle>
                {step.title}
                {step.n === 3 && <> <HelpAnchor concept="spaced-recall" /></>}
              </S.StepTitle>
              <S.StepBody>{step.body}</S.StepBody>
            </S.StepCopy>
            <S.StepVisual aria-hidden="true">{VISUAL_BY_STEP[step.n]}</S.StepVisual>
          </S.Step>
        ))}
      </S.Inner>
    </S.Wrap>
  );
};
