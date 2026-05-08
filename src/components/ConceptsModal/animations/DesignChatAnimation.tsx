'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { easeOutSpring, useMotion } from '@/theme/motionPresets';
import * as S from './DesignChatAnimation.styles';

// One vertical composition that shows the chat's full range — the
// instruction on the bottom drives a different effect on the outline
// above each cycle:
//
//   1) ADD     — `add a module on testing`        → new row inserts
//   2) REMOVE  — `skip the basics, I know them`   → first row drops
//   3) ASK     — `why this module order?`         → no edit; a short
//                                                    inline answer
//                                                    appears
//
// Phrasing intentionally mirrors the wizard's fallback suggested
// prompts so the demo reads as something you might actually type.

interface RowSpec {
  id: string;
  label: string;
  state?: 'new';
}

const BASE: ReadonlyArray<RowSpec> = [
  { id: 'f', label: 'Foundations' },
  { id: 'm', label: 'Mechanics' },
  { id: 'e', label: 'Edge cases' },
  { id: 'p', label: 'Practice' },
];

type ScenarioKind = 'add' | 'remove' | 'ask';

interface Scenario {
  kind: ScenarioKind;
  text: string;
  /** Inline answer shown only for `ask`. */
  answer?: string;
}

const SCENARIOS: ReadonlyArray<Scenario> = [
  { kind: 'add', text: 'add a module on testing' },
  { kind: 'remove', text: 'skip the basics, I know them' },
  { kind: 'ask', text: 'why this module order?', answer: 'easy → applied → review' },
];

const PHASES = ['typing', 'act', 'hold'] as const;
type Phase = (typeof PHASES)[number];

const TICK_MS = 1500;
const CYCLE_LEN = PHASES.length * SCENARIOS.length; // 9

const computeRows = (scenario: Scenario, phase: Phase): ReadonlyArray<RowSpec> => {
  if (phase === 'typing') return BASE;
  if (scenario.kind === 'add') {
    return [
      BASE[0],
      BASE[1],
      { id: 'add-testing', label: 'Testing', state: 'new' },
      BASE[2],
      BASE[3],
    ];
  }
  if (scenario.kind === 'remove') {
    return BASE.slice(1);
  }
  return BASE;
};

export const DesignChatAnimation = () => {
  const { prefersReduced } = useMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setTick((t) => (t + 1) % CYCLE_LEN), TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const scenario = SCENARIOS[Math.floor(tick / PHASES.length)];
  const phase: Phase = PHASES[tick % PHASES.length];

  const rows = computeRows(scenario, phase);
  const isActionPhase = phase === 'act' || phase === 'hold';
  const showAnswer = scenario.kind === 'ask' && isActionPhase;
  const showCheck = scenario.kind !== 'ask' && isActionPhase;

  // Re-key the typed text so the steps animation re-runs each time the
  // scenario changes (rather than only on mount).
  const scenarioKey = `s-${Math.floor(tick / PHASES.length)}`;

  return (
    <S.Wrap aria-hidden>
      <S.Outline>
        <AnimatePresence initial={false}>
          {rows.map((r, i) => (
            <motion.li
              key={r.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: easeOutSpring }}
              style={{ overflow: 'hidden', listStyle: 'none' }}
            >
              <S.Row $isNew={r.state === 'new'}>
                <S.RowNum $isNew={r.state === 'new'}>{i + 1}</S.RowNum>
                <S.RowLabel>{r.label}</S.RowLabel>
              </S.Row>
            </motion.li>
          ))}
        </AnimatePresence>
      </S.Outline>

      <S.InstructionStack>
        <S.Instruction $active>
          <S.InstructionText key={scenarioKey} $charCount={scenario.text.length}>
            {scenario.text}
          </S.InstructionText>
          {showCheck ? (
            <S.InstructionCheck>✓</S.InstructionCheck>
          ) : (
            <S.InstructionCaret />
          )}
        </S.Instruction>

        <AnimatePresence>
          {showAnswer && scenario.answer && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.24, ease: easeOutSpring }}
            >
              <S.Answer>
                <S.AnswerArrow>↳</S.AnswerArrow>
                <S.AnswerText>{scenario.answer}</S.AnswerText>
              </S.Answer>
            </motion.div>
          )}
        </AnimatePresence>
      </S.InstructionStack>
    </S.Wrap>
  );
};
