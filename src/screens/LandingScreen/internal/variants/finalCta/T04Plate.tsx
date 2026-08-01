'use client';

import Link from 'next/link';
import { analytics } from '@/lib/analytics';
import { easeOutSpring, useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
import { renderEm } from './emphasis';
import * as S from './T04Plate.styles';
import { CTA, MICRO, SECONDARY, T04 } from './variants';

interface Props {
  onOpenSignUp: () => void;
}

/**
 * START LEARNING · VARIANT 04 — The Plate.
 *
 * The page turns on ink at `ProblemSection` and this closes on ink, so the
 * argument is bracketed rather than fading out into cream. The only
 * candidate in the set built for grandeur: full-bleed dark band, a headline
 * at up to 4.5rem, one gold wash, and a ruled register of three clauses at
 * the foot doing the job the shipped 38-word subhead was doing.
 *
 * MOTION. Two gold rules grow outward from their centres, top and bottom,
 * and the plate fills between them. Nothing slides.
 *
 * REDUCED MOTION. Rules start at full width, delays collapse — the plate is
 * simply already printed.
 *
 * CLAIMS. The headline restates "a course from one sentence", which is on
 * the sanctioned list. The three foot clauses are all sanctioned. Nothing
 * states a time, an outcome or a figure.
 */
export const T04Plate = ({ onOpenSignUp }: Props) => {
  const { prefersReduced } = useMotion();

  const at = (t: number) => (prefersReduced ? 0 : t);
  const dur = (t: number) => (prefersReduced ? 0.2 : t);
  const from = (v: number) => (prefersReduced ? 1 : v);

  const rule = (delay: number) => ({
    initial: { opacity: 0, scaleX: from(0.12) },
    whileInView: { opacity: 0.55, scaleX: 1 },
    viewport: VIEWPORT_ONCE,
    transition: { duration: dur(0.85), delay: at(delay), ease: easeOutSpring },
  });

  return (
    <S.Wrap>
      <S.Inner>
        <S.Rule aria-hidden="true" {...rule(0)} />

        <S.Eyebrow
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: dur(0.45), delay: at(0.14) }}
        >
          {T04.eyebrow}
        </S.Eyebrow>

        <S.Headline
          initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: dur(0.65), delay: at(0.2), ease: easeOutSpring }}
        >
          {renderEm(T04.headline)}
        </S.Headline>

        <S.Close
          initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: dur(0.5), delay: at(0.36), ease: easeOutSpring }}
        >
          <S.Cta
            type="button"
            onClick={onOpenSignUp}
            aria-haspopup="dialog"
            data-analytics-id="landing.final-cta.signup"
          >
            {CTA}
          </S.Cta>
          <S.Micro>{MICRO}</S.Micro>
          <S.Secondary
            as={Link}
            href="/pricing"
            data-analytics-id="landing.final-cta.pricing"
            onClick={() => analytics.track('landing_cta_clicked', { cta: 'final_cta_pricing' })}
          >
            {`${SECONDARY} →`}
          </S.Secondary>
        </S.Close>

        <S.Register
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: dur(0.45), delay: at(0.5) }}
        >
          {T04.clauses.map((clause) => (
            <S.Clause key={clause}>{clause}</S.Clause>
          ))}
        </S.Register>

        <S.Rule aria-hidden="true" {...rule(0.08)} />
      </S.Inner>
    </S.Wrap>
  );
};
