'use client';

import { easeOutSpring, useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
import { renderEm } from './emphasis';
import * as S from './R04Strip.styles';
import { R04 } from './variants';

/**
 * ROADMAP · VARIANT 04 — The Strip.
 *
 * The four steps as four stubs of one printed docket: perforated seams,
 * punched holes at every seam, an inset safety rule, the whole object set
 * half a degree off true and casting a shadow. The numerals are struck as
 * rotated seals rather than set as type.
 *
 * The object argues that the steps are parts of one thing. Four separate
 * bordered cards argue the opposite, which is why the shipped row reads as
 * a checklist rather than a path.
 *
 * MOTION. The docket is set down — it arrives tilted further than it lands
 * and settles — then the seals are struck onto it one after another with a
 * little rotational overshoot, and the seams appear last.
 *
 * REDUCED MOTION. The docket renders already at rest, at its final tilt,
 * with the seals struck and the seams printed; nothing moves and nothing
 * is missing. The tilt is a constant in both cases so the SSR markup and
 * the hydrated markup describe the same box.
 */
export const R04Strip = () => {
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
          <S.Eyebrow>{R04.eyebrow}</S.Eyebrow>
          <S.Headline>{renderEm(R04.headline)}</S.Headline>
          {/* The shipped subhead, carried verbatim with the heading — it is
              where "no catalogue to browse" lives, which is the section's
              actual differentiator and the stubs cannot say it as well. */}
          <S.Subhead>{R04.subhead}</S.Subhead>
        </S.Head>

        {/* ONE TRIGGER for the whole docket. The seals and seams used to
            carry their own whileInView, which anchored each one's cascade
            delay to its own viewport entry — invisible-then-pop on the
            phone stack, where the lower stubs enter one at a time
            (011-landing C1). They are variants under the Strip's single
            trigger now: the docket is set down once and stamped in order,
            wherever the visitor's scroll happens to be. */}
        <S.Strip
          initial="hidden"
          whileInView="shown"
          viewport={VIEWPORT_ONCE}
          variants={{
            hidden: {
              opacity: 0,
              y: prefersReduced ? 0 : 26,
              rotate: prefersReduced ? -0.6 : -2.4,
            },
            shown: {
              opacity: 1,
              y: 0,
              rotate: -0.6,
              transition: { duration: dur(0.62), delay: at(0.14), ease: easeOutSpring },
            },
          }}
        >
          {R04.stubs.map((stub, i) => (
            <S.Stub key={stub.n}>
              {i > 0 && (
                <S.Perf
                  aria-hidden="true"
                  variants={{
                    hidden: { opacity: 0 },
                    shown: {
                      opacity: 1,
                      transition: { duration: dur(0.35), delay: at(0.7 + i * 0.06) },
                    },
                  }}
                />
              )}
              <S.Stamp
                aria-hidden="true"
                variants={{
                  hidden: {
                    opacity: 0,
                    scale: prefersReduced ? 1 : 0.55,
                    rotate: prefersReduced ? -9 : -22,
                  },
                  shown: {
                    opacity: 1,
                    scale: 1,
                    rotate: -9,
                    transition: { duration: dur(0.45), delay: at(0.4 + i * 0.09), ease: easeOutSpring },
                  },
                }}
              >
                {stub.n}
              </S.Stamp>
              <S.Title>{stub.title}</S.Title>
              <S.Line>{stub.line}</S.Line>
            </S.Stub>
          ))}
        </S.Strip>
      </S.Inner>
    </S.Wrap>
  );
};
