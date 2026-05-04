'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import * as S from './VoiceSelect.styles';
import type { NarrationVoice } from '@/api/types';

export interface VoiceOption {
  /** Empty string = "system default" sentinel. */
  id: string;
  label: string;
  description: string;
  /** Hidden from the trigger; shown as small meta in the dropdown row. */
  meta?: string;
}

/** Build the option set used by VoiceSelect. The first item is always the
 *  "system default" sentinel — represented server-side as `narrationVoice = ''`. */
export const buildVoiceOptions = (voices: NarrationVoice[] | undefined): VoiceOption[] => [
  {
    id: '',
    label: 'System default',
    description: 'Whatever we recommend. Updates as we add new voices.',
  },
  ...(voices ?? []).map((v) => ({
    id: v.id,
    label: v.label,
    description: v.description,
    meta: v.gender !== 'neutral' ? `${capitalize(v.gender)} · ${v.locale}` : v.locale,
  })),
];

const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

interface VoiceSelectProps {
  value: string;
  options: VoiceOption[];
  onChange: (id: string) => void;
  disabled?: boolean;
  /** Pending voice id while a mutation is in flight — animated indicator. */
  pendingId?: string | null;
}

export const VoiceSelect = ({
  value,
  options,
  onChange,
  disabled,
  pendingId,
}: VoiceSelectProps) => {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(() => {
    const i = options.findIndex((o) => o.id === value);
    return i >= 0 ? i : 0;
  });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const selected = options.find((o) => o.id === value) ?? options[0];

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) close();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, close]);

  // Sync the active index with the currently-selected value when the panel
  // opens — arrow keys then start from the highlighted row. Focus the list
  // so keyboard users can drive it immediately.
  useEffect(() => {
    if (!open) return;
    const i = options.findIndex((o) => o.id === value);
    if (i >= 0) setActiveIdx(i); // eslint-disable-line react-hooks/set-state-in-effect -- one-shot sync on panel open
    requestAnimationFrame(() => {
      listRef.current?.focus({ preventScroll: true });
      const node = listRef.current?.querySelector<HTMLLIElement>(`[data-active="true"]`);
      node?.scrollIntoView({ block: 'nearest' });
    });
  }, [open, options, value]);

  const handleListKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIdx(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIdx(options.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const opt = options[activeIdx];
      if (opt) {
        onChange(opt.id);
        close();
        triggerRef.current?.focus();
      }
    }
  };

  return (
    <S.Wrapper ref={wrapperRef}>
      <S.Trigger
        ref={triggerRef}
        type="button"
        $open={open}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((v) => !v)}
      >
        <S.TriggerText>
          <S.TriggerLabel>{selected.label}</S.TriggerLabel>
          <S.TriggerSub>{selected.description}</S.TriggerSub>
        </S.TriggerText>
        <S.Chevron $open={open} aria-hidden>
          <ChevronDown size={16} strokeWidth={1.75} />
        </S.Chevron>
      </S.Trigger>

      {open && (
        <S.Panel role="listbox" id={listboxId}>
          <S.OptionList ref={listRef} tabIndex={-1} onKeyDown={handleListKey}>
            {options.map((opt, i) => {
              const isSelected = opt.id === value;
              const isActive = i === activeIdx;
              const isPending = pendingId === opt.id;
              return (
                <S.Option
                  key={opt.id || '__default__'}
                  role="option"
                  aria-selected={isSelected}
                  data-active={isActive ? 'true' : undefined}
                  $active={isActive}
                  $selected={isSelected}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => {
                    onChange(opt.id);
                    close();
                    triggerRef.current?.focus();
                  }}
                >
                  <S.OptionMain>
                    <S.OptionLabel>{opt.label}</S.OptionLabel>
                    <S.OptionDescription>{opt.description}</S.OptionDescription>
                    {opt.meta && <S.OptionMeta>{opt.meta}</S.OptionMeta>}
                  </S.OptionMain>
                  {isPending ? (
                    <S.PendingDot aria-hidden />
                  ) : isSelected ? (
                    <S.Tick aria-hidden>
                      <Check size={13} strokeWidth={3} />
                    </S.Tick>
                  ) : null}
                </S.Option>
              );
            })}
          </S.OptionList>
        </S.Panel>
      )}
    </S.Wrapper>
  );
};
