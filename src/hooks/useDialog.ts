'use client';

import { useEffect, useRef, RefObject } from 'react';
import { useScrollLock } from './useScrollLock';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

interface UseDialogOptions {
  /** Whether the dialog is open. The hook is a no-op when false. */
  open: boolean;
  /** Called when Escape is pressed inside the dialog. */
  onClose: () => void;
  /**
   * Disable the focus trap (just keep scroll lock + escape + return-focus).
   * Most dialogs want the trap; passive variants (eg a notification panel
   * that's modal-shaped but lets background tab through) can opt out.
   */
  disableFocusTrap?: boolean;
}

/**
 * Consolidates the four behaviours every modal needs:
 *   - Body-scroll lock (capture + restore — never clobber an outer modal's lock)
 *   - Tab focus trap (Shift+Tab cycles backward, Tab cycles forward)
 *   - Escape closes
 *   - Return focus to the previously focused element on unmount
 *
 * Apply by attaching the returned `dialogRef` to the dialog element. The
 * caller is still responsible for `role="dialog"` + `aria-modal="true"`
 * + `aria-labelledby`/`aria-label` (semantics aren't behavioural).
 *
 * Extracted from AuthModal's per-component implementation. Centralising it
 * means new modals get the focus trap for free; legacy modals get the
 * scroll-lock prev-overflow capture-and-restore (closes M10's clobber
 * regression) when they migrate.
 */
export const useDialog = <T extends HTMLElement = HTMLDivElement>(
  options: UseDialogOptions,
): RefObject<T | null> => {
  const { open, onClose, disableFocusTrap = false } = options;
  const dialogRef = useRef<T | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Scroll lock is delegated to useScrollLock. The previous implementation
  // here (`document.body.style.overflow = 'hidden'`) was measured to be a
  // no-op in this app — `html { overflow-x: clip }` in GlobalStyles suppresses
  // the body→viewport overflow propagation it relied on, so every modal let
  // the page scroll behind it. See useScrollLock for the experiment.
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Defer focus by one frame so the dialog's children have mounted (an
    // inactive slot rendered display:none yields no focusable nodes; a
    // non-deferred query would whiff and leave focus on the trigger).
    const focusFirst = (): void => {
      const root = dialogRef.current;
      if (!root) return;
      const first = root.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    };
    const raf = window.requestAnimationFrame(focusFirst);

    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (disableFocusTrap || e.key !== 'Tab') return;

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
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose, disableFocusTrap]);

  return dialogRef;
};
