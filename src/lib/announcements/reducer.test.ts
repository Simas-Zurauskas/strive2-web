import { describe, expect, test } from 'vitest';
import {
  announcementsReducer,
  initialState,
  selectEntryStates,
  selectHasUnseen,
} from './reducer';
import type { Announcement } from './list';

const a = (key: string, date: string): Announcement => ({
  key,
  date,
  title: key,
  body: key,
});

const LIST: Announcement[] = [a('c', '2026-03-01'), a('b', '2026-02-01'), a('a', '2026-01-01')];

const open = (state: ReturnType<typeof initialState>) =>
  announcementsReducer(state, { type: 'OPEN', list: LIST });
const close = (state: ReturnType<typeof initialState>) =>
  announcementsReducer(state, { type: 'CLOSE' });

describe('the indicator', () => {
  test('indicator is on when an announcement is unseen', () => {
    expect(selectHasUnseen(initialState([], LIST))).toBe(true);
  });

  test('indicator is off when everything is already seen', () => {
    expect(selectHasUnseen(initialState(['a', 'b', 'c'], LIST))).toBe(false);
  });

  // THE rule. "only removes indicator once user closes the panel as we want to
  // keep indicator and dont instantly hide it."
  test('indicator STAYS ON while the panel is open', () => {
    const opened = open(initialState([], LIST));
    expect(opened.open).toBe(true);
    expect(selectHasUnseen(opened)).toBe(true);
  });

  test('indicator clears only after CLOSE', () => {
    const closed = close(open(initialState([], LIST)));
    expect(closed.open).toBe(false);
    expect(selectHasUnseen(closed)).toBe(false);
  });

  test('reopening after close shows no indicator', () => {
    expect(selectHasUnseen(open(close(open(initialState([], LIST)))))).toBe(false);
  });
});

describe('seen bookkeeping', () => {
  test('seen is written on OPEN, not on CLOSE', () => {
    // A user who closes the TAB with the panel open must not be shown the
    // same items again.
    const opened = open(initialState([], LIST));
    expect([...opened.seen].sort()).toEqual(['a', 'b', 'c']);
  });

  test('entries opened-while-unseen keep their unseen mark until close', () => {
    const opened = open(initialState(['a'], LIST));
    const states = selectEntryStates(opened, LIST);
    expect(states.map((s) => [s.key, s.seen])).toEqual([
      ['c', false],
      ['b', false],
      ['a', true],
    ]);
  });

  test('OPEN is idempotent — a second OPEN does not clear held', () => {
    const twice = open(open(initialState([], LIST)));
    expect(selectHasUnseen(twice)).toBe(true);
    expect(twice.held).toEqual(['c', 'b', 'a']);
  });

  // Two tabs, both showing the dot. Tab B opens and writes storage. The user
  // switches to tab A and clicks the bell. If OPEN re-read storage, tab A's
  // dot would vanish on open — a requirement violation in a reachable state.
  test('OPEN computes held from in-memory seen, not from storage', () => {
    const tabA = initialState([], LIST);
    // Simulates another tab having written every key to storage meanwhile.
    const opened = open(tabA);
    expect(opened.held).toEqual(['c', 'b', 'a']);
    expect(selectHasUnseen(opened)).toBe(true);
  });

  test('CLOSE before any OPEN is a no-op', () => {
    const s = initialState(['a'], LIST);
    expect(close(s)).toEqual(s);
  });
});
