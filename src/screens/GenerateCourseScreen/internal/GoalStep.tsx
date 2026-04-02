'use client';

import { useRef } from 'react';
import { Formik } from 'formik';
import { Textarea, Button } from '@/components';
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
        <S.Title>What do you want to learn?</S.Title>
        <S.Subtitle>
          Describe your learning goal and we&apos;ll create a personalized curriculum just for you.
        </S.Subtitle>
      </S.Header>

      <Formik
        initialValues={initialGoal ? { goal: initialGoal } : initialValues}
        validationSchema={goalInputSchema}
        onSubmit={(values) => onSubmit(values.goal)}
        enableReinitialize
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => {
          const goalUnchanged = hasExistingData && values.goal === lastGeneratedGoal.current;

          return (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Textarea
                  name="goal"
                  placeholder="e.g. Learn Python for data science, Understand machine learning fundamentals, Master watercolor painting..."
                  value={values.goal}
                  rows={4}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.goal ? errors.goal : undefined}
                />

                {error && <p style={{ fontSize: '0.8125rem', color: 'var(--error)' }}>{error}</p>}

                <Button type="submit" loading={loading}>
                  {loading ? 'Analyzing your goal...' : goalUnchanged ? 'Continue' : 'Generate questions'}
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </S.Container>
  );
};
