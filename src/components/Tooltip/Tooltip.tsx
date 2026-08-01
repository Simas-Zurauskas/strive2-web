'use client';

import { useEffect, useId, useRef, useState } from 'react';
import * as S from './Tooltip.styles';
import type { ReactNode } from 'react';

interface TooltipProps {
  /** Bubble content — short text or a few stacked lines. */
  content: ReactNode;
  /**
   * Accessible name for the trigger button. The bubble itself is wired as
   * the trigger's description (`aria-describedby`), so the label should
   * say what the trigger is, not repeat the content.
   */
  label: string;
  /** Trigger content, usually an icon. */
  children: ReactNode;
  className?: string;
}

/**
 * Minimal shared tooltip. Reveal paths: hover (gated behind
 * `media.hover` so touch taps don't leave it stuck), keyboard focus, and
 * an explicit click/tap toggle for touch devices. Escape, outside
 * click/tap, and blur all dismiss. The bubble stays mounted so the
 * trigger's `aria-describedby` always resolves; it's hidden with
 * `visibility`, which also keeps it out of the accessibility tree while
 * closed.
 */
export const Tooltip = ({ content, label, children, className }: TooltipProps) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocPointerDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocPointerDown);
    document.addEventListener('touchstart', onDocPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocPointerDown);
      document.removeEventListener('touchstart', onDocPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <S.Wrap ref={wrapRef} className={className}>
      <S.Trigger
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={id}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </S.Trigger>
      <S.Bubble id={id} role="tooltip" $open={open}>
        {content}
      </S.Bubble>
    </S.Wrap>
  );
};
