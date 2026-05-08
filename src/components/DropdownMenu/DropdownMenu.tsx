'use client';

import { MoreVertical } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import * as S from './DropdownMenu.styles';

export interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  onClick: () => void;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
}

export const DropdownMenu = ({ items }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  // Focused item index — controls roving-tabindex inside the menu. -1
  // means "menu just opened, focus the first item on next paint".
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    setActiveIndex(-1);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Outside-click and Escape — close without focus restore on outside
  // click (the user is engaging elsewhere) but with restore on Escape
  // (keyboard interaction).
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close(true);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, close]);

  // Focus the requested item whenever activeIndex changes while the menu
  // is open.
  useEffect(() => {
    if (!open) return;
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [open, activeIndex]);

  const openMenu = (initialIndex: number) => {
    setOpen(true);
    setActiveIndex(initialIndex);
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMenu(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      openMenu(items.length - 1);
    }
  };

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(items.length - 1);
    } else if (e.key === 'Tab') {
      // Tab closes the menu and lets focus continue past the trigger
      // (the spec-compliant menu pattern).
      close(false);
    }
  };

  const handleSelect = (item: DropdownMenuItem) => {
    item.onClick();
    close(true);
  };

  return (
    <S.Wrapper ref={wrapperRef}>
      <S.Trigger
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close(true) : openMenu(0))}
        onKeyDown={onTriggerKeyDown}
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
      >
        <MoreVertical size={16} aria-hidden="true" />
      </S.Trigger>

      {open && (
        <S.Menu id={menuId} role="menu" onKeyDown={onMenuKeyDown}>
          {items.map((item, i) => (
            <S.MenuItem
              key={item.label}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              role="menuitem"
              tabIndex={i === activeIndex ? 0 : -1}
              $variant={item.variant}
              onClick={() => handleSelect(item)}
            >
              {item.icon}
              {item.label}
            </S.MenuItem>
          ))}
        </S.Menu>
      )}
    </S.Wrapper>
  );
};
