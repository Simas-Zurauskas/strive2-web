'use client';

import { Formik } from 'formik';
import { ChevronRight, Files } from 'lucide-react';
import { useRef } from 'react';
import { Button, Eyebrow, HelpAnchor } from '@/components';
import { goalInputSchema, GoalInputValues } from '@/validation';
import * as S from './GoalStep.styles';

const GOAL_MAX_LENGTH = 500;

// Below this length the helper text nudges for specificity. Production
// data: goals ≤60 chars produced a lesson in 39% of courses; >150 chars in
// 67% — vagueness at this step is the strongest single abandonment
// predictor we have. A nudge, never a gate: short goals still submit.
const GOAL_COACH_THRESHOLD = 60;

// Tappable starting points for a blank field — written in the shape we
// want goals to take (what + starting point + intent), so picking one
// teaches the pattern even if the user rewrites it.
const GOAL_EXAMPLES = [
  'Run Meta ads for my small online store — I know the basics of Instagram but have never paid for ads',
  'Learn Python for data analysis from scratch — I work in Excel all day and want to automate it',
] as const;

interface GoalStepProps {
  initialGoal: string;
  hasExistingData: boolean;
  loading: boolean;
  error: string;
  /** Show the "start from your documents" secondary entry (fresh wizards only). */
  showDocumentsEntry?: boolean;
  onSubmit: (goal: string) => void;
}

const initialValues: GoalInputValues = { goal: '' };

export const GoalStep = ({ initialGoal, hasExistingData, loading, error, showDocumentsEntry = false, onSubmit }: GoalStepProps) => {
  const lastGeneratedGoal = useRef(initialGoal);

  return (
    <S.Container>
      <S.Header>
        <Eyebrow>
          Learning Goal <HelpAnchor concept="wizard" size="sm" />
        </Eyebrow>
        <S.Title>What do you want to learn?</S.Title>
        <S.Subtitle>
          Describe your learning goal in your own words. We&apos;ll build a personalized course around it.
        </S.Subtitle>
      </S.Header>

      <Formik
        initialValues={initialGoal ? { goal: initialGoal } : initialValues}
        validationSchema={goalInputSchema}
        onSubmit={(values) => onSubmit(values.goal)}
        enableReinitialize
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors, touched, setFieldValue }) => {
          const goalUnchanged = hasExistingData && values.goal === lastGeneratedGoal.current;
          const trimmedLength = values.goal.trim().length;
          const showSpecificityNudge = trimmedLength > 0 && trimmedLength < GOAL_COACH_THRESHOLD;
          // Surface Formik validation error so the form never blocks submission
          // silently. The textarea also enforces `maxLength` natively, so this
          // path mainly catches edge cases (pasted long text trimmed by the
          // browser still triggers `onChange`, then Yup, with no visible cue).
          const validationError = touched.goal ? errors.goal : undefined;

          return (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <S.FormWrapper>
                <S.InputGroup>
                  <S.StyledTextarea
                    name="goal"
                    placeholder="e.g. Learn Python for data science, Understand machine learning fundamentals, Master watercolor painting..."
                    value={values.goal}
                    rows={2}
                    maxLength={GOAL_MAX_LENGTH}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                  />
                  {(validationError || error) && (
                    <S.ErrorText>{validationError ?? error}</S.ErrorText>
                  )}
                  {!values.goal && !hasExistingData && (
                    <S.ExampleChipRow aria-label="Example goals">
                      {GOAL_EXAMPLES.map((example) => (
                        <S.ExampleChip
                          key={example}
                          type="button"
                          onClick={() => setFieldValue('goal', example)}
                        >
                          {example.split(' — ')[0]}
                        </S.ExampleChip>
                      ))}
                    </S.ExampleChipRow>
                  )}
                </S.InputGroup>

                <S.SubmitRow>
                  <S.HelperText>
                    {showSpecificityNudge
                      ? 'Specific goals make sharper courses — add where you’re starting from and what you want to be able to do.'
                      : 'Be as specific or broad as you like. The more detail, the better the course fits you.'}
                  </S.HelperText>
                  <S.SubmitRowEnd>
                    {values.goal.length > GOAL_MAX_LENGTH * 0.9 && (
                      <S.CharCount $atLimit={values.goal.length >= GOAL_MAX_LENGTH}>
                        {values.goal.length}/{GOAL_MAX_LENGTH}
                      </S.CharCount>
                    )}
                    <Button type="submit" loading={loading} disabled={!values.goal.trim()}>
                      {goalUnchanged ? 'Continue' : 'Next \u2192'}
                    </Button>
                  </S.SubmitRowEnd>
                </S.SubmitRow>

                {showDocumentsEntry && (
                  <S.DocumentsEntryBlock>
                    <S.OrDivider aria-hidden>or</S.OrDivider>
                    <S.DocumentsEntryRow>
                      <S.DocumentsEntryCard href="/courses/new?source=documents">
                        <S.EntryIcon aria-hidden>
                          <Files />
                        </S.EntryIcon>
                        <S.EntryText>
                          <S.EntryTitle>Build from your own materials</S.EntryTitle>
                          <S.EntryDescription>
                            PDFs, slides, docs, audio, links — we turn them into a course
                          </S.EntryDescription>
                        </S.EntryText>
                        <S.EntryChevron aria-hidden>
                          <ChevronRight />
                        </S.EntryChevron>
                      </S.DocumentsEntryCard>
                      {/* Info affordance: opens the documents-mode concept modal. */}
                      <HelpAnchor concept="course-from-documents" size="sm" />
                    </S.DocumentsEntryRow>
                  </S.DocumentsEntryBlock>
                )}
              </S.FormWrapper>
            </form>
          );
        }}
      </Formik>
    </S.Container>
  );
};
