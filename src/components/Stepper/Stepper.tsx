'use client';

import * as S from './Stepper.styles';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  completedSteps?: number[];
  navigableSteps?: number[];
  onStepClick?: (step: number) => void;
}

export const Stepper = ({ currentStep, totalSteps, labels, completedSteps = [], navigableSteps, onStepClick }: StepperProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const clickableSet = navigableSteps ?? completedSteps;

  const getState = (step: number): 'completed' | 'active' | 'navigable' | 'future' => {
    if (step === currentStep) return 'active';
    if (completedSteps.includes(step)) return 'completed';
    if (step < currentStep) return 'completed';
    if (clickableSet.includes(step)) return 'navigable';
    return 'future';
  };

  const isClickable = (step: number): boolean => {
    if (!onStepClick) return false;
    if (step === currentStep) return false;
    return clickableSet.includes(step);
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
