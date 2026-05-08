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
    <S.Wrapper role="list">
      {steps.map((step, i) => {
        const state = getState(step);
        const clickable = isClickable(step);
        const stepLabel = labels?.[i] ?? `Step ${step}`;
        const ariaLabel = `${stepLabel} (step ${step} of ${totalSteps})`;

        // When the step is clickable we render Circle + Label as a single
        // grouping <button> so keyboard users get one tab stop per step
        // with both the number badge and the textual label inside one
        // accessible name. Non-clickable steps stay as inert spans.
        if (clickable) {
          return (
            <S.Step key={step} role="listitem">
              {i > 0 && <S.Connector $completed={state !== 'future'} aria-hidden="true" />}
              <S.StepButton
                type="button"
                onClick={() => handleClick(step)}
                aria-label={ariaLabel}
                aria-current={state === 'active' ? 'step' : undefined}
              >
                <S.Circle as="span" $state={state} $clickable aria-hidden="true">
                  {state === 'completed' ? '✓' : step}
                </S.Circle>
                {labels?.[i] && (
                  <S.Label as="span" $state={state} $clickable aria-hidden="true">
                    {labels[i]}
                  </S.Label>
                )}
              </S.StepButton>
            </S.Step>
          );
        }

        return (
          <S.Step key={step} role="listitem" aria-current={state === 'active' ? 'step' : undefined}>
            {i > 0 && <S.Connector $completed={state !== 'future'} aria-hidden="true" />}
            <S.Circle as="span" $state={state} $clickable={false} aria-hidden="true">
              {state === 'completed' ? '✓' : step}
            </S.Circle>
            {labels?.[i] && (
              <S.Label as="span" $state={state} $clickable={false}>
                {labels[i]}
              </S.Label>
            )}
          </S.Step>
        );
      })}
    </S.Wrapper>
  );
};
