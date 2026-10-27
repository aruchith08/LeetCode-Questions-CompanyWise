import { describe, it, expect, beforeEach } from 'vitest';
import { validateProgressSchema } from '../src/utils/backupValidation';
import {
  useProgressState,
  isStorageCorrupted,
  clearCorruptionFlag,
  resetCorruptedStorage,
} from '../src/hooks/useProgressState';
import { renderHook, act } from '@testing-library/react';

describe('Storage Schema Validation & Corruption Protection', () => {
  beforeEach(() => {
    localStorage.clear();
    clearCorruptionFlag();
  });

  it('validates authentic valid current progress', () => {
    const validData = {
      solvedQuestions: { 1: 'solved', 2: 'attempted' },
      bookmarks: [1, 2, 3],
      targetCompanies: ['google', 'meta'],
      activityHistory: { '2026-10-25': 2 },
      lastUpdated: '2026-10-25T12:00:00.000Z',
    };

    const result = validateProgressSchema(validData);
    expect(result.valid).toBe(true);
    expect(result.progress?.solvedQuestions).toEqual({ 1: 'solved', 2: 'attempted' });
    expect(result.progress?.bookmarks).toEqual([1, 2, 3]);
  });

  it('rejects syntactically valid JSON with malformed bookmarks (e.g. string "invalid")', () => {
    const malformedData = {
      solvedQuestions: { 1: 'solved' },
      bookmarks: 'invalid', // should be an array of numbers!
    };

    const result = validateProgressSchema(malformedData);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/field "bookmarks" must be an array/i);
  });

  it('rejects syntactically valid JSON with malformed solvedQuestions (e.g. array or invalid status)', () => {
    const malformedData1 = {
      solvedQuestions: ['solved', 'attempted'], // should be an object!
    };
    expect(validateProgressSchema(malformedData1).valid).toBe(false);

    const malformedData2 = {
      solvedQuestions: { 1: 'completed-unknown-status' },
    };
    expect(validateProgressSchema(malformedData2).valid).toBe(false);
  });

  it('rejects syntactically valid JSON with malformed activityHistory (e.g. negative count or invalid date)', () => {
    const malformedDate = {
      solvedQuestions: {},
      activityHistory: { 'not-a-date': 3 },
    };
    expect(validateProgressSchema(malformedDate).valid).toBe(false);

    const negativeCount = {
      solvedQuestions: {},
      activityHistory: { '2026-10-25': -5 },
    };
    expect(validateProgressSchema(negativeCount).valid).toBe(false);
  });

  it('recovers from valid legacy storage when primary is corrupted', () => {
    // Primary has invalid field type: bookmarks as string
    localStorage.setItem(
      'companywise-progress',
      JSON.stringify({ solvedQuestions: {}, bookmarks: 'corrupted-bookmarks' })
    );

    // Legacy has valid progress
    localStorage.setItem(
      'codewise-progress',
      JSON.stringify({
        solvedQuestions: { 15: 'solved' },
        bookmarks: [15],
      })
    );

    const { result } = renderHook(() => useProgressState());

    // Should successfully recover from legacy storage
    expect(result.current.progress.solvedQuestions[15]).toBe('solved');
    expect(result.current.progress.bookmarks).toEqual([15]);

    // Primary corrupt content should be preserved in corrupt backup key
    expect(localStorage.getItem('companywise-progress-corrupt-backup')).toBeTruthy();
  });

  it('aborts auto-save when corrupted storage is detected to prevent silent data loss', () => {
    // Put corrupted JSON in primary storage
    const corruptPayload = '{"solvedQuestions": {1: "solved", bookmarks: CORRUPT_UNQUOTED}';
    localStorage.setItem('companywise-progress', corruptPayload);

    const { result } = renderHook(() => useProgressState());

    expect(isStorageCorrupted()).toBe(true);

    // Stashed in backup key
    expect(localStorage.getItem('companywise-progress-corrupt-backup')).toBe(corruptPayload);

    // Calling toggleSolved should NOT overwrite the corrupted primary key while flagged
    act(() => {
      result.current.toggleSolved(42);
    });

    // Primary storage should NOT have been overwritten by auto-save
    expect(localStorage.getItem('companywise-progress')).toBe(corruptPayload);
  });

  it('does NOT overwrite an existing recovery copy in corrupt-backup key', () => {
    const firstCorruptCopy = '{"firstCorrupt": true}';
    const secondCorruptCopy = '{"secondCorrupt": true}';

    // Earlier recovery copy exists
    localStorage.setItem('companywise-progress-corrupt-backup', firstCorruptCopy);
    localStorage.setItem('companywise-progress', secondCorruptCopy);

    renderHook(() => useProgressState());

    // Original first copy must remain intact!
    expect(localStorage.getItem('companywise-progress-corrupt-backup')).toBe(firstCorruptCopy);
  });

  it('allows explicit user reset via resetCorruptedStorage', () => {
    localStorage.setItem('companywise-progress', 'CORRUPT_JSON');
    renderHook(() => useProgressState());

    expect(isStorageCorrupted()).toBe(true);

    act(() => {
      resetCorruptedStorage();
    });

    expect(isStorageCorrupted()).toBe(false);
    expect(localStorage.getItem('companywise-progress')).toBeNull();
  });
});
