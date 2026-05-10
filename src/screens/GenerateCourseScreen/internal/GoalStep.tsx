'use client';

import { Formik } from 'formik';
import { useRef } from 'react';
import { Button, Eyebrow, HelpAnchor } from '@/components';
import { goalInputSchema, GoalInputValues } from '@/validation';
import * as S from './GoalStep.styles';

interface GoalStepProps {
  initialGoal: string;
  hasExistingData: boolean;
  loading: boolean;
  error: string;
  onSubmit: (goal: string) => void;
}

const initialValues: GoalInputValues = { goal: '' };

export const GoalStep = ({ initialGoal, hasExistingData, loading, error, onSubmit }: GoalStepProps) => {
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
        {({ handleSubmit, handleChange, handleBlur, values }) => {
          const goalUnchanged = hasExistingData && values.goal === lastGeneratedGoal.current;

          return (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <S.FormWrapper>
                <S.InputGroup>
                  <S.StyledTextarea
                    name="goal"
                    placeholder="e.g. Learn Python for data science, Understand machine learning fundamentals, Master watercolor painting..."
                    value={values.goal}
                    rows={2}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                  />
                  {error && <S.ErrorText>{error}</S.ErrorText>}
                </S.InputGroup>

                <S.SubmitRow>
                  <S.HelperText>
                    Be as specific or broad as you like. The more detail, the better the course fits you.
                  </S.HelperText>
                  <Button type="submit" loading={loading} disabled={!values.goal.trim()}>
                    {goalUnchanged ? 'Continue' : 'Next \u2192'}
                  </Button>
                </S.SubmitRow>
              </S.FormWrapper>
            </form>
          );
        }}
      </Formik>
    </S.Container>
  );
};
