'use client';

import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import * as S from './KbSearchBar.styles';
import type { KbSearchEntry } from '@/lib/kb';

/* Desktop ceiling — mirrors the `max-height` in KbSearchBar.styles.ts. */
const MAX_PANEL_HEIGHT = 380;
/* One ResultItem (~55px) plus the list's own 0.5rem padding. Deliberately NOT
   a two-row floor: at the measured 320x568 the space below the field is 104px,
   so anything above that would clamp the panel back past the fold and defeat
   its own purpose. */
const MIN_PANEL_HEIGHT = 72;

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

  // Declared here rather than beside the JSX because the panel-sizing effect
  // below depends on it.
  const showResults = open && trimmed.length > 0;

  // Flag the open dropdown on <html> so the guide FAB can stand down.
  // The FAB (KbChatPanel Root, z-index 60) paints over this listbox
  // (z-index 20, deliberately under the sticky header) and was PROVEN to
  // steal its taps: on a 375pt device, tapping the second search result
  // opened the guide chat instead of the article. A root attribute keeps the
  // two components decoupled — neither imports the other.
  useEffect(() => {
    const root = document.documentElement;
    if (!showResults) {
      root.removeAttribute('data-kb-search-open');
      return;
    }
    root.setAttribute('data-kb-search-open', 'true');
    return () => root.removeAttribute('data-kb-search-open');
  }, [showResults]);

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

  /* The panel is `position: absolute` with a flat 380px cap, so nothing stops
     it running past the fold. Measured at 320x568: the listbox opened
     452 -> 667 against a 568px viewport — result #2 half below it, #3 entirely
     below — and recovering them means scrolling the page that is hidden BEHIND
     the panel you are reading.

     Cap it to the space that actually exists. `visualViewport` is the
     instrument, not `innerHeight` and not `100dvh`: on iOS the software
     keyboard occludes 262px (43% of the viewport) and `100dvh` does not shrink
     by a single pixel when it opens. This field is focused whenever the panel
     is open, so the keyboard is up by definition — `innerHeight` here would
     size the panel ~260px into dead space every time. */
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  // One reposition per open, not per scroll event: iOS does its own scrolling
  // when a field takes focus, and re-running scrollIntoView on every
  // visualViewport tick fights it and jitters the page.
  const repositionedRef = useRef(false);

  useEffect(() => {
    if (!showResults) {
      repositionedRef.current = false;
      return;
    }

    const GAP = 8; // matches Results `top: calc(100% + 0.5rem)`
    const EDGE = 12; // breathing room above the viewport floor

    const spaceBelow = (wrap: HTMLDivElement) => {
      const vv = window.visualViewport;
      // getBoundingClientRect() is in LAYOUT-viewport coordinates;
      // visualViewport.offsetTop moves the visual viewport into the same space.
      const visibleBottom = vv ? vv.offsetTop + vv.height : window.innerHeight;
      return visibleBottom - wrap.getBoundingClientRect().bottom - GAP - EDGE;
    };

    const measure = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      let space = spaceBelow(wrap);
      // With the keyboard up on a 568px phone there is often no room below the
      // field at all. Pull the field to the top of the visible area once, then
      // re-measure against the space that opens up.
      if (space < MIN_PANEL_HEIGHT && !repositionedRef.current) {
        repositionedRef.current = true;
        wrap.scrollIntoView({ block: 'start', behavior: 'auto' });
        space = spaceBelow(wrap);
      }
      setMaxHeight(Math.round(Math.max(MIN_PANEL_HEIGHT, Math.min(MAX_PANEL_HEIGHT, space))));
    };

    measure();
    const vv = window.visualViewport;
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    vv?.addEventListener('resize', measure);
    vv?.addEventListener('scroll', measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
      vv?.removeEventListener('resize', measure);
      vv?.removeEventListener('scroll', measure);
    };
  }, [showResults, results.length]);

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
        <S.Results
          id={listboxId}
          role="listbox"
          style={maxHeight === null ? undefined : { maxHeight }}
        >
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
