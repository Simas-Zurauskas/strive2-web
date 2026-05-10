'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useMotion } from '@/theme/motionPresets';
import * as S from './FinalCtaSection.styles';
import { RecallCardLoop } from './RecallCardLoop';
import { FINAL_CTA } from '../../constants';

interface FinalCtaSectionProps {
  onOpenSignUp: () => void;
}

export const FinalCtaSection = ({ onOpenSignUp }: FinalCtaSectionProps) => {
  const { fadeUp, prefersReduced } = useMotion();

  // Eyebrow → headline → subhead → CTA, mirrors the hero stagger so the
  // page bookends visually as well as conceptually.
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
            {FINAL_CTA.eyebrow}
          </S.Eyebrow>
          <S.Heading as={motion.h2} {...stagger(1)}>
            {FINAL_CTA.heading}
          </S.Heading>
          <S.Subhead as={motion.p} {...stagger(2)}>
            {FINAL_CTA.subhead}
          </S.Subhead>
          <S.CtaRow as={motion.div} {...stagger(3)}>
            <S.PrimaryCta
              type="button"
              onClick={onOpenSignUp}
              aria-haspopup="dialog"
              data-analytics-id="landing.final-cta.signup"
            >
              {FINAL_CTA.cta}
              <ArrowRight size={18} aria-hidden="true" />
            </S.PrimaryCta>
            <S.Microcopy>{FINAL_CTA.microcopy}</S.Microcopy>
            <S.SecondaryCta
              as={Link}
              href="/pricing"
              data-analytics-id="landing.final-cta.pricing"
            >
              {FINAL_CTA.ctaSecondary} →
            </S.SecondaryCta>
          </S.CtaRow>
        </S.CopyCol>

        <S.VisualCol
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <RecallCardLoop />
        </S.VisualCol>
      </S.Inner>
    </S.Wrap>
  );
};
