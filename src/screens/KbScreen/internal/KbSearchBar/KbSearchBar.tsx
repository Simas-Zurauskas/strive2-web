'use client';

import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import * as S from './KbSearchBar.styles';
import type { KbSearchEntry } from '@/lib/kb';

interface KbSearchBarProps {
  entries: KbSearchEntry[];
  placeholder?: string;
  autoFocus?: boolean;
}

export const KbSearchBar = ({
  entries,
  placeholder = 'Search the help center',
  autoFocus = false,
}: KbSearchBarProps) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = useId();

  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'summary', weight: 0.25 },
          { name: 'tags', weight: 0.15 },
          { name: 'excerpt', weight: 0.1 },
          { name: 'topicTitle', weight: 0.1 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        includeScore: true,
      }),
    [entries]
  );

  const trimmed = query.trim();
  const results = useMemo(() => {
    if (!trimmed) return [];
    return fuse
      .search(trimmed, { limit: 8 })
      .map((r) => r.item);
  }, [trimmed, fuse]);

  useEffect(() => {
    setActiveIndex(0); // eslint-disable-line react-hooks/set-state-in-effect -- reset selection on query change is the intent
  }, [trimmed]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navigateToResult = (href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[activeIndex];
      if (target) navigateToResult(target.href);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showResults = open && trimmed.length > 0;

  return (
    <S.Wrapper ref={wrapRef}>
      <S.InputRow>
        <S.SearchIcon aria-hidden="true">
          <Search size={18} />
        </S.SearchIcon>
        <S.InputEl
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showResults}
          aria-controls={listboxId}
          aria-autocomplete="list"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <S.ClearBtn type="button" onClick={() => setQuery('')} aria-label="Clear search">
            <X size={16} />
          </S.ClearBtn>
        )}
      </S.InputRow>
      {showResults && (
        <S.Results id={listboxId} role="listbox">
          {results.length === 0 ? (
            <S.ResultEmpty>
              No matching articles. Try a different keyword, or open the chat for a tailored answer.
            </S.ResultEmpty>
          ) : (
            results.map((r, idx) => (
              <S.ResultItem
                key={`${r.topic}/${r.slug}`}
                role="option"
                aria-selected={idx === activeIndex}
                $active={idx === activeIndex}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => navigateToResult(r.href)}
              >
                <S.ResultTitle>{r.title}</S.ResultTitle>
                <S.ResultMeta>{r.topicTitle}</S.ResultMeta>
              </S.ResultItem>
            ))
          )}
        </S.Results>
      )}
    </S.Wrapper>
  );
};
