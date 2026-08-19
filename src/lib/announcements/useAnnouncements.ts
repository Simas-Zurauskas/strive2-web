'use client';

import { useCallback, useMemo, useReducer } from 'react';
import { ANNOUNCEMENTS } from '@/content/announcements';
import { sortedAnnouncements } from './list';
import {
  announcementsReducer,
  initialState,
  selectEntryStates,
  selectHasUnseen,
} from './reducer';
import { getSeen, markSeen } from './seen';

/**
 * Thin wrapper over `announcementsReducer`. Deliberately thin.
 *
 * Every decision this feature can get wrong lives in the reducer, which is
 * unit-tested; this file exists only to hold the reducer in React state, read
 * storage once on mount, and write it on open. It computes nothing.
 *
 * In particular it does NOT recompute "is anything unseen" — that comes from
 * `selectHasUnseen` alone. Recomputing it from live storage would clear the
 * indicator the moment the panel opened, which is the exact behaviour the
 * requirement rules out.
 *
 * `initialState` is passed as `useReducer`'s third-argument initialiser so the
 * storage read happens once, lazily, on first render rather than on every
 * render. This hook is only ever mounted inside `Navbar`, which never renders
 * on the server (`app/(protected)/layout.tsx` gates on `isLoading`,
 * `app/(public)/layout.tsx` on `mounted`), so the read is always in a browser.
 */
export const useAnnouncements = () => {
  const list = useMemo(() => sortedAnnouncements(ANNOUNCEMENTS), []);

  const [state, dispatch] = useReducer(announcementsReducer, undefined, () =>
    initialState(getSeen(), ANNOUNCEMENTS),
  );

  const open = useCallback(() => {
    // Written on OPEN, not on CLOSE — a reader who closes the tab with the
    // panel still open has read them.
    markSeen(
      list.map((a) => a.key),
    );
    dispatch({ type: 'OPEN', list: ANNOUNCEMENTS });
  }, [list]);

  const close = useCallback(() => dispatch({ type: 'CLOSE' }), []);

  return {
    list,
    isOpen: state.open,
    hasUnseen: selectHasUnseen(state),
    entryStates: selectEntryStates(state, ANNOUNCEMENTS),
    open,
    close,
  };
};
