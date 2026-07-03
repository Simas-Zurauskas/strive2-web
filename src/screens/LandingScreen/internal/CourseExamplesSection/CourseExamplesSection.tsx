'use client';

import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Brain,
  Camera,
  Code,
  Compass,
  Cpu,
  Handshake,
  Languages,
  Megaphone,
  MessagesSquare,
  Mic,
  Music,
  Palette,
  PenLine,
  Rocket,
  ShieldCheck,
  Sigma,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './CourseExamplesSection.styles';
import {
  COURSE_EXAMPLES,
  COURSE_EXAMPLES_SECTION,
  type CourseExampleIcon,
} from '../../constants';

const ICONS: Record<CourseExampleIcon, LucideIcon> = {
  Code,
  BarChart3,
  Cpu,
  ShieldCheck,
  Megaphone,
  TrendingUp,
  Rocket,
  Compass,
  PenLine,
  Music,
  Palette,
  Camera,
  Languages,
  MessagesSquare,
  Mic,
  Handshake,
  Sigma,
  Brain,
};

interface CourseExamplesSectionProps {
  onOpenSignUp: () => void;
}

export const CourseExamplesSection = ({ onOpenSignUp }: CourseExamplesSectionProps) => {
  const { fadeUp, prefersReduced } = useMotion();

  return (
    <S.Wrap>
      <S.Inner
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...fadeUp.transition, duration: 0.45 }}
      >
        <S.Header>
          <S.Eyebrow>{COURSE_EXAMPLES_SECTION.eyebrow}</S.Eyebrow>
          <S.Heading>{COURSE_EXAMPLES_SECTION.heading}</S.Heading>
          <S.Subhead>{COURSE_EXAMPLES_SECTION.subhead}</S.Subhead>
        </S.Header>

        <S.Grid>
          {COURSE_EXAMPLES.map((example, i) => {
            const Icon = ICONS[example.icon];
            return (
              <S.Card
                key={example.title}
                type="button"
                onClick={onOpenSignUp}
                aria-haspopup="dialog"
                aria-label={`Start a course on ${example.title}`}
                data-analytics-id="landing.course_examples.card"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: prefersReduced ? 0 : Math.min(i * 0.03, 0.3),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <S.CardTop>
                  <S.IconBadge aria-hidden="true">
                    <Icon size={18} strokeWidth={1.75} />
                  </S.IconBadge>
                  <S.GoArrow aria-hidden="true">
                    <ArrowUpRight size={16} />
                  </S.GoArrow>
                </S.CardTop>
                <S.Category>{example.category}</S.Category>
                <S.Title>{example.title}</S.Title>
                <S.Blurb>{example.blurb}</S.Blurb>
              </S.Card>
            );
          })}
        </S.Grid>

        <S.Footnote>
          Don’t see your topic? Strive builds a course for almost any goal.
          <S.FootnoteCta
            type="button"
            onClick={onOpenSignUp}
            aria-haspopup="dialog"
            data-analytics-id="landing.course_examples.footnote_cta"
          >
            Start from your own goal
            <ArrowRight size={16} aria-hidden="true" />
          </S.FootnoteCta>
        </S.Footnote>
      </S.Inner>
    </S.Wrap>
  );
};
