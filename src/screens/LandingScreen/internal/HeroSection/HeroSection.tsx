'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { analytics } from '@/lib/analytics';
import { setPendingGoal } from '@/lib/pendingGoal';
import { useMotion } from '@/theme/motionPresets';
import { CourseRoute } from './CourseRoute';
import * as S from './HeroSection.styles';
import { HERO } from '../../constants';

// Matches the wizard's GOAL_MAX_LENGTH (and lib/pendingGoal's cap) so a
// pasted essay can't exceed what the goal form will accept post-auth.
const GOAL_MAX_LENGTH = 500;

// ── Placeholder typewriter ───────────────────────────────────────────
// The examples used to hard-swap every 5.5s. They now delete back to the
// stem and type the next one out, one character at a time.
//
// 'e.g. ' is the part that never leaves. Deleting it too would leave the
// field blank between goals and the placeholder would read, for a beat, as
// text someone had entered and cleared; keeping it pinned says "example"
// for the whole cycle and gives the caret somewhere to sit at the trough.
const PLACEHOLDER_STEM = 'e.g. ';
const TYPE_MS = 45;
// Erasing is not information — it is text the visitor has already read being
// taken away — so the backspace run sweeps rather than plays back.
//
// 16 is a nominal figure, not the achieved one: measured on the page this
// lands at ~20ms per character, because a timeout plus a React render plus a
// paint cannot fit inside one 16.7ms frame. That makes ~20ms the floor for a
// one-character-per-tick erase, and asking for 8 or 10 here would buy
// nothing but discarded renders — the timers just coalesce onto the same
// frames. To go faster than a character per frame, raise DELETE_STEP; the
// interval has no room left in it.
const DELETE_MS = 16;
const DELETE_STEP = 1;
const HOLD_MS = 2500;
// A beat at the bare stem before the next goal starts, so the turnaround
// reads as a pause and not a bounce.
const TROUGH_MS = 400;
// Measured, not nominal: typing runs ~48ms/char and erasing ~20ms/char, so
// the erase reads as roughly 2.4× the typing speed — a 43-char goal types in
// 2.1s and comes off in 0.9s. Cycle for a ~39-char goal is ~1.9s typing +
// 2.5s hold + 0.8s erasing + 0.4s trough ≈ 5.6s, which is the 5.5s cadence
// the old hard-swap used. That figure is worth holding to: it was tuned
// around the route plate's ~1.3s redraw and the beat it needs afterwards to
// be read. The hold keeps its full 2.5s — a quicker erase should buy the
// next goal an earlier entrance, not cost this one its reading time.
const CARET_BLINK_MS = 530;
// A plain pipe. This was U+258C ▌ briefly: a half-block glyph, which fonts
// draw at the FULL line height, so at this font size it landed as a slab
// roughly 8×22px next to 17px text — far heavier than any real caret.
const CARET = '|';

type TypewriterPhase = 'typing' | 'deleting';

interface HeroSectionProps {
  onOpenSignUp: () => void;
}

export const HeroSection = ({ onOpenSignUp }: HeroSectionProps) => {
  const { fadeUp, prefersReduced } = useMotion();

  // The hero's core change: visitors state their goal BEFORE the signup
  // gate. The text is stashed client-side (lib/pendingGoal) and prefills
  // wizard step 1 after auth, so the auth modal interrupts momentum instead
  // of erasing it. Empty submits nudge rather than opening the modal —
  // opening a signup form on an empty goal would recreate the old gate.
  const [goalValue, setGoalValue] = useState('');
  const [showEmptyHint, setShowEmptyHint] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  // Seeded FULLY typed, with the caret off, so the first render — the one
  // the server emits — is the complete first example and nothing else. Two
  // reasons. The placeholder is the field's only instruction, and shipping
  // SSR HTML that reads 'e.g. ' until the bundle lands is a worse first
  // paint than the one this replaced. And the server cannot know the
  // visitor's motion preference: if the initial text depended on it, the
  // reduced-motion render would disagree with the server's, React would
  // decline to patch the attribute, and the placeholder would be stuck at
  // whatever the server guessed. Identical under both preferences, it
  // can't. The machine picks this up in 'typing' already at full length, so
  // it holds, erases and carries on from there.
  const [typedLen, setTypedLen] = useState(HERO.goalRotations[0].length);
  const [phase, setPhase] = useState<TypewriterPhase>('typing');
  const [caretOn, setCaretOn] = useState(false);
  const [inputEngaged, setInputEngaged] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const activeGoal = HERO.goalRotations[placeholderIdx];
  // Paused when the hero itself is off-screen: the machine is a timeout +
  // React render + reconciliation every 16–45ms, and it was running for as
  // long as a visitor read the FAQ six screens down (011-landing C2). The
  // route plate re-charted along with it. `useInView` is false on the
  // server and on the first client render, so the SSR markup (the seeded,
  // caret-free placeholder) is untouched; the observer flips it true and
  // the machine picks up from the seeded state exactly as it does today.
  const wrapRef = useRef<HTMLElement | null>(null);
  const heroInView = useInView(wrapRef, { amount: 0.15 });
  // Paused the moment the visitor focuses or types — a placeholder moving
  // under a caret is hostile, and it would take the route plate with it.
  const typewriterPaused = inputEngaged || prefersReduced || !heroInView;

  // One timer at a time, always scheduled from the state it advances, so
  // the machine is re-entrant: any change to `typewriterPaused` tears down
  // the pending step through the cleanup rather than racing it. Every
  // transition fires from inside a timer callback — none from the effect
  // body — which is what keeps this out of the cascading-render trap.
  useEffect(() => {
    if (typewriterPaused) return;

    if (phase === 'typing') {
      if (typedLen < activeGoal.length) {
        const t = setTimeout(() => setTypedLen((n) => n + 1), TYPE_MS);
        return () => clearTimeout(t);
      }
      // Fully typed: sit on the finished example, then start erasing.
      const t = setTimeout(() => setPhase('deleting'), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (typedLen > 0) {
      const t = setTimeout(() => setTypedLen((n) => Math.max(0, n - DELETE_STEP)), DELETE_MS);
      return () => clearTimeout(t);
    }
    // Back at the bare stem — this is the moment the goal actually changes,
    // so the route plate re-charts against an empty field rather than
    // swapping its labels under a half-typed goal it no longer matches.
    const t = setTimeout(() => {
      setPlaceholderIdx((i) => (i + 1) % HERO.goalRotations.length);
      setPhase('typing');
    }, TROUGH_MS);
    return () => clearTimeout(t);
  }, [typewriterPaused, phase, typedLen, activeGoal.length]);

  useEffect(() => {
    if (typewriterPaused) return;
    const blink = setInterval(() => setCaretOn((on) => !on), CARET_BLINK_MS);
    return () => clearInterval(blink);
  }, [typewriterPaused]);

  // No reduced-motion branch needed: under it neither effect ever runs, so
  // the seeded state stands and this reads out the whole first example on
  // its own. The caret is hidden whenever the machine is stopped — a bar
  // parked in a field that isn't animating just looks like a stuck cursor.
  const placeholder = `${PLACEHOLDER_STEM}${activeGoal.slice(0, typedLen)}${
    !typewriterPaused && caretOn ? CARET : ''
  }`;

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = goalValue.trim();
    if (!trimmed) {
      setShowEmptyHint(true);
      inputRef.current?.focus();
      return;
    }
    setPendingGoal(trimmed);
    // Length only — never the goal text itself (free text stays out of
    // analytics; the stored goal reaches the API as normal wizard input).
    analytics.track('landing_goal_submitted', { length: trimmed.length });
    onOpenSignUp();
  };

  // `initial: false` — the hero is the LCP element and must be visible in
  // the SSR HTML. The previous mount-stagger serialised `opacity: 0` into
  // the server payload, so slow-network visitors stared at a blank page
  // until the JS bundle hydrated. The hero now paints instantly and the
  // entrance animation is retired for this section only; below-fold
  // sections keep theirs via whileInView.
  const stagger = (_i: number) => ({
    initial: false as const,
    animate: fadeUp.animate,
  });

  return (
    <S.Wrap ref={wrapRef}>
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
            <S.GoalForm onSubmit={handleGoalSubmit}>
              <S.GoalInput
                ref={inputRef}
                value={goalValue}
                rows={2}
                maxLength={GOAL_MAX_LENGTH}
                placeholder={placeholder}
                aria-label="What do you want to learn?"
                onFocus={() => {
                  setInputEngaged(true);
                  // Freeze on the WHOLE example, not the fragment that
                  // happened to be on screen — "e.g. Learn Spani" behind a
                  // live caret reads as a bug. Landing on 'typing' with the
                  // goal complete also means a blur resumes at the hold and
                  // carries on into the erase, rather than restarting.
                  setTypedLen(activeGoal.length);
                  setPhase('typing');
                }}
                onBlur={() => setInputEngaged(goalValue.length > 0)}
                onChange={(e) => {
                  setGoalValue(e.target.value);
                  if (showEmptyHint && e.target.value.trim()) setShowEmptyHint(false);
                }}
                onKeyDown={(e) => {
                  // Enter submits (it's a one-sentence field); Shift+Enter
                  // keeps the newline for people writing two sentences.
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              {showEmptyHint && <S.GoalHint role="status">{HERO.goalEmptyHint}</S.GoalHint>}
              <S.PrimaryCta
                type="submit"
                aria-haspopup="dialog"
                data-analytics-id="landing.hero.cta.signup"
              >
                {HERO.ctaPrimary}
                <ArrowRight size={18} aria-hidden="true" />
              </S.PrimaryCta>
            </S.GoalForm>
            <S.Microcopy>{HERO.ctaMicrocopy}</S.Microcopy>
            {/* The "See how it works ↓" secondary CTA is gone: the section it
                scrolled to was dropped from the page, and rather than point it
                somewhere else the hero now carries a single action. One door,
                not two. `HERO.ctaSecondary` stays in constants — it is still
                the sanctioned string if the affordance ever returns. */}
          </S.CtaRow>
        </S.CopyCol>

        <S.VisualCol initial={false} animate={{ opacity: 1, y: 0 }}>
          {/* Route labels track the input's rotating placeholder goal. */}
          <CourseRoute activeIdx={placeholderIdx} />
        </S.VisualCol>
      </S.Inner>
    </S.Wrap>
  );
};
