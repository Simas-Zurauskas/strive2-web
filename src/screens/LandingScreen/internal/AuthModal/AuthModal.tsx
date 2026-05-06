'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as S from './AuthModal.styles';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

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
  if (typeof document === 'undefined') return null;

  const titleId = 'auth-modal-title';

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

        <S.TabList role="tablist" aria-label="Authentication mode">
          <S.Tab
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            $active={mode === 'signup'}
            onClick={() => onModeChange('signup')}
            data-analytics-id="landing.modal.tab.signup"
          >
            Sign up
          </S.Tab>
          <S.Tab
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            $active={mode === 'signin'}
            onClick={() => onModeChange('signin')}
            data-analytics-id="landing.modal.tab.signin"
          >
            Sign in
          </S.Tab>
        </S.TabList>

        <S.FormArea>
          <S.FormSlot $active={mode === 'signup'} aria-hidden={mode !== 'signup'}>
            <SignUpForm redirect={redirect} onSwitchMode={onModeChange} />
          </S.FormSlot>
          <S.FormSlot $active={mode === 'signin'} aria-hidden={mode !== 'signin'}>
            <SignInForm redirect={redirect} onSwitchMode={onModeChange} />
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
        </S.FinePrint>
      </S.Dialog>
    </S.Backdrop>,
    document.body,
  );
};
