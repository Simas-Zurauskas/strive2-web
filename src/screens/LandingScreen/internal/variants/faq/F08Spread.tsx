'use client';

import { Fragment, useId, useState } from 'react';
import { easeOutSpring, useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
import { renderEm } from './emphasis';
import * as S from './F08Spread.styles';
import { F08 } from './variants';
import { FAQ } from '../../../constants';

/**
 * FAQ · VARIANT 08 — The Reading Spread.
 *
 * A reference spread. The nine questions are a register down the verso;
 * choosing one sets its gloss on the facing recto, the way a
 * dictionary pairs an entry with its note. The register is the
 * composition — the section is entirely scannable with nothing open.
 *
 * FIRST ENTRY PRE-OPENED (reversed 2026-08-01, 011-landing B3/Q5). The
 * spread originally started with `open: null` — nine questions, blank
 * recto — on the argument that a visitor should meet nine questions, not
 * one answer. In practice the blank leaf left the right half of the
 * desktop viewport (~700×500px) empty for the whole scroll, and the one
 * answer it hid was "Is this just a ChatGPT wrapper?" — the page's best
 * objection-handler. Signups outrank the conceit: entry 0 now starts on
 * the leaf, and choosing another entry replaces it exactly as before.
 * Toggling entry 0 closed still returns the recto to blank, so the blank
 * state remains reachable, just not the default.
 *
 * ONE AT A TIME, AND WHY. A facing page holds one gloss — that is a
 * property of the object, not a preference — so choosing an entry replaces
 * whatever was on the leaf, and choosing the open one again clears it back
 * to blank. There is no case for two glosses here: they would have to
 * stack down one column and the spread would stop being a spread. (Variant
 * 09, a sheet that can be unfolded at several creases at once, takes the
 * other side of this argument.)
 *
 * DISCLOSURE. Each entry is a `<button aria-expanded aria-controls>` and
 * each leaf a labelled `role="region"` — the same contract the shipped
 * `FaqSection` accordion uses, so behaviour is consistent with what ships
 * today. State reaches assistive tech through `aria-expanded`; the gold
 * tie-line and the weight change are sighted-reader redundancy, never the
 * only signal.
 *
 * MOTION. The head arrives once, the register staggers in behind it, and a
 * leaf opens on the house `grid-template-rows: 0fr → 1fr` clip with the
 * plate fading and settling 6px to the right — a page being laid down
 * rather than a drawer sliding. All of it is CSS transition, dropped whole
 * under `prefers-reduced-motion`, so the reduced form is instant with no
 * jump and the server HTML is identical either way.
 *
 * JSON-LD. All nine questions are visible without interaction and all nine
 * answers are in the server-rendered HTML — the closed leaves are clipped
 * to zero height, exactly as the shipped accordion's closed panels are,
 * and stay in the accessibility tree. Nothing is dropped or reworded, so
 * the FAQPage payload on the landing route stays exactly as true as the
 * control leaves it.
 */
export const F08Spread = () => {
  const { fadeUp, prefersReduced } = useMotion();
  const [open, setOpen] = useState<number | null>(0);
  const idBase = useId();

  const at = (t: number) => (prefersReduced ? 0 : t);
  const dur = (t: number) => (prefersReduced ? 0.2 : t);

  return (
    <S.Wrap>
      <S.Inner>
        <S.Head
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={VIEWPORT_ONCE}
          transition={fadeUp.transition}
        >
          <S.Eyebrow>{F08.eyebrow}</S.Eyebrow>
          <S.Headline>{renderEm(F08.headline)}</S.Headline>
        </S.Head>

        <S.HeadRule aria-hidden="true" />

        <S.Spread>
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            const entryId = `${idBase}-entry-${i}`;
            const leafId = `${idBase}-leaf-${i}`;

            return (
              // Fragment, not a wrapper: the entry and its leaf must be
              // siblings in the grid so CSS alone can set them side by side
              // on a spread and one under the other on a phone.
              <Fragment key={item.question}>
                <S.Entry
                  type="button"
                  id={entryId}
                  $active={isOpen}
                  aria-expanded={isOpen}
                  aria-controls={leafId}
                  onClick={() => setOpen((prev) => (prev === i ? null : i))}
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: dur(0.4), delay: at(i * 0.04), ease: easeOutSpring }}
                >
                  <S.EntryText $active={isOpen}>{item.question}</S.EntryText>
                </S.Entry>

                <S.Leaf id={leafId} role="region" aria-labelledby={entryId} $open={isOpen}>
                  <S.LeafClip>
                    <S.LeafInner $open={isOpen}>
                      <S.RunningHead>
                        <S.RunningLabel>{F08.runningHead}</S.RunningLabel>
                      </S.RunningHead>
                      <S.LeafTitle>{item.question}</S.LeafTitle>
                      <S.LeafBody>{item.answer}</S.LeafBody>
                    </S.LeafInner>
                  </S.LeafClip>
                </S.Leaf>
              </Fragment>
            );
          })}

          {open === null && <S.BlankLeaf aria-hidden="true">{F08.blankLeaf}</S.BlankLeaf>}
        </S.Spread>
      </S.Inner>
    </S.Wrap>
  );
};
