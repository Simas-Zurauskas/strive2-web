'use client';

import { ArrowRight } from 'lucide-react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './FinalCtaSection.styles';
import { FINAL_CTA } from '../../constants';

interface FinalCtaSectionProps {
  onOpenSignUp: () => void;
}

export const FinalCtaSection = ({ onOpenSignUp }: FinalCtaSectionProps) => {
  const { fadeUp } = useMotion();
  return (
    <S.Wrap>
      <S.Inner
        initial={fadeUp.initial}
        whileInView={fadeUp.animate}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ ...fadeUp.transition, duration: 0.4 }}
      >
        <S.Heading>{FINAL_CTA.heading}</S.Heading>
        <S.Cta
          type="button"
          onClick={onOpenSignUp}
          aria-haspopup="dialog"
          data-analytics-id="landing.final-cta.signup"
        >
          {FINAL_CTA.cta}
          <ArrowRight size={18} aria-hidden="true" />
        </S.Cta>
        <S.Microcopy>{FINAL_CTA.microcopy}</S.Microcopy>
      </S.Inner>
    </S.Wrap>
  );
};
