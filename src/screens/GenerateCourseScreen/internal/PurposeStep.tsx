'use client';

import { useState } from 'react';
import { GoalType } from '@/api/types';
import { Badge, Button, Eyebrow, HelpAnchor } from '@/components';
import * as S from './PurposeStep.styles';

// Single source of truth for the wizard's per-type copy. `description` is
// the outcome statement (one short sentence). `tilt` is a one-line summary
// of how the curriculum actually changes for that goalType — kept short
// enough to fit on a single row at desktop, condensed from
// `GOAL_TYPE_STRUCTURE_GUIDANCE` in api/src/services/courseService.ts.
// If that server guidance shifts, refresh `tilt` to match — the user is
// reading this as a contract for what their course will look like.
const GOAL_TYPE_COPY: Record<
  GoalType,
  { label: string; description: string; tilt: string }
> = {
  master: {
    label: 'Master',
    description: 'Build deep, lasting understanding of a topic.',
    tilt: "Comprehensive ladder — foundations up unless you're past them.",
  },
  monetize: {
    label: 'Monetize',
    description: 'Turn a skill into income — clients, audience, or product.',
    tilt: 'Every module ends in a tactical action you can run that week.',
  },
  pass: {
    label: 'Pass',
    description: 'Pass an exam, certification, or interview.',
    tilt: 'Modules map to the exam syllabus; the final one is a timed mock.',
  },
  build: {
    label: 'Build',
    description: 'Ship something concrete by the end of the course.',
    tilt: 'Project spine — each module ships a testable checkpoint.',
  },
  fluency: {
    label: 'Fluency',
    description: 'Become conversational in a language.',
    tilt: 'Modules organised around real-world scenarios — conversation first.',
  },
};

const GOAL_TYPE_ORDER: GoalType[] = ['master', 'monetize', 'pass', 'build', 'fluency'];

interface PurposeStepProps {
  /** The user's submitted goal text — echoed back so they have context. */
  goal: string;
  /**
   * The AI classifier's recommendation. Drives the "Suggested for you"
   * pill and the initial selection. Should always be present when this
   * step renders (parent gates on clarifyData existence).
   */
  aiSuggestion: GoalType;
  /** Confirmed goalType on resume (may equal aiSuggestion or differ). */
  currentGoalType: GoalType;
  /** Whether downstream state (answers / depth / structure) exists — used
   *  by the parent's confirm dialog. We pass `isOverride` to the parent so
   *  it can decide. */
  loading: boolean;
  onConfirm: (selected: GoalType, isOverride: boolean) => void;
  onBack: () => void;
}

export const PurposeStep = ({
  goal,
  aiSuggestion,
  currentGoalType,
  loading,
  onConfirm,
  onBack,
}: PurposeStepProps) => {
  // Default to whatever's currently on the course (which equals the AI
  // suggestion on first arrival). Local state so the user can browse
  // cards without touching the server until they hit Next.
  const [selected, setSelected] = useState<GoalType>(currentGoalType);

  const handleNext = () => {
    const isOverride = selected !== currentGoalType;
    onConfirm(selected, isOverride);
  };

  const goalEchoText = goal.trim().length > 120 ? `${goal.trim().slice(0, 117)}…` : goal.trim();

  return (
    <S.Container>
      <S.Header>
        <Eyebrow>Purpose</Eyebrow>
        <S.Title>What&rsquo;s this course for?</S.Title>
        <S.Subtitle>
          Strive tunes the modules, lessons, and quizzes to what you&rsquo;ll do with the material.{' '}
          <HelpAnchor concept="goal-types" size="sm" />
        </S.Subtitle>
        {goalEchoText.length > 0 && (
          <S.GoalEcho>
            Your goal: <strong>{goalEchoText}</strong>
          </S.GoalEcho>
        )}
      </S.Header>

      <S.List role="radiogroup" aria-label="Course purpose">
        {GOAL_TYPE_ORDER.map((t) => {
          const isSelected = selected === t;
          const isSuggested = t === aiSuggestion;
          const copy = GOAL_TYPE_COPY[t];
          return (
            <S.Row
              key={t}
              type="button"
              role="radio"
              aria-checked={isSelected}
              $selected={isSelected}
              onClick={() => setSelected(t)}
              disabled={loading}
            >
              <S.RowHeader>
                <S.RowTitle>{copy.label}</S.RowTitle>
                {isSuggested && <Badge variant="gold">Recommended</Badge>}
              </S.RowHeader>
              <S.RowDescription>{copy.description}</S.RowDescription>
              <S.RowTilt>{copy.tilt}</S.RowTilt>
            </S.Row>
          );
        })}
      </S.List>

      <S.Actions>
        <Button variant="secondary" type="button" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button type="button" onClick={handleNext} disabled={loading}>
          {loading ? 'Working…' : 'Next →'}
        </Button>
      </S.Actions>
    </S.Container>
  );
};
