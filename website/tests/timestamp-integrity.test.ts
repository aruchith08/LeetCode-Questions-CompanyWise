import { describe, it, expect, beforeEach } from 'vitest';
import {
  normalizeTimestampToDate,
  normalizeTimestampToISO,
  normalizeTimestampToSecondsString,
} from '../src/utils/timestampUtils';
import { validateAndParseBackup } from '../src/utils/backupValidation';
import { useProgressState } from '../src/hooks/useProgressState';
import { renderHook, act } from '@testing-library/react';

describe('Timestamp Normalization & Activity Integrity', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('accurately distinguishes Unix epoch seconds from milliseconds without inventing current date', () => {
    // 10 digits = Unix epoch seconds (e.g. 1700000000 = Nov 14, 2023)
    const dateFromSeconds = normalizeTimestampToDate(1700000000);
    expect(dateFromSeconds).not.toBeNull();
    expect(dateFromSeconds?.getUTCFullYear()).toBe(2023);

    // 13 digits = Unix epoch milliseconds (e.g. 1700000000000)
    const dateFromMs = normalizeTimestampToDate(1700000000000);
    expect(dateFromMs).not.toBeNull();
    expect(dateFromMs?.getUTCFullYear()).toBe(2023);

    // String Unix seconds: '1700000000'
    const dateFromStringSeconds = normalizeTimestampToDate('1700000000');
    expect(dateFromStringSeconds?.getUTCFullYear()).toBe(2023);

    // ISO string
    const dateFromIso = normalizeTimestampToDate('2023-11-14T22:13:20.000Z');
    expect(dateFromIso?.getUTCFullYear()).toBe(2023);

    // Missing, null, undefined, invalid
    expect(normalizeTimestampToDate(undefined)).toBeNull();
    expect(normalizeTimestampToDate(null)).toBeNull();
    expect(normalizeTimestampToDate('')).toBeNull();
    expect(normalizeTimestampToDate('invalid-date')).toBeNull();
    expect(normalizeTimestampToDate(-100)).toBeNull();
  });

  it('never substitutes Date.now() for missing LeetCode submission timestamps during backup validation', () => {
    const backupJson = JSON.stringify({
      version: 2,
      solvedQuestions: {},
      leetcodeAccount: {
        username: 'coder123',
        totalSolved: 1,
        easySolved: 1,
        mediumSolved: 0,
        hardSolved: 0,
        recentSubmissions: [
          {
            id: 'sub-1',
            title: 'Two Sum',
            titleSlug: 'two-sum',
            // Missing timestamp!
          },
        ],
      },
    });

    const parsed = validateAndParseBackup(backupJson);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const submissions = parsed.leetcodeAccount?.recentSubmissions;
      expect(submissions).toHaveLength(1);
      // Crucial: timestamp must be undefined, NEVER fabricated with current date/time!
      expect(submissions?.[0].timestamp).toBeUndefined();
    }
  });

  it('protects activity history: unmarking a problem imported without timestamp does not decrement daily activity', () => {
    const { result } = renderHook(() => useProgressState());

    // Solve question 100 manually today
    act(() => {
      result.current.toggleSolved(100);
    });

    const todaySolvesBefore = result.current.progress.activityHistory?.[
      new Date().toISOString().split('T')[0]
    ] || 0;
    expect(todaySolvesBefore).toBe(1);

    // Import a LeetCode problem (e.g. #200) with unknown timestamp
    act(() => {
      result.current.markBatchSolved([{ id: 200 }]); // no timestamp provided
    });

    expect(result.current.getStatus(200)).toBe('solved');
    // Daily solve count must NOT have increased artificially
    const todaySolvesAfterImport = result.current.progress.activityHistory?.[
      new Date().toISOString().split('T')[0]
    ] || 0;
    expect(todaySolvesAfterImport).toBe(1);

    // Now unmark problem 200 (toggle to unsolved)
    act(() => {
      result.current.toggleSolved(200);
    });

    expect(result.current.getStatus(200)).toBe('unsolved');
    // Today's genuine activity history MUST NOT be decremented!
    const todaySolvesAfterUnmark = result.current.progress.activityHistory?.[
      new Date().toISOString().split('T')[0]
    ] || 0;
    expect(todaySolvesAfterUnmark).toBe(1);
  });
});
