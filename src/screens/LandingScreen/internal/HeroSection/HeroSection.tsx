'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './HeroSection.styles';
import { LiveLessonMock } from './LiveLessonMock';
import { HERO } from '../../constants';

interface HeroSectionProps {
  onOpenSignUp: () => void;
}

export const HeroSection = ({ onOpenSignUp }: HeroSectionProps) => {
  const { fadeUp, prefersReduced } = useMotion();

  // Eyebrow → headline → subhead → CTA → trust pills, with a short
  // 60ms stagger that the reduced-motion variant collapses to a simple
  // opacity fade.
  const stagger = (i: number) => ({
    initial: fadeUp.initial,
    animate: fadeUp.animate,
    transition: {
      ...(fadeUp.transition ?? {}),
      delay: prefersReduced ? 0 : i * 0.06,
    },
  });

  return (
    <S.Wrap>
      <S.Inner>
        <S.CopyCol>
          <S.Eyebrow as={motion.span} {...stagger(0)}>
            {HERO.eyebrow}
          </S.Eyebrow>
          <S.Headline as={motion.h1} {...stagger(1)}>
            Your <em>personalised</em> path to mastery.
          </S.Headline>
          <S.HeadlineSub as={motion.p} {...stagger(2)}>
            {HERO.headlineSub}
          </S.HeadlineSub>
          <S.Subhead as={motion.p} {...stagger(3)}>
            {HERO.subhead}
          </S.Subhead>
          <S.CtaRow as={motion.div} {...stagger(4)}>
            <S.PrimaryCta
              type="button"
              onClick={onOpenSignUp}
              aria-haspopup="dialog"
              data-analytics-id="landing.hero.cta.signup"
            >
              {HERO.ctaPrimary}
              <ArrowRight size={18} aria-hidden="true" />
            </S.PrimaryCta>
            <S.Microcopy>{HERO.ctaMicrocopy}</S.Microcopy>
            <S.SecondaryCta
              href="#how-it-works"
              data-analytics-id="landing.hero.cta.scroll"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('how-it-works');
                if (!el) return;
                el.scrollIntoView({
                  behavior: prefersReduced ? 'auto' : 'smooth',
                  block: 'start',
                });
              }}
            >
              {HERO.ctaSecondary} ↓
            </S.SecondaryCta>
          </S.CtaRow>
        </S.CopyCol>

        <S.VisualCol
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <LiveLessonMock />
        </S.VisualCol>
      </S.Inner>
    </S.Wrap>
  );
};
