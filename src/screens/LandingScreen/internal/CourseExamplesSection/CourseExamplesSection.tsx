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
import { clearPendingGoal, setPendingGoal } from '@/lib/pendingGoal';
import { useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
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
        whileInView={fadeUp.animate}
        viewport={VIEWPORT_ONCE}
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
                onClick={() => {
                  // The card's topic becomes the visitor's starting goal —
                  // stashed through auth and prefilled into wizard step 1,
                  // so "pick one" actually picks one instead of dead-ending
                  // in a bare signup form.
                  setPendingGoal(`${example.title} — ${example.blurb}`);
                  onOpenSignUp();
                }}
                aria-haspopup="dialog"
                data-analytics-id="landing.course_examples.card"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
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
            // "Your own goal" = blank slate: drop any example stashed by an
            // earlier card click so the wizard doesn't prefill the abandoned
            // topic under a button that promised the opposite.
            onClick={() => { clearPendingGoal(); onOpenSignUp(); }}
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
