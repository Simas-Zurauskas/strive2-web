import { afterEach, describe, expect, test, vi } from 'vitest';
import { STORAGE_KEY, getSeen, markSeen, unseenKeys } from './seen';

/** A `Storage`-shaped double. Only the four members this module touches. */
const fakeStorage = (initial?: string): Storage => {
  const map = new Map<string, string>();
  if (initial !== undefined) map.set(STORAGE_KEY, initial);
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
    key: () => null,
    get length() {
      return map.size;
    },
  } as Storage;
};

const throwingStorage = (): Storage =>
  ({
    getItem: () => {
      throw new Error('SecurityError: storage is disabled');
    },
    setItem: () => {
      throw new Error('QuotaExceededError');
    },
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  }) as Storage;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('reading', () => {
  test('first run reports every announcement unseen', () => {
    const s = fakeStorage();
    expect(getSeen(s)).toEqual([]);
    expect(unseenKeys(['a', 'b'], getSeen(s))).toEqual(['a', 'b']);
  });

  test('a corrupt JSON value is treated as empty, not thrown', () => {
    expect(getSeen(fakeStorage('{not json'))).toEqual([]);
  });

  test('a non-array JSON value is treated as empty', () => {
    expect(getSeen(fakeStorage('{"a":1}'))).toEqual([]);
    expect(getSeen(fakeStorage('"a"'))).toEqual([]);
    expect(getSeen(fakeStorage('null'))).toEqual([]);
  });

  test('an array containing non-strings is filtered, not trusted', () => {
    expect(getSeen(fakeStorage('["a",1,null,{},"b"]'))).toEqual(['a', 'b']);
  });

  test('a throwing storage does not propagate', () => {
    expect(() => getSeen(throwingStorage())).not.toThrow();
    expect(getSeen(throwingStorage())).toEqual([]);
    expect(() => markSeen(['a'], throwingStorage())).not.toThrow();
  });
});

describe('writing', () => {
  test('marking is additive, never replacing', () => {
    const s = fakeStorage('["a"]');
    markSeen(['b'], s);
    expect(getSeen(s).sort()).toEqual(['a', 'b']);
  });

  test('keys absent from the list are preserved', () => {
    // An announcement removed from the shipped list must not be resurfaced if
    // it is ever added back.
    const s = fakeStorage('["retired"]');
    markSeen(['new'], s);
    expect(getSeen(s)).toContain('retired');
  });

  test('markSeen is idempotent', () => {
    const s = fakeStorage();
    markSeen(['a'], s);
    markSeen(['a'], s);
    markSeen(['a'], s);
    expect(getSeen(s)).toEqual(['a']);
  });
});

// The paths that actually ship. Every test above injects a double, so without
// these the defaulted call path — the only one production uses — has no
// coverage at all.
describe('the defaulted call path', () => {
  test('the no-argument call path does not throw when window is undefined', () => {
    vi.stubGlobal('window', undefined);
    expect(() => getSeen()).not.toThrow();
    expect(getSeen()).toEqual([]);
    expect(() => markSeen(['a'])).not.toThrow();
  });

  test('the no-argument call path does not throw when localStorage getter throws', () => {
    // Safari in private mode raises on PROPERTY ACCESS, before any method call.
    vi.stubGlobal('window', {
      get localStorage(): Storage {
        throw new Error('SecurityError');
      },
    });
    expect(() => getSeen()).not.toThrow();
    expect(getSeen()).toEqual([]);
    expect(() => markSeen(['a'])).not.toThrow();
  });
});

describe('unseenKeys', () => {
  test('returns only keys not present in seen, preserving list order', () => {
    expect(unseenKeys(['a', 'b', 'c'], ['b'])).toEqual(['a', 'c']);
  });
});
