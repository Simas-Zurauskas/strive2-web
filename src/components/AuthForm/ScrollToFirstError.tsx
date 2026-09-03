'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface ScrollToFirstErrorProps {
  /** The <form> to search. Nothing happens until the ref is attached. */
  formRef: RefObject<HTMLFormElement | null>;
  /** Formik's submitCount. Each increment triggers exactly one scroll. */
  submitCount: number;
}

/** Input renders aria-invalid="true" on the field and role="alert" on the
 *  message; AuthFormError is role="alert". Document order therefore gives the
 *  topmost failing thing, whichever kind it is. */
const ERROR_SELECTOR = '[aria-invalid="true"], [role="alert"]';

/**
 * Renders nothing. After each submit attempt, brings the first validation
 * error into view.
 *
 * Why: measured at 375x667, submitting the sign-up form empty pushes the
 * submit button 212px DOWN (495 -> 707) as the error rows render — out from
 * under the finger — and the blocking terms error lands at 649-691, invisible,
 * with the dialog's own scrollTop still 0. The user sees the button move away
 * and nothing else, so a form that is merely invalid reads as broken.
 *
 * `block: 'center'` rather than `'start'`: the modal's sticky header would
 * otherwise cover a start-aligned error.
 *
 * Deferred two frames because Formik bumps submitCount before the error nodes
 * are committed and laid out — the first frame covers the commit, the second
 * lets the password-rules slot finish its grid-template-rows transition so the
 * measured offset is the final one.
 */
export const ScrollToFirstError = ({ formRef, submitCount }: ScrollToFirstErrorProps) => {
  const lastHandled = useRef(0);

  useEffect(() => {
    if (submitCount === 0 || submitCount === lastHandled.current) return;
    lastHandled.current = submitCount;

    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => {
        const form = formRef.current;
        if (!form) return;
        const target =
          form.querySelector<HTMLElement>(ERROR_SELECTOR) ??
          form.querySelector<HTMLElement>('button[type="submit"]');
        if (!target) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      });
    });

    return () => {
      window.cancelAnimationFrame(outer);
      if (inner) window.cancelAnimationFrame(inner);
    };
  }, [submitCount, formRef]);

  return null;
};
