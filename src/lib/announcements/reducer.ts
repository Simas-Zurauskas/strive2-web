/**
 * The one rule this feature exists to get right, kept away from React.
 *
 * The requirement: *"what was seen shoudl be ticked automatically, but only
 * removes indicator once user closes the panel as we want to keep indicator
 * and dont instantly hide it."*
 *
 * So opening the panel does two things that pull in opposite directions — it
 * records everything as seen, and it must NOT let the indicator go out. `held`
 * is what reconciles them: the set of keys that were unseen at the moment the
 * panel opened. Storage is written immediately; `held` keeps the dot and the
 * per-entry "new" marks alive until CLOSE.
 *
 * Writing on OPEN rather than on CLOSE is deliberate. A reader who closes the
 * browser tab with the panel still open has read the announcements; they
 * should not meet them again next session.
 *
 * All of this lives in a pure reducer because it is the part that can be
 * wrong. `selectHasUnseen` is the ONLY boolean the UI may consume — `unseenKeys`
 * is intentionally not re-exported from here, so a component cannot recompute
 * "is anything unseen" from live storage and clear the dot the instant the
 * panel opens, which is precisely the behaviour the requirement forbids.
 */

import { sortedAnnouncements } from './list';
import { unseenKeys } from './seen';
import type { Announcement } from './list';

export interface AnnouncementsState {
  open: boolean;
  /** Keys already recorded as seen, in memory. Mirrors storage. */
  seen: string[];
  /** Keys that were unseen when the panel was opened. Cleared on CLOSE. */
  held: string[];
}

export type AnnouncementsAction = { type: 'OPEN'; list: readonly Announcement[] } | { type: 'CLOSE' };

export const initialState = (seen: string[], list: readonly Announcement[]): AnnouncementsState => ({
  open: false,
  seen,
  held: unseenKeys(
    sortedAnnouncements(list).map((x) => x.key),
    seen,
  ),
});

export const announcementsReducer = (
  state: AnnouncementsState,
  action: AnnouncementsAction,
): AnnouncementsState => {
  switch (action.type) {
    case 'OPEN': {
      // Already open: do nothing at all. Recomputing here would find `seen`
      // already containing everything, produce an empty `held`, and put the
      // dot out while the panel is still on screen.
      if (state.open) return state;
      const held = unseenKeys(
        sortedAnnouncements(action.list).map((x) => x.key),
        // `state.seen`, never a fresh read of storage. Two tabs both showing
        // the dot: if tab B opens the panel and writes storage, tab A must
        // still hold its own dot when the user clicks its bell.
        state.seen,
      );
      return {
        open: true,
        seen: [...new Set([...state.seen, ...held])],
        held,
      };
    }
    case 'CLOSE':
      return state.open ? { ...state, open: false, held: [] } : state;
    default:
      return state;
  }
};

/** The only unread signal the UI reads. */
export const selectHasUnseen = (state: AnnouncementsState): boolean => state.held.length > 0;

/** Per-entry marks for rendering, newest first. */
export const selectEntryStates = (
  state: AnnouncementsState,
  list: readonly Announcement[],
): { key: string; seen: boolean }[] =>
  sortedAnnouncements(list).map((x) => ({ key: x.key, seen: !state.held.includes(x.key) }));
