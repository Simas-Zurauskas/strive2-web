'use client';

import { easeOutSpring, useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
import { renderEm } from './emphasis';
import * as S from './G01Fingerpost.styles';
import { G01, REASONS } from './variants';

/**
 * GOAL TYPES · VARIANT 01 — The Fingerpost.
 *
 * "Pick yours" is a direction question, so the section is the object that
 * answers one: a crossroads post with four cut planks hanging off it,
 * alternating left and right at four heights, each carrying a reason and
 * the goal a learner would actually type.
 *
 * The verb phrase the shipped rows carry ("Go deep on a topic") is dropped
 * everywhere in this set — the real goal underneath it says the same thing
 * concretely, and two labels per plank is one too many for a sign.
 *
 * MOTION. The post is planted (it grows from the ground up), the finial
 * caps it, then each plank swings down into true on the pivot where it
 * meets the post. Rotation, not fade: an object being erected.
 *
 * ONE TRIGGER, NOT SIX. The cascade delays used to sit on each element's
 * own `whileInView`, which anchored every plank's delay to the moment THAT
 * plank entered the viewport — on a slow scroll each successive plank sat
 * on screen invisible for 0.34–0.61s before swinging in (measured ~550ms
 * of blank plate for plank 3; 011-landing C1). The whole erection sequence
 * now hangs off the Crossroads' single `whileInView` as variants, so the
 * cascade plays once, in order, from when the sign's ground enters —
 * planks further down settle before the visitor reaches them, which is
 * the correct failure mode (settled beats blank).
 *
 * REDUCED MOTION. Every plank renders at zero rotation and the post at
 * full height; the sign is simply already standing. The tree is identical
 * either way — only the `hidden` values a reduced visitor never sees
 * differ, and those are constants, not conditional elements.
 */
export const G01Fingerpost = () => {
  const { prefersReduced } = useMotion();

  const at = (t: number) => (prefersReduced ? 0 : t);
  const dur = (t: number) => (prefersReduced ? 0.2 : t);

  return (
    <S.Wrap>
      <S.Inner>
        <S.Head
          initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: dur(0.5), ease: easeOutSpring }}
        >
          <S.Eyebrow>{G01.eyebrow}</S.Eyebrow>
          <S.Headline>{renderEm(G01.headline)}</S.Headline>
          <S.Lede>{G01.lede}</S.Lede>
        </S.Head>

        <S.Crossroads initial="hidden" whileInView="shown" viewport={VIEWPORT_ONCE}>
          <S.Post
            aria-hidden="true"
            variants={{
              hidden: { opacity: 0, scaleY: prefersReduced ? 1 : 0 },
              shown: {
                opacity: 1,
                scaleY: 1,
                transition: { duration: dur(0.6), ease: easeOutSpring },
              },
            }}
          />
          <S.Finial
            aria-hidden="true"
            variants={{
              hidden: { opacity: 0, scale: prefersReduced ? 1 : 0.3, rotate: 45 },
              shown: {
                opacity: 1,
                scale: 1,
                rotate: 45,
                transition: { duration: dur(0.4), delay: at(0.3), ease: easeOutSpring },
              },
            }}
          />

          {REASONS.map((reason, index) => {
            const right = index % 2 === 1;
            const i = index as 0 | 1 | 2 | 3;
            return (
              <S.Arm
                key={reason.key}
                $i={i}
                $right={right}
                variants={{
                  hidden: {
                    opacity: 0,
                    rotate: prefersReduced ? 0 : right ? -7 : 7,
                  },
                  shown: {
                    opacity: 1,
                    rotate: 0,
                    transition: {
                      duration: dur(0.55),
                      delay: at(0.34 + index * 0.09),
                      ease: easeOutSpring,
                    },
                  },
                }}
              >
                <S.Bolts aria-hidden="true" $right={right} />
                <S.ArmBody>
                  <S.Label>{reason.label}</S.Label>
                  <S.Who>{reason.who}</S.Who>
                  <S.Bend>{reason.bend}</S.Bend>
                </S.ArmBody>
              </S.Arm>
            );
          })}
        </S.Crossroads>
      </S.Inner>
    </S.Wrap>
  );
};
