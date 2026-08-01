'use client';

import { ArrowRight } from 'lucide-react';
import { Fragment } from 'react';
import { clearPendingGoal, setPendingGoal } from '@/lib/pendingGoal';
import { easeOutSpring, useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
import * as S from './C04Wall.styles';
import { renderEm } from './emphasis';
import { C04, pendingGoalFor, TOPICS, type Topic } from './variants';

/**
 * COURSE EXAMPLES · VARIANT 04 — The Wall.
 *
 * Three ribbons of topics drifting past at different speeds in alternating
 * directions, set at display size in serif with a gold lozenge between
 * each. The message of this section is "there is a lot of this", and
 * continuous drift argues it in a way sixteen static tiles cannot.
 *
 * WHERE THE DRIFT STOPS. A moving click target is a bad click target. Under
 * `prefers-reduced-motion` and on touch devices the ribbons stop dead, the
 * duplicate run is removed, and the words wrap into a still typographic
 * block with every topic present and tappable. That is also the phone
 * design — a wrapped wall of words at 360px beats a marquee, and needs no
 * horizontal scrolling. All of that lives in CSS media queries, so the
 * React tree is the same in every case and hydration cannot shift it.
 *
 * The duplicated run is `aria-hidden` and made of spans, never buttons, so
 * the sixteen topics appear exactly once to a screen reader and exactly
 * once in the tab order.
 */

interface Props {
  onOpenSignUp: () => void;
}

/** Three uneven ribbons — an even 5/5/6 split would read as a table. */
const RIBBONS: { topics: Topic[]; size: string; seconds: number; right: boolean }[] = [
  { topics: TOPICS.slice(0, 6), size: 'clamp(1.5rem, 3.4vw, 2.75rem)', seconds: 54, right: false },
  { topics: TOPICS.slice(6, 11), size: 'clamp(1.125rem, 2.4vw, 1.875rem)', seconds: 66, right: true },
  { topics: TOPICS.slice(11), size: 'clamp(1.375rem, 3vw, 2.375rem)', seconds: 48, right: false },
];

export const C04Wall = ({ onOpenSignUp }: Props) => {
  const { prefersReduced } = useMotion();

  const at = (t: number) => (prefersReduced ? 0 : t);
  const dur = (t: number) => (prefersReduced ? 0.2 : t);

  const pick = (topic: Topic) => {
    setPendingGoal(pendingGoalFor(topic));
    onOpenSignUp();
  };

  // "Start from your own goal" promises a blank slate. Without the clear, a
  // topic clicked earlier (modal closed, mind changed) is still stashed, and
  // the wizard would prefill the abandoned example under a button that said
  // the opposite.
  const startFromOwnGoal = () => {
    clearPendingGoal();
    onOpenSignUp();
  };

  return (
    <S.Wrap>
      <S.Inner>
        <S.Measure>
          <S.Head
          initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: dur(0.5), ease: easeOutSpring }}
        >
            <S.Eyebrow>{C04.eyebrow}</S.Eyebrow>
            <S.Headline>{renderEm(C04.headline)}</S.Headline>
          </S.Head>
        </S.Measure>

        <S.Wall
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: dur(0.5), delay: at(0.12) }}
        >
          {RIBBONS.map((ribbon, r) => (
            <S.Ribbon key={r}>
              <S.Track $right={ribbon.right} $seconds={ribbon.seconds}>
                {/* Both runs must be structurally identical, separators
                    included — the loop's seamlessness is the Track being
                    exactly twice one run wide. */}
                {/* MARQUEE_COPIES identical runs. The seam sits at exactly
                    100/N percent of the track (see the styles header), so the
                    count here and the keyframe there must agree — hence the
                    shared constant rather than a literal in each file.
                    Run 0 is the canonical one: real buttons, in the tab order
                    and the a11y tree. The rest are aria-hidden duplicates,
                    still clickable so no visible word is a dead target. */}
                {Array.from({ length: S.MARQUEE_COPIES }, (_, run) => (
                  <S.Run
                    key={run}
                    $ghost={run > 0}
                    aria-hidden={run > 0 ? 'true' : undefined}
                  >
                    {ribbon.topics.map((topic) =>
                      run === 0 ? (
                        <Fragment key={topic.title}>
                          <S.Word
                            type="button"
                            aria-haspopup="dialog"
                            data-analytics-id="landing.course_examples.card"
                            $size={ribbon.size}
                            onClick={() => pick(topic)}
                          >
                            {topic.title}
                          </S.Word>
                          <S.Sep aria-hidden="true">◆</S.Sep>
                        </Fragment>
                      ) : (
                        <Fragment key={topic.title}>
                          <S.Ghost
                            type="button"
                            tabIndex={-1}
                            $size={ribbon.size}
                            onClick={() => pick(topic)}
                          >
                            {topic.title}
                          </S.Ghost>
                          <S.Sep>◆</S.Sep>
                        </Fragment>
                      ),
                    )}
                  </S.Run>
                ))}
              </S.Track>
            </S.Ribbon>
          ))}
        </S.Wall>

        <S.Measure>
          <S.Foot
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: dur(0.4), delay: at(0.3) }}
        >
          <S.Cta
            type="button"
            aria-haspopup="dialog"
            data-analytics-id="landing.course_examples.footnote_cta"
            onClick={startFromOwnGoal}
          >
            {C04.cta}
            <ArrowRight size={18} aria-hidden="true" />
            </S.Cta>
          </S.Foot>
        </S.Measure>
      </S.Inner>
    </S.Wrap>
  );
};
