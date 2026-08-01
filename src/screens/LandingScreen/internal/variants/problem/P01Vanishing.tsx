'use client';

import { easeOutSpring, useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
import { renderEm } from './emphasis';
import * as S from './P01Vanishing.styles';
import { MECHANISM, P01, RETURNS } from './variants';

/**
 * PROBLEM · VARIANT 01 — The Vanishing Sentence.
 *
 * The sentence is laid along a three-week ruler and the ink gives out as it
 * crosses it. Nothing else is on the plate: no quote mark, no body
 * paragraph, no card. The claim and the picture of the claim are the same
 * object, which is the one thing a centred pull-quote cannot do.
 *
 * MOTION runs *backwards* compared to the rest of the page. Every word
 * enters at full strength and then fades to its resting opacity, left to
 * right, so the reader watches the sentence happen to itself. That also
 * makes the composition SSR-safe by construction: `initial` is
 * `opacity: 1`, so the server HTML carries a fully legible sentence and
 * nothing is ever serialised at `opacity: 0`.
 *
 * REDUCED MOTION. Delays collapse to zero and the durations to a blink, so
 * the plate simply renders in its resting state — the decayed sentence, the
 * full ruler, the closer. The picture is complete; only the act of fading
 * is lost.
 */
export const P01Vanishing = () => {
  const { prefersReduced } = useMotion();
  const at = (t: number) => (prefersReduced ? 0 : t);
  const dur = (t: number) => (prefersReduced ? 0.2 : t);

  return (
    <S.Wrap>
      <S.Inner>
        <S.Sentence>
          {P01.words.map((word, i) => (
            <S.Word
              key={`${word.t}-${i}`}
              $em={'em' in word ? word.em : undefined}
              initial={{ opacity: 1 }}
              whileInView={{ opacity: word.dim }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: dur(0.7), delay: at(0.35 + i * 0.075), ease: 'easeOut' }}
            >
              {word.t}
            </S.Word>
          ))}
        </S.Sentence>

        <S.Ruler aria-hidden="true">
          <S.RulerLine
            initial={{ opacity: 0, scaleX: prefersReduced ? 1 : 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: dur(0.9), ease: easeOutSpring }}
          />
          {P01.ticks.map((tick, i) => (
            <S.Tick
              key={tick}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: dur(0.4), delay: at(0.2 + i * 0.12) }}
            >
              {tick}
            </S.Tick>
          ))}

          {/* The answer drawn on the same measure as the problem: gold pins
              where the recall cards return. They land AFTER the decay has
              played (delay 1.5+) — the reader watches the sentence fade,
              then watches the returns arrive to stop it. Day 30 sits past
              the ruler's edge, drawn at the rail with an off-scale arrow. */}
          {/* Opacity-only on purpose: the pin centres itself with a CSS
              translateX(-50%), and framer would replace the whole transform
              if it animated y — the same trap X05's CentreSlot documents. */}
          {RETURNS.map((r, i) => (
            <S.Return
              key={r.day}
              style={{ left: `${r.pct}%` }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: dur(0.35), delay: at(1.5 + i * 0.14), ease: easeOutSpring }}
            >
              {r.day}
            </S.Return>
          ))}
          <S.ReturnEdge
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: dur(0.35), delay: at(1.5 + RETURNS.length * 0.14) }}
          >
            30 →
          </S.ReturnEdge>
        </S.Ruler>

        <S.Mechanism
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: dur(0.5), delay: at(1.35) }}
        >
          {/* The ladder is the one sanctioned number in this section, so it
              is the one thing lifted into gold — split on it rather than
              storing the sentence twice, keeping the copy single-source. */}
          {MECHANISM.split('1, 3, 7, 14 and 30 days')[0]}
          <strong>1, 3, 7, 14 and 30 days</strong>
          {MECHANISM.split('1, 3, 7, 14 and 30 days')[1]}
        </S.Mechanism>

        <S.Closer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: dur(0.5), delay: at(1.1) }}
        >
          {renderEm(P01.closer)}
        </S.Closer>
      </S.Inner>
    </S.Wrap>
  );
};
