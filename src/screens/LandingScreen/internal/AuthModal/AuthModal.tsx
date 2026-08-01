'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { peekPendingGoal } from '@/lib/pendingGoal';
import * as S from './AuthModal.styles';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

// Keep the goal-context line to one visual line — the stored goal itself is
// untouched (up to 500 chars); this is display truncation only.
const GOAL_PREVIEW_MAX = 80;

export type AuthMode = 'signin' | 'signup';

interface AuthModalProps {
  open: boolean;
  mode: AuthMode;
  redirect: string;
  onClose: () => void;
  onModeChange: (next: AuthMode) => void;
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const AuthModal = ({ open, mode, redirect, onClose, onModeChange }: AuthModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Body scroll lock + focus trap + escape handler — consolidated so they
  // all enter and leave together when `open` flips.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the first input. Defer one frame so the slot has
    // mounted (the inactive slot is display:none and would yield no
    // focusable nodes).
    const focusFirst = () => {
      const root = dialogRef.current;
      if (!root) return;
      const first = root.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    };
    const raf = window.requestAnimationFrame(focusFirst);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const root = dialogRef.current;
      if (!root) return;
      const focusable = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);

    return () => {
      window.cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  // Read at render, not in state: the modal re-renders on every open, and
  // the stash may have been written by whichever CTA just opened it. Plain
  // text rendering — React escapes it; no markup path exists for the value.
  const pendingGoal = peekPendingGoal();
  if (typeof document === 'undefined') return null;

  const titleId = 'auth-modal-title';
  const signupTabId = 'auth-modal-tab-signup';
  const signinTabId = 'auth-modal-tab-signin';
  const signupPanelId = 'auth-modal-panel-signup';
  const signinPanelId = 'auth-modal-panel-signin';

  // Roving-tabindex + arrow-key navigation across the two tabs (WAI-ARIA
  // tab pattern). Left/Right cycle modes; Home/End jump to first/last.
  const onTabListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      onModeChange(mode === 'signup' ? 'signin' : 'signup');
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      onModeChange(mode === 'signup' ? 'signin' : 'signup');
    } else if (e.key === 'Home') {
      e.preventDefault();
      onModeChange('signup');
    } else if (e.key === 'End') {
      e.preventDefault();
      onModeChange('signin');
    }
  };

  return createPortal(
    <S.Backdrop
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <S.Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <S.Header>
          <S.Wordmark id={titleId}>{mode === 'signup' ? 'Create your account' : 'Sign in'}</S.Wordmark>
          <S.CloseButton type="button" aria-label="Close" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </S.CloseButton>
        </S.Header>

        {pendingGoal && (
          <S.GoalContext>
            We’ll start your course on{' '}
            <em>
              “{pendingGoal.length > GOAL_PREVIEW_MAX
                ? `${pendingGoal.slice(0, GOAL_PREVIEW_MAX).trimEnd()}…`
                : pendingGoal}”
            </em>{' '}
            right after you sign in.
          </S.GoalContext>
        )}

        <S.TabList role="tablist" aria-label="Authentication mode" onKeyDown={onTabListKeyDown}>
          <S.Tab
            id={signupTabId}
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            aria-controls={signupPanelId}
            tabIndex={mode === 'signup' ? 0 : -1}
            $active={mode === 'signup'}
            onClick={() => onModeChange('signup')}
            data-analytics-id="landing.modal.tab.signup"
          >
            Sign up
          </S.Tab>
          <S.Tab
            id={signinTabId}
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            aria-controls={signinPanelId}
            tabIndex={mode === 'signin' ? 0 : -1}
            $active={mode === 'signin'}
            onClick={() => onModeChange('signin')}
            data-analytics-id="landing.modal.tab.signin"
          >
            Sign in
          </S.Tab>
        </S.TabList>

        <S.FormArea>
          <S.FormSlot
            id={signupPanelId}
            role="tabpanel"
            aria-labelledby={signupTabId}
            $active={mode === 'signup'}
            hidden={mode !== 'signup'}
          >
            {mode === 'signup' && <SignUpForm redirect={redirect} onSwitchMode={onModeChange} />}
          </S.FormSlot>
          <S.FormSlot
            id={signinPanelId}
            role="tabpanel"
            aria-labelledby={signinTabId}
            $active={mode === 'signin'}
            hidden={mode !== 'signin'}
          >
            {mode === 'signin' && <SignInForm redirect={redirect} onSwitchMode={onModeChange} />}
          </S.FormSlot>
        </S.FormArea>

        <S.FinePrint>
          By continuing, you agree to our{' '}
          <Link href="/terms" target="_blank" rel="noopener noreferrer">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>
          .
          {/* At-collection notice, sign-up only. Deliberately a statement,
              NOT a checkbox: a pre-ticked box is not consent, and an
              unticked one collects a decision we are not relying on. The
              basis is soft opt-in, so what the law wants at this moment is
              that the person is *told*, plainly, before they hand over the
              address — and that opting out is easy, which the unsubscribe
              link and the profile toggle both are. Shown on the sign-up
              tab only, because that is the collection point; on sign-in
              there is nothing being collected. */}
          {mode === 'signup' && (
            <>
              {' '}
              We&rsquo;ll occasionally email you product updates. You can opt out any time.
            </>
          )}
        </S.FinePrint>
      </S.Dialog>
    </S.Backdrop>,
    document.body,
  );
};
