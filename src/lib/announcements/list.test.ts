import { describe, expect, test } from 'vitest';
import { ANNOUNCEMENTS } from '@/content/announcements';
import { sortedAnnouncements } from './list';
import type { Announcement } from './list';

const entry = (key: string, date: string): Announcement => ({
  key,
  date,
  title: `Title ${key}`,
  body: `Body ${key}`,
});

describe('sort order', () => {
  test('newest announcement is first', () => {
    const sorted = sortedAnnouncements([
      entry('old', '2026-01-01'),
      entry('newest', '2026-06-01'),
      entry('middle', '2026-03-01'),
    ]);
    expect(sorted.map((a) => a.key)).toEqual(['newest', 'middle', 'old']);
  });

  test('an empty list sorts to an empty list without throwing', () => {
    expect(sortedAnnouncements([])).toEqual([]);
  });

  test('sorting does not mutate its input', () => {
    const input = [entry('a', '2026-01-01'), entry('b', '2026-06-01')];
    const before = input.map((a) => a.key);
    sortedAnnouncements(input);
    expect(input.map((a) => a.key)).toEqual(before);
  });
});

// These four run against the REAL shipped list. A fixture would not catch a
// duplicate key or a malformed date actually being committed, and a duplicate
// key silently corrupts seen-state.
describe('the shipped list', () => {
  // Guards the `newest announcement is first` break-it rather than the product.
  // Flipping the comparator can only turn that test red while the shipped list
  // holds at least two entries with DIFFERENT dates; drop to one entry, or two
  // sharing a date, and ascending and descending are identical and the check
  // silently stops checking anything.
  test('the shipped list keeps the sort assertion falsifiable', () => {
    expect(ANNOUNCEMENTS.length).toBeGreaterThanOrEqual(2);
    const dates = ANNOUNCEMENTS.map((a) => a.date);
    expect(new Set(dates).size).toBe(dates.length);
  });

  test('keys are unique', () => {
    const keys = ANNOUNCEMENTS.map((a) => a.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  test('dates are valid ISO dates', () => {
    for (const a of ANNOUNCEMENTS) {
      expect(a.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(a.date))).toBe(false);
    }
  });

  test('every entry has a non-empty title and body', () => {
    for (const a of ANNOUNCEMENTS) {
      expect(a.title.trim().length).toBeGreaterThan(0);
      expect(a.body.trim().length).toBeGreaterThan(0);
    }
  });
});
