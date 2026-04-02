'use client';

import * as S from './Stepper.styles';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  completedSteps?: number[];
  onStepClick?: (step: number) => void;
}

export const Stepper = ({ currentStep, totalSteps, labels, completedSteps = [], onStepClick }: StepperProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  const getState = (step: number): 'completed' | 'active' | 'future' => {
    if (step === currentStep) return 'active';
    if (completedSteps.includes(step)) return 'completed';
    if (step < currentStep) return 'completed';
    return 'future';
  };

  const isClickable = (step: number): boolean => {
    if (!onStepClick) return false;
    if (step === currentStep) return false;
    return completedSteps.includes(step);
  };

  const handleClick = (step: number) => {
    if (isClickable(step)) {
      onStepClick?.(step);
    }
  };

  return (
    <S.Wrapper>
      {steps.map((step, i) => {
        const state = getState(step);
        const clickable = isClickable(step);

        return (
          <S.Step key={step}>
            {i > 0 && <S.Connector $completed={state !== 'future'} />}
            <S.Circle $state={state} $clickable={clickable} onClick={() => handleClick(step)}>
              {state === 'completed' ? '✓' : step}
            </S.Circle>
            {labels?.[i] && (
              <S.Label $state={state} $clickable={clickable} onClick={() => handleClick(step)}>
                {labels[i]}
              </S.Label>
            )}
          </S.Step>
        );
      })}
    </S.Wrapper>
  );
};
