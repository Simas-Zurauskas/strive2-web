'use client';

import { MoreVertical } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, close]);

  return (
    <S.Wrapper ref={wrapperRef}>
      <S.Trigger onClick={() => setOpen((v) => !v)} aria-label="More actions">
        <MoreVertical size={16} />
      </S.Trigger>

      {open && (
        <S.Menu>
          {items.map((item) => (
            <S.MenuItem
              key={item.label}
              $variant={item.variant}
              onClick={() => {
                item.onClick();
                close();
              }}
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
