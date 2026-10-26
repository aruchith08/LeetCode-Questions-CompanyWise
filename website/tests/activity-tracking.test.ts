import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useProgressState,
  getLocalDateString,
  getDefaultProgress,
} from '../src/hooks/useProgressState';

describe('Activity Tracking Accuracy & Transitions', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('increments activity for today when a new problem is solved', () => {
    const { result } = renderHook(() => useProgressState());
    const today = getLocalDateString();

    act(() => {
      result.current.toggleSolved(1);
    });

    expect(result.current.getStatus(1)).toBe('solved');
    expect(result.current.progress.activityHistory?.[today]).toBe(1);
    expect(result.current.progress.solvedQuestionTimestamps?.[1]).toBeDefined();
  });

  it('is idempotent: repeated identical operations do not increment activity counts', () => {
    const { result } = renderHook(() => useProgressState());
    const today = getLocalDateString();

    act(() => {
      result.current.setQuestionStatus(1, 'solved');
    });
    expect(result.current.progress.activityHistory?.[today]).toBe(1);

    // Call again with same status
    act(() => {
      result.current.setQuestionStatus(1, 'solved');
    });
    expect(result.current.progress.activityHistory?.[today]).toBe(1); // Still 1, not 2
  });

  it('decrements today activity when unmarking a problem solved today', () => {
    const { result } = renderHook(() => useProgressState());
    const today = getLocalDateString();

    act(() => {
      result.current.toggleSolved(1);
    });
    expect(result.current.progress.activityHistory?.[today]).toBe(1);

    act(() => {
      result.current.toggleSolved(1);
    });
    expect(result.current.getStatus(1)).toBe('unsolved');
    expect(result.current.progress.activityHistory?.[today]).toBe(0);
  });

  it('CRITICAL: unmarking a problem solved on an earlier day decrements the original day, NOT today', () => {
    // Problem 10 was solved on Monday (2026-10-20)
    // Problem 20 was solved on Tuesday (2026-10-21)
    const initialProgress = {
      ...getDefaultProgress(),
      solvedQuestions: { 10: 'solved' as const },
      solvedQuestionTimestamps: {
        10: '2026-10-20T14:30:00.000Z',
      },
      activityHistory: {
        '2026-10-20': 1,
      },
    };
    localStorage.setItem('companywise-progress', JSON.stringify(initialProgress));

    const { result } = renderHook(() => useProgressState());
    const today = getLocalDateString();

    // Now today, the user solves Problem 20
    act(() => {
      result.current.toggleSolved(20);
    });

    expect(result.current.progress.activityHistory?.[today]).toBe(1);
    expect(result.current.progress.activityHistory?.['2026-10-20']).toBe(1);

    // Now today, the user unmarks Problem 10 (which was solved on 2026-10-20)
    act(() => {
      result.current.toggleSolved(10);
    });

    // Today's activity MUST remain 1!
    expect(result.current.progress.activityHistory?.[today]).toBe(1);
    // The original solve date's activity MUST be decremented to 0!
    expect(result.current.progress.activityHistory?.['2026-10-20']).toBe(0);
    expect(result.current.getStatus(10)).toBe('unsolved');
  });

  it('decrements original solve date when transitioning from solved to attempted', () => {
    const initialProgress = {
      ...getDefaultProgress(),
      solvedQuestions: { 5: 'solved' as const },
      solvedQuestionTimestamps: {
        5: '2026-10-15T09:00:00.000Z',
      },
      activityHistory: {
        '2026-10-15': 1,
      },
    };
    localStorage.setItem('companywise-progress', JSON.stringify(initialProgress));

    const { result } = renderHook(() => useProgressState());

    act(() => {
      result.current.toggleAttempted(5);
    });

    expect(result.current.getStatus(5)).toBe('attempted');
    expect(result.current.progress.activityHistory?.['2026-10-15']).toBe(0);
  });

  it('clamps activity counts at zero to prevent negative numbers', () => {
    const initialProgress = {
      ...getDefaultProgress(),
      solvedQuestions: { 1: 'solved' as const },
      solvedQuestionTimestamps: {
        1: '2026-10-10T12:00:00.000Z',
      },
      activityHistory: {
        '2026-10-10': 0, // already 0
      },
    };
    localStorage.setItem('companywise-progress', JSON.stringify(initialProgress));

    const { result } = renderHook(() => useProgressState());

    act(() => {
      result.current.toggleSolved(1);
    });

    expect(result.current.progress.activityHistory?.['2026-10-10']).toBe(0);
  });

  it('handles historical LeetCode imports: genuine timestamp sets activity on historical date', () => {
    const { result } = renderHook(() => useProgressState());
    const historicalEpoch = 1729000000; // 2024-10-15 approx
    const histDateStr = getLocalDateString(new Date(historicalEpoch * 1000));
    const today = getLocalDateString();

    act(() => {
      result.current.markBatchSolved([
        { id: 99, timestamp: String(historicalEpoch) },
      ]);
    });

    expect(result.current.getStatus(99)).toBe('solved');
    // Recorded on historical date
    expect(result.current.progress.activityHistory?.[histDateStr]).toBe(1);
    // NOT counted as solved today
    expect(result.current.progress.activityHistory?.[today]).toBeUndefined();
  });

  it('preserves solved status without fabricating dates if historical timestamp is absent', () => {
    const { result } = renderHook(() => useProgressState());
    const today = getLocalDateString();

    act(() => {
      // Historical submission without timestamp
      result.current.markBatchSolved([
        { id: 77, timestamp: undefined },
      ]);
    });

    expect(result.current.getStatus(77)).toBe('solved');
    // Does NOT fabricate today's date in activityHistory
    expect(result.current.progress.activityHistory?.[today]).toBeUndefined();
  });
});
