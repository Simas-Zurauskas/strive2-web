'use client';

import * as S from './LearnScreen.styles';
import type { LearnTopic } from '@/lib/learn';

interface LearnTopicScreenProps {
  topic: LearnTopic;
}

const SIGNUP_HREF = '/?auth=signup';

export const LearnTopicScreen = ({ topic }: LearnTopicScreenProps) => {
  const totalLessons = topic.sampleCourse.modules.reduce((sum, m) => sum + m.lessonCount, 0);
  const totalModules = topic.sampleCourse.modules.length;

  return (
    <S.Layout>
      <S.Breadcrumb aria-label="Breadcrumb">
        <S.BreadcrumbLink href="/">Home</S.BreadcrumbLink>
        <S.BreadcrumbDivider />
        <S.BreadcrumbLink href="/learn">Learn</S.BreadcrumbLink>
        <S.BreadcrumbDivider />
        <S.BreadcrumbCurrent>{topic.title}</S.BreadcrumbCurrent>
      </S.Breadcrumb>

      <S.Eyebrow>{topic.eyebrow}</S.Eyebrow>
      <S.HeroTitle>{topic.headline}</S.HeroTitle>
      <S.HeroSubtitle>{topic.subhead}</S.HeroSubtitle>

      <div>
        <S.PrimaryCta href={SIGNUP_HREF}>Build my {topic.title} course — free</S.PrimaryCta>
        <S.CtaMicrocopy>Free tier included. No credit card.</S.CtaMicrocopy>
      </div>

      <S.Meta>
        <span>{topic.estimatedHours}</span>
        <span>{topic.difficulty === 'all' ? 'All levels' : topic.difficulty}</span>
        <span>English</span>
      </S.Meta>

      <S.SectionHeading>What you’ll learn</S.SectionHeading>
      <S.OutcomesList>
        {topic.outcomes.map((outcome) => (
          <S.OutcomeItem key={outcome}>{outcome}</S.OutcomeItem>
        ))}
      </S.OutcomesList>

      <S.SectionHeading>{topic.sampleCourse.title}</S.SectionHeading>
      <S.ModuleList>
        {topic.sampleCourse.modules.map((module) => (
          <S.ModuleRow key={module.title}>
            <S.ModuleTitle>{module.title}</S.ModuleTitle>
            <S.ModuleLessonCount>
              {module.lessonCount} {module.lessonCount === 1 ? 'lesson' : 'lessons'}
            </S.ModuleLessonCount>
          </S.ModuleRow>
        ))}
      </S.ModuleList>
      <S.SampleCaption>
        Demonstration outline — your course is generated around your answers, so module count, depth,
        and difficulty will differ from this. Across the {totalModules} modules above there are
        {' '}
        {totalLessons} lessons.
      </S.SampleCaption>

      <S.SectionHeading>Frequently asked</S.SectionHeading>
      <S.FaqList>
        {topic.faq.map((entry) => (
          <S.FaqItem key={entry.question}>
            <S.FaqQuestion>{entry.question}</S.FaqQuestion>
            <S.FaqAnswer>{entry.answer}</S.FaqAnswer>
          </S.FaqItem>
        ))}
      </S.FaqList>

      <S.FinalCta>
        <S.FinalCtaHeading>Ready to learn {topic.title}?</S.FinalCtaHeading>
        <S.FinalCtaSubhead>
          Tell us where you are today. AI builds your course in minutes — and the daily recall
          queue makes sure you keep what you learn.
        </S.FinalCtaSubhead>
        <S.PrimaryCta href={SIGNUP_HREF}>Start free</S.PrimaryCta>
      </S.FinalCta>
    </S.Layout>
  );
};
